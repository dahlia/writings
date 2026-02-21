---
published: 2024-12-24T00:00:00+09:00
reads:
  出展: 출전(出展)
---

聯合宇宙와 함께 한 一年
=======================

2024年은 정말로 聯合宇宙에 푹 빠져서 지낸 한 해였다.
聯合宇宙와 ActivityPub과 關聯된 크고 작은 여러 프로젝트를 進行했으며,
그 중 몇은 꽤 많은 사람들에게 좋은 反應도 받았다.
좋은 記憶을 남겨두자는 意味에서 글로 써 본다.


聯合宇宙란?
-----------

먼저 聯合宇宙(fediverse)가 무엇인지 짧게 說明하자면,
서로 다른 種類의 소셜 미디어들이 疏通할 수 있는 네트워크를 뜻한다.
卽, 서로 아예 다른 소셜 미디어 上의 두 計定이 서로 팔로도 하고 댓글도 달고
좋아요도 찍을 수 있다는 뜻이다. 技術的으로는,
서로 다른 소셜 미디어 사이의 相互運用性(interoparability)을 具顯하기 爲해 W3C의
技術 標準인 [ActivityPub] 프로토콜이 使用된다.

現在 聯合宇宙에 同參하고 있는 代表的인 소셜 미디어들로는 [Mastodon], [Pixelfed],
[Akkoma], [Misskey], [WordPress] 等이 있으며, 그 밖에도 一一이 列擧하기 힘들
만큼 많은 프로젝트가 있다. 그들 大部分은 오픈 소스 프로젝트이기도 하다.
또한 오픈 소스는 아니지만 Meta의 [Threads]가 올 여름부터 조금씩 ActivityPub을
具顯하여 이미 어느 程度 聯合宇宙에 들어와 있다고 볼 수 있다.

서로 다른 소셜 미디어들이 疏通하는 方式이니 만큼, 聯合宇宙 內의 計定 住所는
使用者名 뿐만 아니라 서버 이름도 包含하게 된다. 흔히 <q>聯合宇宙 핸들</q>이라
부르는 이 住所 形式은 @username@host와 같이 마치 이메일 住所와 닮아 있다.
이를 通해 서로 다른 서버 및 플랫폼에 屬한 計定이 서로 팔로하고 疏通할 수 있다.
勿論 나 自身도 聯合宇宙 計定이 있으며, [@hongminhee@hollo.social]을 팔로하면 된다.

[ActivityPub]: https://activitypub.rocks/
[Mastodon]: https://joinmastodon.org/ko
[Pixelfed]: https://pixelfed.org/
[Akkoma]: https://akkoma.social/
[Misskey]: https://misskey-hub.net/ko/
[WordPress]: https://ko.wordpress.org/
[Threads]: https://www.threads.net/
[@hongminhee@hollo.social]: https://hollo.social/@hongminhee


Fedify
------

[Fedify]는 올 해 나의 가장 큰 成就라고 할 수 있을 것이다.
Fedify는 TypeScript로 作成된 ActivityPub 서버 프레임워크인데,
ActivityPub 서버를 具顯할 때 쓸만한 適切한 抽象化 水準을 찾을 수 없어서
만들게 되었다. 맨 처음에는 바닥부터 ActivityPub 서버 앱을 만들어 보려고 몇
番인가 試圖하고, 또 어느 程度 動作하는 것도 만들어 보았지만,
그 結果 코드는 마음에 썩 차지 않았다. 그래서 제대로 抽象化를 하며 作成을
해 보니 結局 프레임워크 비슷한 걸 만들고 있다는 것을 깨닫고,
Fedify 같은 ActivityPub 서버 프레임워크의 必要性을 切感하게 되었다.

Fedify는 總 4回의 再作成이 있었는데, 맨 처음에는 TypeScript로 作成했다가,
그 뒤에는 Python, 그리고 C#, 그리고 다시 TypeScript로 돌아오게 되었다.
言語 選擇에는 여러 考慮事項이 있었다. 첫째로는 ActivityPub의 데이터 交換 形式인
[JSON-LD] 具顯이 있는 言語여야 했고, 또 JSON-LD를 쉽고 便하게 다루기 爲해 어느
程度는 動的이어야 했다. 둘째로는 動的 言語라도 靜的 타입을,
그러니까 所謂 [gradual typing]을 잘 支援해야 했다.
마지막으로는 利用者가 많고 生態系가 豊富해야 했다.
왜냐하면 Fedify가 널리 쓰이길 바랐기 때문이다.
모든 것을 考慮한 끝에 TypeScript를 쓰게 되었다.

