---
published: 2026-07-16T01:00:00+09:00
reads:
  五年: 5년
  九十年代: 90년대
---

블로그에 ActivityPub 聯動을 붙였다
==================================

[직접 만든 靜的 사이트 生成機인 Jikji로 이 블로그를 만들고 나서][1] 五年 가까이
흘렀다. 그때의 나는 아직 TypeScript나 最新 웹 技術에 익숙하지 않았고,
[ActivityPub] 具顯도 해 본 적이 없었다. 하지만 이제는 TypeScript와 最新 웹
技術에 比較的 익숙해졌고, ActivityPub은 내게 重要한 技術이 되었다. 게다가
名色이 [Fedify] 메인테이너인데 정작 블로그가 聯合이 안 되어 있다는 게 늘
마음에 걸리기도 했다. 그래서 블로그에 ActivityPub 聯動을 붙이게 되었다.

[1]: https://writings.hongminhee.org/2021/12/new-blog/
[Fedify]: https://fedify.dev/
[ActivityPub]: https://www.w3.org/TR/activitypub/


旣存 스택: Jikji + PHP
----------------------

이 블로그는 元來 [Jikji]라는 내가 直接 Deno로 만든 靜的 사이트 生成機
基盤이었다. 嚴密하게는 靜的 사이트라고 말하기는 어려웠는데,
옛날 [Movable Type]이 그러했던 것처럼, HTML만을 生成하는 게 아니라 PHP도 一部
生成했기 때문이다. PHP는 主로 HTTP [內容 協商][]을 爲해서 쓰였다. 브라우저의
[`Accept-Language`] 헤더를 보고, 國漢文混用 朝鮮語, 한글 專用 韓國語, 英語,
日本語 中에 適切한 言語로 表示했다. 但只 그뿐이지만.

이미 PHP를 쓰고 있으니, PHP로 얇게 ActivityPub 具顯을 붙이는 것을 먼저
考慮했다. 하지만 PHP를 쓰고 있다곤 해도 直接 코딩하는 게 아니라 Jikji가
生成해줬기 때문에 쓴 것이지, PHP를 손으로 直接 코딩하고 싶지 않다는 생각이
들었다. 새 글이 올라오면 自動으로 `Create(Article)` 액티비티를 팔로워들에게
傳達해야 하는데 그러자면 어차피 메시지 큐 같은 構造가 必要해진다. PHP에
메시지 큐까지 붙여서 使用하게 되면, 私見으로는 PHP에 適合한 規模와 複雜度를
벗어난다는 느낌도 들었다. 그리고 무엇보다, Fedify가 있는데 굳이 ActivityPub
具顯을 바닥부터 하고 싶지 않다는 생각도 했다.

그래서 PHP를 아예 걷어내고, Fedify를 붙이기로 마음먹었다.

[Jikji]: https://github.com/dahlia/jikji
[Movable Type]: https://movabletype.org/
[內容 協商]: https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Content_negotiation
[`Accept-Language`]: https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Accept-Language


새 스택: Astro + Netlify
------------------------

一旦 첫 選擇으로, Jikji와 PHP를 버리고 靜的 콘텐츠 中心의 웹 사이트를 만드는
데에 特化되어 있는 JavaScript 웹 프레임워크 [Astro]를 쓰기로 했다. 이미
[@fedify/astro] 聯動 패키지가 있다는 것도 Astro를 고른 큰 理由였다.

단, 旣存에 쓰던 CSS나 HTML 템플릿은 最大限 再活用했다. 現在 웹 디자인에
滿足하고 있기도 했고, 웹 디자인 改編까지 하면 範圍가 너무 커질 것 같았다.
퍼머링크도 完全히 그대로 保存했다. 全般的으로 訪問者가 뭐가 딱히 바뀌었는지
눈치 못 챌 程度로 表面을 維持하면서 技術 스택을 移轉하는 게 目標였다.

