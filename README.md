[洪民憙雜記]
============

[洪民憙]의 多言語 블로그. [Astro]로 대부분의 HTML을 靜的 生成하고 [Netlify]에서
配布한다. ActivityPub 엔드포인트만 Netlify Functions에서 on-demand rendering으로
處理한다.
國漢文混用體(`ko-Kore`) 글에서는 [Seonbi]를 通해 한글專用體(`ko-Hang-KR`)를
自動으로 派生한다.

開發
----

Node.js 26, pnpm 11, Seonbi 0.5.0이 必要하다. [mise]가 있으면 다음 命令으로
모두 맞출 수 있다.

```bash
mise run dev
mise run build
mise run check
```

生成物은 *dist/*에 놓인다. `pnpm netlify:dev`는 Netlify Edge Function과
Functions를 包含한 로컬 環境을 띄운다. Netlify Database를 쓸 수 있으면
PostgreSQL과 Async Workloads도 使用한다. 普通 `mise run dev`에서는 federation
狀態와 queue를 메모리에 둔다.

ActivityPub
-----------

이 블로그는 `@hongminhee@writings.hongminhee.org` 計定을 提供한다. WebFinger의
標準 固定 經路인 `/.well-known/webfinger`를 除外한 ActivityPub 엔드포인트는
모두 `/ap/` 아래에 있다.

- Actor: `/ap/actors/hongminhee`
- Shared inbox: `/ap/inbox`
- Outbox: `/ap/actors/hongminhee/outbox`
- Article: `/ap/articles/{year}/{month}/{slug}`

하나의 論理的 글은 하나의 `Article`로 表現된다. 모든 飜譯의 題目, 說明, HTML
本文과 明示的 言語 URL을 함께 싣는다. 기존 글은 outbox에서 볼 수 있지만,
ActivityPub을 처음 켠 配布에서는 팔로워에게 一括 發送하지 않는다. 그 뒤의
新增, 修正, 削除만 `Create`, `Update`, `Delete`로 傳達된다.

配布
----

Netlify에서 이 貯藏所를 連結하면 *netlify.toml*의 빌드 設定이 適用된다.
Netlify의 Pretty URLs 後處理는 明示的으로 꺼 두었는데, 이는
_index.ko-kore.html_ 같은 旣存 公開 URL을 保存하기 爲함이다.

ActivityPub을 production에서 켜려면 Netlify site에 [Netlify Database]를
provision하고 [Async Workloads] extension을 設置해야 한다. Web request와 queue
consumer는 같은 PostgreSQL KV 및 `NetlifyMessageQueue`를 使用한다. Deploy
Preview와 branch deploy에서는 federation과 workload가 모두 꺼진다.

成功한 production deploy는 `writings:sync-posts` workload를 enqueue한다. 매일
實行되는 reconciliation도 같은 workload를 enqueue하므로 deploy event를 놓쳐도
狀態가 맞춰진다. Async Workloads에서 dead-lettered ordering message가 생기면
event가 더는 retry되지 않는지 먼저 確認한다. 그 뒤 event data의 `orderingKey`와
`orderingSequence`를 가지고 `NetlifyMessageQueue.skipOrderingSequence()`를 한 번
呼出한다. retry될 可能性이 있는 event를 건너뛰면 順序 保證이 깨진다.

현재 Fedify 2.4.0 pre-release를 正確한 버전으로 固定한다. 2.4.0 正式版이 나오면
`@fedify/astro`, `@fedify/netlify`, `@fedify/fedify`, `@fedify/postgres`,
`@fedify/vocab`, `@fedify/vocab-runtime`을 함께 올려야 한다.

[洪民憙雜記]: https://writings.hongminhee.org/
[洪民憙]: https://hongminhee.org/
[Astro]: https://astro.build/
[Netlify]: https://www.netlify.com/
[Netlify Database]: https://docs.netlify.com/build/data-and-storage/netlify-database/
[Async Workloads]: https://docs.netlify.com/build/async-workloads/get-started/
[Seonbi]: https://github.com/dahlia/seonbi
[mise]: https://mise.jdx.dev/