모든 再作成 過程까지 包含한다면 昨年 12月 初부터 着手했고,
마지막 再作成부터 따진다면 [2月 末부터 만들기 始作][1]하여 3월 初에 첫
[0.1.0 버전]을 릴리스했다. 릴리스하기 前에 생각했던 코드네임은 Fedikit이었지만,
[릴리스하기에 앞서 檢索을 해 보니 이미 같은 이름의 프로젝트가 있다는 事實을 알게
되어 急하게 Fedify로 이름을 바꾸게 되었다.][2] Fedikit이라는 코드네임으로
作業했던 Python 버전은 [GitHub에 올려두기도 했다.][3]

Fedify는 現在 ActivityPub 서버를 만들 때 必要한 機能을 가장 幅넓게 提供하는
프레임워크라고 自負하고 있다. 聯合宇宙는 ActivityPub만 具顯하면 끝나는 게 아니라
JSON-LD, [Activity Vocabulary], WebFinger, [NodeInfo], [HTTP Signatures],
[Linked Data Signatures], [Object Integrity Proofs] 等等 많은 仕樣을 다뤄야 한다. Fedify는 그 모든 것들을 網羅한다. 甚至於 ActivityPub의 主要 具顯體라 할 수 있는
Mastodon이나 Misskey에서는 未具顯된 것들도 Fedify에서는 具顯된 게 많다.
ActivityPub 스펙만 훑고서 ActivityPub 서버 具顯이 簡單하다고 錯覺하고 아무런
ActivityPub 프레임워크 없이 着手했다가 結局 그 複雜性에 唐慌하는 境遇도 種種 본다.
앞으로 ActivityPub 서버를 하나쯤 만들어 볼 생각이 있는 분들께는 꼭 Fedify를 쓰길 勸한다.

그리고, Fedify를 만들면서 힘쓴 다른 하나는 바로 [文書化][Fedify]이다.
[參照 文書]는 勿論이고, Fedify의 모든 機能을 網羅하는 豊富한 매뉴얼이 存在해야
한다고 생각했다. 새 機能을 追加할 때도 매뉴얼 文書부터 作成하고 具顯을 나중에
할 程度였다. 德分에 文書의 量이 꽤나 많아져서, 이제는 英語 以外의 言語로 어떻게
飜譯해야 할 지가 苦悶이다.

끝으로, 내가 Fedify를 通해 스스로 滿足할 만한 成就를 냈다고 느끼게 된 가장 큰
事件은 [Ghost의 Fedify 資金 支援][4]이다. 이를 通해 人生 처음으로 專業 오픈
소스를 할 수 있게 되었기 때문이다.[^1] 무엇보다 Ghost는 Fedify의 가장 큰
使用者이기도 하다. Ghost의 ActivityPub 具顯은 한창이며, 프라이빗 베타 段階에 있다.
아마도 來年에는 公開가 될 것으로 보인다.

[^1]: 嚴密하게는 前에 다녔던 職場에서도 오픈 소스 製品을 專業으로 만들긴 했지만,
      내가 始作한 프로젝트가 아니었다.

[Fedify]: https://fedify.dev/
[JSON-LD]: https://json-ld.org/
[gradual typing]: https://en.wikipedia.org/wiki/Gradual_typing
[1]: https://github.com/dahlia/fedify/commit/9858cea9db609e7aa7a65b3bcec8dd0d8838b574
[0.1.0 버전]: https://github.com/dahlia/fedify/releases/tag/0.1.0
[2]: https://todon.eu/@hongminhee/111976051313889872
[3]: https://github.com/dahlia/fedikit
[Activity Vocabulary]: https://fedify.dev/manual/vocab
[NodeInfo]: https://fedify.dev/manual/nodeinfo
[HTTP Signatures]: https://fedify.dev/manual/send#http-signatures
[Linked Data Signatures]: https://fedify.dev/manual/send#linked-data-signatures
[Object Integrity Proofs]: https://fedify.dev/manual/send#object-integrity-proofs
[參照 文書]: https://jsr.io/@fedify/fedify/doc
[4]: https://writings.hongminhee.org/2024/07/ghost-funds-fedify/