配布는 Cloudflare Workers와 Netlify 中에서 苦悶하다가, Fedify를 아직
Netlify에 올려 본 적이 없는 것 같아서 Fedify의 Netlify 支援을 이참에 追加하는
契機로 삼기로 했다. 여태까지 靜的 사이트 호스팅을 爲해 Netlify를 여러 次例
써 왔지만, 에지 函數를 함께 쓰는 건 처음이었다. 基本的으로는 靜的인 애셋들로
이뤄져 있지만 一部 機能만 動的으로 動作한다는 槪念이, 마치 九十年代 末 웹
사이트를 만들 때 CGI 스크립트만 */cgi-bin/* 디렉터리 안에 두던 方式을
떠오르게 했다.

旣存에는 블로그 글을 Markdown 파일로 貯藏하고 Git에 체크인한 뒤, 푸시하면
GitHub Actions로 靜的 사이트를 빌드하고 나서 SFTP를 利用해 配布하는
흐름이었는데, 이제는 GitHub Actions를 빌드 파이프라인에서 뺄 수 있었다.
Netlify가 알아서 빌드를 해주기 때문이다. 結果的으로 더 單純해졌다.

Astro는 大體로 滿足스러웠고, 移轉은 比較的 수월했다. 五年 前에 만든 뒤 거의
업데이트를 안 했던 Jikji보다 나은 건 勿論이었다. Jikji는 더 以上 管理할
理由가 없어졌기 때문에 貯藏所를 아카이브 處理했다.

[Astro]: https://astro.build/
[@fedify/astro]: https://fedify.dev/manual/integration#astro


Astro에 Fedify 붙이기
---------------------

### @fedify/astro 最新化

그런데 막상 Astro에 Fedify를 붙이려니, @fedify/astro가 最新 버전인 Astro
7을 支援하지 않았다. 內部에서 使用하는 Astro API는 크게 달라지지 않았지만,
패키지에 明示된 互換 範圍와 테스트는 Astro 5까지만 다루고 있었다. 結局
블로그에 Fedify를 붙이기 前에 먼저 @fedify/astro부터 고쳐야 했다.

單純히 패키지의 버전 範圍만 넓히지는 않았다. 旣存 테스트는 假짜 Astro
컨텍스트를 만들어 미들웨어를 直接 呼出했기 때문에, Vite의 SSR 設定이나
어댑터 사이의 互換性, 빌드된 서버의 要請 라우팅 같은 問題는 잡아낼 수
없었다. 그래서 Fedify 패키지를 實際로 패킹해 작은 Astro 애플리케이션에
設置하고, 서버를 빌드하고 實行한 다음 HTTP 要請까지 보내는 互換性 테스트를
새로 만들었다.

이 테스트는 Astro 5, 6, 7에서 HTML 要請은 Astro 페이지로 넘어가는지,
ActivityPub과 WebFinger 要請은 Fedify가 處理하는지, 그밖의 經路에서는
Astro의 `404 Not Found` 應答이 維持되는지 等을 確認한다. Astro 7은 Node.js뿐
아니라 Deno와 Bun으로도 빌드해 보도록 했다.

[이 作業][2]은 이미 업스트림에 머지되었고, Fedify 2.4.0에 包含될 豫定이다.

[2]: https://github.com/fedify-dev/fedify/pull/936

### 靜的 페이지와 動的 엔드포인트

Astro 프로젝트 全體는 서버 아웃풋으로 빌드하되, 旣存 블로그 페이지는
以前처럼 프리렌더링하도록 했다. 反面 WebFinger와 액터, 인박스, 아웃박스,
팔로워 컬렉션, ActivityPub 客體 經路는 要請을 받을 때 Fedify가 動的으로
處理한다. @fedify/astro가 提供하는 미들웨어는 要請의 URL과 `Accept` 헤더를
살펴보고 Fedify가 處理할 要請만 가로챈다. 같은 URL이라도 HTML을 要請하면
旣存 Astro 페이지를 보여주고, ActivityPub 表現을 要請하면 Fedify가 만든
客體를 돌려줄 수도 있다.

結果的으로 訪問者가 보는 블로그는 如前히 靜的 사이트에 가깝다. 새로 생긴
動的 部分은 大部分 페디버스의 다른 서버가 接近하는 곳에만 있다. 앞에서
CGI를 떠올렸던 것도 이런 構成 때문이었다.

### `Person`과 `Article`

ActivityPub을 붙일 때에는 이 블로그에서 무엇이 액터이고 무엇이 客體인지도
定해야 했다. 블로그의 액터에는 [`Person`] 타입을 골랐다. 實際 發行 作業은
프로그램이 自動으로 하지만, 액터가 나타내는 것은 블로그 소프트웨어나
서비스가 아니라 이 글들을 쓰는 나 自身이기 때문이다. 그래서 핸들은
`@hongminhee@writings.hongminhee.org`이고, 액터의 웹 URL은 이 블로그를
가리킨다.

各 블로그 글에는 [`Article`] 타입을 골랐다. 題目과 本文이 있고, 獨立的인
퍼머링크를 가진 長文 文書이므로 `Note`보다 意味가 잘 맞는다고 생각했다.
多幸히 Mastodon 等 最近의 主要 ActivityPub 具顯들도 `Article`을 大部分
支援한다. 사람이 읽는 旣存 퍼머링크는 그대로 두고, ActivityPub 客體에는
`/ap/articles/{year}/{month}/{slug}` 形態의 別途 URI를 붙였다. `Article`의
`url`은 다시 旣存 퍼머링크를 가리킨다. ActivityPub 客體의 URI와 사람이 읽을
웹 페이지의 퍼머링크를 區分한 것이다.

多國語 表現은 조금 더 苦悶할 部分이 있었다. 言語別 페이지를 서로 다른
`Article` 客體로 表現하면 같은 글에 對한 反應과 共有가 여러 客體로 흩어진다.
그래서 같은 퍼머링크에 屬한 國漢文混用 朝鮮語(`ko-Kore`), 한글 專用
韓國語(`ko-Hang-KR`), 英語(`en`), 日本語(`ja`) 버전을 하나의 `Article`로
묶었다. 題目과 要約, 本文에는 各各 言語 태그가 붙은 값을 모두 넣었다.
JSON-LD로 直列化하면 各各 `nameMap`, `summaryMap`, `contentMap`으로
表現된다. 言語別 값을 處理하지 않는 具顯을 爲해 `name`, `summary`,
`content`에는 基本 言語의 값도 함께 넣었다. 英文版이 있으면 英語를, 없으면
國漢文混用 朝鮮語를 基本값으로 삼았다. 言語別 HTML 페이지는 `Article`의
`url`에도 `hreflang` 屬性이 붙은 `Link` 客體로 덧붙였다.

이렇게 하면 受信 서버가 多國語 값을 理解할 境遇 利用者의 言語에 맞는 題目과
本文을 고를 수 있고, 그렇지 않더라도 基本값은 表示할 수 있다. 事實, 내가
아는 거의 모든 ActivityPub 具顯은 아직 이런 多國語 自然語 값을 제대로
表示하지 못한다. [Mastodon 이슈 트래커에 이를 爲한 이슈가 올라와
있고][mastodon/mastodon#11013] [Hackers' Pub 이슈 트래커에도 비슷한 提案이
올라와 있지만][hackers-pub/hackerspub#330], 언제 具顯될지는 期約이 없다.
아마 UI 디자인 側面에서도 苦悶이 必要할 것이다.

[`Person`]: https://www.w3.org/TR/activitystreams-vocabulary/#dfn-person
[`Article`]: https://www.w3.org/TR/activitystreams-vocabulary/#dfn-article
[mastodon/mastodon#11013]: https://github.com/mastodon/mastodon/issues/11013
[hackers-pub/hackerspub#330]: https://github.com/hackers-pub/hackerspub/issues/330


Fedify를 Netlify에서 돌리기
---------------------------

靜的 파일만 配布할 때와 달리 ActivityPub 서버에는 配布가 끝난 뒤에도 남아
있어야 하는 狀態가 있다. 于先 액터의 署名 키가 配布할 때마다 바뀌어서는 안
된다. 팔로워 目錄도 다음 配布에서 사라지면 안 된다. 이 두 가지는 [Netlify
Database]에 貯藏했다.

인박스에서 받은 액티비티와 遠隔 서버에 보낼 액티비티는 [Async Workloads]로
만든 메시지 큐에서 處理한다. 액티비티 傳送은 相對 서버의 狀態에 따라
느려지거나 失敗할 수 있으므로, HTTP 要請을 받은 函數 안에서 모두 끝내려고
해서는 안 된다. 큐에 넣어 두면 要請과 傳達을 分離할 수 있고, 失敗한 作業도
나중에 再試圖할 수 있다. 多幸히 [Fedify는 이러한 作業을 抽象化해
두었고][3], 백엔드 어댑터도 擴張할 수 있다. 다만 아직 Netlify의 Async
Workloads를 爲한 어댑터가 없었기 때문에, Fedify가 Async Workloads를 메시지
큐로 使用하면서 Netlify Database에 傳達 順序 狀態를 保存할 수 있도록
[@fedify/netlify 패키지도 만들었다.][4]

새 글을 聯合宇宙(fediverse)에 알리는 일은 조금 다른 問題였다. 靜的 사이트의
빌드가 끝났다고 해서 實行 中인 ActivityPub 서버가 어떤 글이 달라졌는지
저절로 알 수는 없다. 그래서 프로덕션 配布가 成功하면 以前 配布와 새 配布의
글 目錄을 比較한다. 새로 생긴 글에는 `Create(Article)`, 內容이나 修正 時刻이
달라진 글에는 `Update(Article)`, 사라진 글에는 `Delete(Article)` 액티비티를
만들어 팔로워에게 보낸다. 再試圖하더라도 같은 變更에 같은 액티비티 ID를
쓰고, 더 오래된 配布가 나중에 同期化되어 最新 狀態를 되돌리지 못하도록 配布
順序도 確認한다.

Netlify에는 配布 미리보기(deploy preview)와 브랜치 配布(branch deploy)
機能이 있는데, 그 境遇에는 聯合 機能을 아예 끄도록 했다. 미리보기마다 같은
블로그를 自處하는 액터가 생기거나, 試驗 配布가 實際 팔로워에게 액티비티를
보내면 困難하기 때문이다. 로컬에서는 메모리 貯藏所와 큐를 써서 開發할 수
있고, 프로덕션에서만 永續的인 데이터베이스와 큐를 使用한다.

아무튼 德分에 Fedify는 이제 Deno Deploy 및 Cloudflare Workers와 함께
Netlify Functions도 支援하게 되었다. 勿論, Node.js, Deno, Bun에서도
돌아가는 것은 基本이다.

[Netlify Database]: https://docs.netlify.com/build/data-and-storage/netlify-database/
[Async Workloads]: https://docs.netlify.com/build/async-workloads/get-started/
[3]: https://fedify.dev/manual/mq
[4]: https://github.com/fedify-dev/fedify/pull/934


마치며
------

이 作業으로 블로그에 타임라인이나 答글 作成 畫面 같은 소셜 機能이 생긴
것은 아니다. 글을 쓰고 읽는 方式도, 旣存 퍼머링크와 디자인도 거의 그대로다.
다만 이제 이 블로그와 글에는 聯合宇宙에서 通用되는 이름과 住所가 생겼다.
사람들은 `@hongminhee@writings.hongminhee.org`를 팔로해 새 글을 받아 볼 수
있고, 各 글의 ActivityPub 客體 URI를 檢索해 原文을 찾을 수 있다.

Fedify를 維持補修하면서 다른 開發者에게 ActivityPub을 具顯하는 方法을
提供해 왔고, [Hollo]나 [Hackers' Pub] 等을 만들면서 [개밥 먹기]도 꽤나
했지만, 이미 運營 中인 웹 사이트, 그것도 靜的 페이지로 되어 있던 블로그에
Fedify를 붙이는 건 처음이었다. 德分에 Astro 統合의 互換性 테스트와 Netlify
支援을 追加했고, 文書나 單位 테스트만 봐서는 알기 어려운 配布와 運營上의
問題도 겪었다. Fedify가 소셜 네트워크를 새로 만드는 데에만 쓰이는 것이
아니라, 이미 存在하는 웹사이트가 自己 모습을 維持한 채 聯合宇宙에 合流하는
데에도 쓰일 수 있다는 것을 確認할 수 있었다.

[Hollo]: https://docs.hollo.social/ko/
[Hackers' Pub]: https://hackers.pub/
[개밥 먹기]: https://ko.wikipedia.org/wiki/%EA%B0%9C%EB%B0%A5_%EB%A8%B9%EA%B8%B0
