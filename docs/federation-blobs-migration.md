# Federation 저장소를 Netlify Blobs로 옮기기

이 절차는 기존 `writings.hongminhee.org` 계정을 보존하기 위한 일회성 전환이다.
코드를 배포하는 것만으로 저장소가 바뀌지는 않는다. 기본값은 기존 PostgreSQL이며,
`FEDERATION_STORAGE=blobs`를 명시해야 전환된다. 빈 production store는 거부한다.
Deploy Preview와 branch deploy에서는 두 백엔드 모두 사용하지 않는다.

## 옮기는 데이터

배우의 RSA/Ed25519 키, 팔로워, 게시물 동기화 상태, 큐 순서 상태 및 아직 유효한
중복 방지 기록을 복사한다. Fedify 내부 데이터라도 모두 버려도 되는 캐시는 아니다.
중복 방지 기록을 버리면 이미 취소된 Follow가 재처리될 수 있다.

| 데이터                                                                             | 이전 정책                                       |
| ---------------------------------------------------------------------------------- | ----------------------------------------------- |
| `writings/federation/*`, `fedify/netlify/ordering/*`                               | 보존                                            |
| `_fedify/activityIdempotence`, nonce·task 중복 방지·circuit 상태, 알 수 없는 키    | 만료되지 않은 기록 보존                         |
| `_fedify/publicKey`, `_fedify/remoteDocument`, `_fedify/httpMessageSignaturesSpec` | 확인된 캐시 형태만 제외하고 필요할 때 다시 조회 |

캐시 제외 규칙은 Fedify `2.4.0-dev.1936`의 기본 prefix와 키 형태에 맞췄다.
세 종류 모두 prefix 뒤에 한 요소가 붙는 키를 제외하며, 공개키 조회 실패 캐시인
`_fedify/publicKey/__fetchError/{keyId}`도 제외한다. 나머지 형태는 보존한다.
애플리케이션에서 저장한 자신의 계정 키와 원격 공개키 캐시는 서로 다른 데이터다.
재조회가 필요한 원격 서버가 일시적으로 꺼져 있으면 초기 서명 검증·송신이 지연될
수 있다. 원본과 백업의 캐시는 삭제하지 않는다.

PostgreSQL의 `created + ttl`을 그대로 절대 만료 시각으로 저장하므로 보존하는
기록의 TTL이 재시작되지 않는다. 이전 시도의 살아 있는 캐시가 대상에 이미 있다면
현재 복사 대상과 일치하지 않아 충돌로 중단한다. 이를 자동 삭제하지 않는다.

도구는 원본 `fedify_kv_v2`를 read-only repeatable-read transaction으로 읽는다.
원본의 수정·삭제나 스키마 초기화는 하지 않는다. 대상은 strong consistency로
읽고 조건부로 쓴다. 충돌하는 살아 있는 데이터가 있으면 복사 전에 중단한다.
부분 복사 결과가 원본과 같으면 재개할 수 있으며, 만료된 부분 복사는 무시한다.
최종 검증 뒤에만 origin에 묶인 readiness marker를 쓴다. marker가 이미 있으면
다시 복사하지 않는다.

사전 검사·복사·재검증은 각각 최대 4개 작업을 병렬로 처리한다.
`--concurrency 1`로 순차 실행하거나 1–16 범위에서 조절할 수 있다.
모든 사전 검사가 끝나기 전에는 쓰지 않으며, 실패하면 새 작업 배정을 멈추고
이미 시작한 작업이 끝난 뒤 오류를 반환한다. 성공한 모든 복사를 재검증한 뒤에만
marker를 쓴다. dry-run은 사전 검사까지만 수행한다.

CLI의 HTTP 요청은 서명 URL 발급과 SDK 재시도까지 합쳐 초당 최대 4회 시작한다.
429 응답의 `Retry-After`와 `X-RateLimit-Reset`은 모든 작업이 공유하는 대기 시간에
반영한다. 재시도 횟수는 고정한 Blobs SDK의 제한을 따르며 무한 재시도하지 않는다.
출력의 `selected`, `skippedCache`, `expired`는 각각 이전 대상으로 선택한 건수,
재생성 가능한 캐시를 제외한 건수, 만료로 제외한 건수다. 키나 값은 출력하지 않는다.

## 전환 절차

1. 기존 DB 백업을 확보하고 현재 배우의 공개키 지문과 팔로워 수를 기록한다.
   비밀키나 연결 문자열을 로그·명령행 인자·저장소에 남기지 않는다.
2. **이 코드로** `FEDERATION_STORAGE=postgres`, `FEDERATION_MAINTENANCE=true`를
   설정하여 production에 배포한다. 설정은 Functions와 빌드에 모두 적용한다.
   maintenance는 federation 요청에 503/no-store를 반환하고 신규 게시물 동기화를
   막는다. 기존 federation 큐는 선택한 저장소를 사용하여 계속 처리한다.
   이미 CDN에 저장된 공개 GET 응답은 TTL 동안 남아 있을 수 있다. 이는 inbox의
   쓰기 차단 여부를 확인하는 방법이 아니다. 실제 함수 응답과 로그로 확인한다.