Hollo
-----

[Hollo]는 一人用 ActivityPub 서버이다. 普通은 Mastodon이나 Misskey 서버 中에
마음에 드는 곳에 加入하는 式으로 聯合宇宙 計定을 만들게 되지만,
가끔 소프트웨어 엔지니어들 中에서는 直接 自身만의 도메인名에 直接 運營하는
서버를 連結하여 聯合宇宙 計定을 마련하기도 하는데, Mastodon이나 Misskey 같은
소프트웨어는 基本的으로 많은 사람들이 計定을 만들어서 함께 使用하는 것을 前提로
設計되어 있어 혼자서 쓰기에는 必要 없는 機能도 많고 무거운데다 設置도 번거롭다.
그런 사람들을 爲해 만든 게 바로 Hollo이다.
Hollo는 PostgreSQL만 있으면 動作하기 때문에 設置도 比較的 簡便한 便이고,
機能도 혼자 쓸 때 必要한 것들로만 갖추고 있어서 簡單한 것이 長點이다.

Hollo를 만들 게 된 經緯는 조금 複雜하다. 實은 Fedify를 만들게 된 契機가 바로
Hollo라고 할 수 있는데, Hollo 같은 나만의 ActivityPub 서버를 만들기 始作했다가
ActivityPub 서버 프레임워크의 必要性을 實感하게 되었기 때문이다.
다만, 그 때 처음으로 만드려고 했던 프로젝트의 코드는 Hollo에 再使用되지도 않았고
그 때의 프로젝트 이름도 Hollo가 아니었으므로, 嚴密히 말하면 Hollo가 Fedify를
만들 게 된 契機라고는 할 수 없다. 그러나 Fedify를 만들고 나면 이를 利用해
窮極的으로 만들고 싶었던 게 Hollo와 같은 것이었다는 것은 事實이다.

하지만 막상 Fedify를 만들고 나니 내가 만들고 싶은 것은 Fedify 自體가 되어버렸고,
원래의 動機는 多少 褪色한 뒤였다. 그래서 Hollo를 정말로 만들기 始作할 때
즈음에는 Fedify의 데모를 만드는 게 Hollo의 가장 큰 目的이 되어 있었다.
實際로 Hollo를 만들면서 Fedify에 必要한 機能을 더 追加하거나 버그를 찾아서
고치기도 했다. 다만, 어디까지나 Fedify 프로젝트의 一環이었기 때문에 Hollo 自體의
코드 品質은 Fedify에 比하면 많이 떨어진다. 이 問題는 Hollo를 Fedify 프로젝트의
一環으로 보지 않게 된 時點부터 고쳐 나가기 始作했지만, 如前히 코드 品質에 있어선
改善할 部分이 아직 많다.

Hollo는 豫想外로 日本에서 使用者層이 생겨서, 公式 文書를 日本語로 飜譯하거나,
日本에서 開催한 [오픈 소스 컨퍼런스 2024 Tokyo/Fall]이라는 行事에 나가 부스를
차리기도 했다. 이 때, 現地의 Hollo 使用者이신 [Esurio] 님께서 부스를 함께
지켜주셔서 무척 큰 도움을 받았다.

最近에는 [개밥 먹기]를 爲해 내가 가지고 있던 Mastodon 計定을 버리고 Hollo로
移住했다.

[Hollo]: https://docs.hollo.social/ko/
[오픈 소스 컨퍼런스 2024 Tokyo/Fall]: https://event.ospn.jp/osc2024-fall/
[Esurio]: https://c.koliosky.com/@esurio1673
[개밥 먹기]: https://ko.wikipedia.org/wiki/%EA%B0%9C%EB%B0%A5_%EB%A8%B9%EA%B8%B0


韓國 聯合宇宙 開發者 모임
-------------------------

어느날 문득 韓國에는 聯合宇宙 소프트웨어를 만드는 開發者들의 交流가 없다는
생각이 들었다. 그래서 [Neovim用 Mastodon 클라이언트][5]를 만들기도 하셨던
[李在烈] 님을 꼬셔서 함께 [韓國 聯合宇宙 開發者 모임][](FediDev KR)을 發足하였다.
먼저 [Discord 서버][6]를 마련하여 꽤 많은 開發者분들이 모였다.

그리고 定期的인 스프린트 모임을 企劃하여, 그 [첫 모임][7]을 8月 31日에
[returnzero] 事務室에서 開催하였는데, 意外로 많은 사람들이 參加해 주셨다.
이 때 만난 분들과는 如前히 聯合宇宙에서 交流하며 지내고 있다.

最近에는 年末이라 그런지 오프라인 交流가 뜸했는데,
來年이 되면 또 다시 活潑한 活動을 再開할 豫定이다.

[5]: https://github.com/kode-team/mastodon.nvim
[李在烈]: https://kodingwarrior.github.io/
[韓國 聯合宇宙 開發者 모임]: https://fedidev.kr/
[6]: https://discord.gg/B2ABMBpHNA
[7]: https://sprints.fedidev.kr/posts/2024-08-31-sprint/
[returnzero]: https://www.rtzr.ai/


첫 同人誌 販賣
--------------

올 가을부터 日本語圈 聯合宇宙에서 活動을 本格的으로 하기 始作했는데,
그러면서 日本의 Hollo 使用者들과 交流하게 되었다. 그 中에서 [Esurio] 님이
日本에서 開催하는 오픈 소스 컨퍼런스에 부스를 내 보는 게 어떻냐는 提議를 주셔서,
苦悶 끝에 出展하게 되었다. 日本 行事에 出展하는 것은 勿論이고 부스를 차리는 것
自體가 처음이어서 Esurio 님께 여러모로 도움을 받아야 했다.
이 자리를 빌려 感謝하다는 말을 꼭 드리고 싶다.

아무튼, 부스를 내기로 했으니 뭐라도 展示品이 必要했는데,
그 一環으로 Fedify의 튜토리얼인
<cite>[나만의 聯合宇宙 마이크로블로그 만들기]</cite>([Creating your own federated microblog])의
日本語板인 <cite lang="ja">[自分だけのフェディバースのマイクロブログを作ろう！]</cite>을
종이 冊으로 印刷하여 팔기로 했다. 多幸스럽게도 만들어 가져 간 冊은 大部分 팔려서
돌아올 때는 꽤 가볍게 올 수 있었다. 이 때 冊을 사 가신 분들 中 한 분인
[모나코 廣告][](<span lang="ja">モナコ広告</span>) 님께서 튜토리얼을 따라해 본
過程을 <span lang="ja">[FediLUG] 勉強会</span>라는 모임에서
<cite>[Fedify로 ActivityPub 서버를 만들어 봤다]</cite>(<span
lang="ja">FedifyでActivityPubサーバを作ってみた</span>)라는
題目으로 發表하시기도 했다.

꼭 冊을 사 가지 않으신 분들과도,
不足한 日本語로나마 더듬더듬 交流할 수 있어서 좋았다.

[나만의 聯合宇宙 마이크로블로그 만들기]: https://hackmd.io/xhAAyZgMRTuHFtkxEIv0NA
[Creating your own federated microblog]: https://fedify.dev/tutorial/microblog
[自分だけのフェディバースのマイクロブログを作ろう！]: https://github.com/dahlia/fedify-microblog-tutorial-ja
[모나코 廣告]: https://monaco.every-little.com/
[FediLUG]: https://fedilug.y-zu.org/
[Fedify로 ActivityPub 서버를 만들어 봤다]: https://www.docswell.com/s/monaco_koukoku/5DN28R-fedilug05-20241123


專業 聯合宇宙 開發
------------------

어쩌다 보니 年初에는 全혀 豫想하지 못했던 方向으로 흘러,
一種의 <q>專業 聯合宇宙 開發者</q>가 된 狀況인데,
來年에는 聯合宇宙 自體의 底邊을 넓히는 데에 애를 써 볼 豫定이다.
그 一環으로, 소프트웨어 엔지니어들을 爲한 ActivityPub 基盤 소셜 플랫폼을 만들어
보고 있는데, 早晩間 公開할 수 있도록 하겠다.