3. Netlify에서 이전 배포의 실행과 재시도, 예약·지연 작업, dead-letter 작업을
   확인하여 모든 이전 writer가 멈추고 큐가 완전히 소진되었음을 확인한다.
   dead-letter 작업의 순서를 건너뛰기 전에 더는 재시도되지 않음을 확인한다.
   DB ordering 상태만으로 전체 큐 소진을 증명할 수는 없다. 동기화 lock은
   최대 10분 동안 남을 수 있으므로 만료를 기다린다. 복사·전환이 끝날 때까지
   maintenance를 유지하고 다른 배포, 수동 작업, DB 쓰기를 실행하지 않는다.
4. 운영자 로컬 환경에서 `MIGRATION_DATABASE_URL`, `NETLIFY_SITE_ID`,
   `NETLIFY_AUTH_TOKEN`을 안전하게 주입한다. 대상 site가 production인지 직접
   대조한다. Netlify Dev나 다른 Blobs 환경 설정이 없는 깨끗한 셸을 사용한다.
   도구는 대상 store `fedify`와 origin `https://writings.hongminhee.org`를 사용한다.

   ```sh
   pnpm federation:migrate
   pnpm federation:migrate --apply --quiesced
   ```

   첫 명령은 읽기 전용이다. 두 번째 명령은 위의 쓰기 중단을 확인했다는 명시적
   선언이며 실제 대상에 쓴다. 출력에는 건수만 표시한다. 실패하면 maintenance를
   유지한다. marker를 쓰기 전에 실패한 동일한 복사만 재개할 수 있다.

5. 성공 후 `FEDERATION_STORAGE=blobs`로 바꾸어 다시 배포하되 maintenance는
   유지한다. 모든 함수가 같은 설정을 사용하는지 확인한다. marker가 없거나
   runtime origin이 다르면 서비스를 시작하지 못한다. 환경 변수만 바꾸고
   이미 배포된 코드까지 전환되었다고 가정하지 않는다.
6. `FEDERATION_MAINTENANCE`를 해제하여 배포하고 WebFinger, 배우 공개키 지문,
   팔로워 수, outbox, inbox 처리와 큐 완료를 확인한다. 오래된 CDN 응답만으로
   검증하지 않는다. 게시물 reconciliation이 성공하는지도 확인한다.
7. 안정화 뒤 DB 해제는 별도 작업으로 진행한다. 이 변경은 DB를 삭제하지 않는다.

Blobs에 쓰기가 시작된 뒤에는 PostgreSQL을 사용하는 이전 배포로 즉시 롤백하지
않는다. 새 상태가 PostgreSQL에는 없기 때문이다. 문제가 생기면 **Blobs를 유지한 채**
maintenance를 켠 새 배포로 멈추고 조사한다. 역방향 마이그레이션은 이 도구의
범위에 포함되지 않는다. readiness marker를 지워 재복사하는 것도 금지한다.

## 제한과 로컬 패치

Fedify `2.4.0-dev.1936`의 인코딩을 적용한 키는 600바이트 이하여야 한다.
초과한 이전 대상 키가 있으면 쓰기 전에 중단한다. 제외 대상으로 확인한 캐시에는
이 제한을 적용하지 않는다. 원본 키를 비공개 환경에서 조사하고
해당 데이터의 안전한 처리 방법을 별도로 검토한 뒤 재시도한다. TTL이 있는 키는
maintenance 상태에서 만료를 기다릴 수 있다. 중복 방지 기록·팔로워·계정 키를
임의로 버리지 않는다. 런타임에서도
아주 긴 외부 URL은 같은 제한에 걸릴 수 있다.

Blobs의 만료된 데이터와 CAS tombstone은 논리적으로만 사라지고 실제 객체는
남는다. 자동 청소는 이 변경에 포함되지 않는다.

`@netlify/blobs` 11.0.3과 Netlify Dev가 사용하는 10.7.9에 `pnpm patch`로
GET/HEAD ETag와 conditional GET 수정을 적용했다.
[Fedify PR #1029](https://github.com/fedify-dev/fedify/pull/1029)의 패치와 같다.
업스트림 수정판으로 올릴 때는 두 의존 경로의 로컬 서버 테스트를 통과한 뒤
_patches/_ 파일과 *pnpm-workspace.yaml*의 해당 설정을 함께 제거한다.

개발용 서버에는 동시 조건부 PUT의 원자성 문제가 별도로 있다. 테스트는 실제
서버의 순차 CAS·오래된 ETag 거부·만료·tombstone·어댑터 인코딩을 확인하지만,
프로덕션 동시성이나 실제 데이터 전환을 검증한 것은 아니다. 개발 서버의 동시성
수정과 프로덕션 smoke test는 별도 후속 작업이다.
