---
published: 2025-09-12T20:10:00+09:00
reads:
  繪文字: 에모지
  檢查: 검사
---

오픈 소스 開發 近況
===================

어쩌다 보니 最近 꽤 많은 오픈 소스 프로젝트를 만들게 되어서,
近況 報告 兼 進行中인 오픈 소스 프로젝트들을 글로 整理해 본다.
各 프로젝트들은 어떤 式으로든 서로 關係가 있다.


[Hollo]
-------

事實 最近 내가 만들게 된 오픈 소스 프로젝트들의 始發點이 되는 게 바로 이
프로젝트이다. Elon Musk가 Twitter를 사들이고 이름을 X로 바꾸고 나서부터
元來부터 쓰던 Mastodon을 더욱 熱心히 쓰게 되었는데, 國漢文混用體로 글을 쓰다
보니 사람들이 읽기 不便하지 않을까 눈치를 보게 되었다. 그래서 [Seonbi]를
利用하여 國漢文混用體를 한글專用體로 바꿔주는 機能을 Mastodon에 넣을까도
생각했으나… 나 말고는 아무도 쓸 것 같지 않은 이 機能을 Mastodon 업스트림에
넣는 것은 애初에 無理. 그러면 다운스트림 패치를 維持하며 Mastodon 서버도
스스로 運營해야만 한다는 소리인데, Mastodon이 워낙 무겁기로 有名해서
그러고 싶지가 않았다. 그래서 自家用 輕量 ActivityPub 具顯을 만들고자 한 게
바로 [Hollo]이다. 혼자 쓰는 ActivityPub 서버 소프트웨어라서 "홀로"라고 이름
지었다.

[개밥 먹기][](dogfooding)에 成功하여 現在는 내 聯合宇宙(fediverse) 어카운트를
Hollo로 옮겼다. 聯合宇宙 핸들은 [@hongminhee@hollo.social]. 國漢文混用體로
마음껏 글을 쓰고 있으며, 漢字 위에 한글 讀音이 [`<ruby>`] 태그로 달린다.

實은 개밥 먹기를 達成한 以後로는 내게 切實한 機能은 모두 具顯되어서 버그 修正
等 維持補修 爲主로만 하고 있다.

[Hollo]: https://docs.hollo.social/
[Seonbi]: https://github.com/dahlia/seonbi
[개밥 먹기]: https://ko.wikipedia.org/wiki/%EA%B0%9C%EB%B0%A5_%EB%A8%B9%EA%B8%B0
[@hongminhee@hollo.social]: https://hollo.social/@hongminhee
[`<ruby>`]: https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/ruby


[Fedify]
--------

앞서 이야기한 Hollo를 처음 具顯할 때는 ActivityPub 具顯을 바닥부터 하려고
試圖했었다. 그런데 만들다 보니 ActivityPub 具顯 코드가 생각보다 두껍고 할 게
많다는 생각이 들었다. 그래서 Hollo를 만들던 것을 中斷하고 ActivityPub 서버
프레임워크를 만들게 된 게 [Fedify]이다. 만들고 나서 半年이 채 안됐을 때
[Ghost로부터 資金 支援]을 받게 되었고, 그 뒤로 한 동안 專業으로 Fedify
프로젝트를 하게 되기도 했다. 現在는 情報通信産業振興院(NIPA) 傘下
[오픈 소스 소프트웨어 統合 支援 센터][]에서 主催하는
[오픈 소스 컨트리뷰션 아카데미][](OSSCA)의 參與型 프로젝트로 選定되어
훌륭한 멘티 분들과 함께 프로젝트를 進行하고 있다.

Fedify 以前에도 ActivityPub 서버 프레임워크가 없었던 것은 아니다.
하지만 어떤 것도 내가 必要로 하는 抽象化 水準을 提供하지 않았다.
어떤 것들은 WebFinger나 署名 알고리즘 程度만 提供하는 작은 라이브러리에 가깝고,
또 어떤 것들은 거의 Mastodon과도 比較할 수 있는, 프레임워크라기 보다는 完成된
소셜 미디어 플랫폼 구현에 가까웠다. 譬喩하자면 HTTP 라이브러리나 WordPress 같은
CMS는 있어도, Rails나 Django에 가까운 프레임워크를 없었던 것이다.

Fedify를 만들 때 念頭에 둔 目標는 以下와 같다.

 1. 可及的 많은 開發者들이 쓸 수 있게 한다.
 2. 데이터베이스나 스토리지에 無關(agnostic)해야 한다. 애플리케이션 開發者가
    쓰고 싶은 데이터베이스를 쓸 수 있어야 한다.
 3. ActivityPub 프로토콜을 活用하는 方式에 制約이 없어야 한다.
    이를테면 마이크로블로그 같은 完成된 애플리케이션의 形態를 前提하지 않는다.
 4. ActivityPub을 具顯한다면 갖추어야 하는 모든 것들--認證, 署名, 發信函(outbox)
    및 受信函(inbox) 待機列 等--一切를 提供한다.
 5. ActivityPub을 잘 모르는 사람도 쓸 수 있을 만큼 豐富한 文書化를 提供한다.
 6. 타입 安全해야 한다.

그리고 이 글을 쓰는 現在, 以上의 目標는 거진 이룬 것 같다. 結果的으로 Hollo는
Fedify 基盤으로 만들어지게 되었고, 그 外에도 (아래서 다룰) Hackers’ Pub,
Ghost 等이 Fedify를 써서 ActivityPub을 具顯하게 되었다. 또한, 아직 完成되지는
않았지만 [Kosmo], [Cosmoslide] 等의 프로젝트가 Fedify를 利用해 ActivityPub을
具顯하고 있다.

[Fedify]: https://fedify.dev/
[Ghost로부터 資金 支援]: /2024/07/ghost-funds-fedify/
[오픈 소스 소프트웨어 統合 支援 센터]: https://www.oss.kr/
[오픈 소스 컨트리뷰션 아카데미]: https://www.oss.kr/contribution_academy
[Kosmo]: https://github.com/byulmaru/kosmo
[Cosmoslide]: https://github.com/cosmoslide/cosmoslide
*[NIPA]: National IT Industry Promotion Agency
*[OSSCA]: Open Source Software Contribution Academy


[LogTape]
---------

Fedify에 로그 體系를 追加하려고 JavaScript로 만들어진 로그 라이브러리를
찾아보았으나 내가 願하는 條件의 라이브러리가 없어서 새롭게 만들게 된
것이 [LogTape]이다.

내가 願하는 條件이라는 것도 크게 대단치도 않은 것이었다. 그저 Python 표준
라이브러리의 [`logging`] 모듈에 該當하는 것을 찾은 것인데, 돌이켜 생각해 보니
`logging` 모듈이 꽤 잘 만든 物件이었던 것 같기도 하다. 내가 바라는 條件은
다음과 같았다.

 1. 라이브러리에서 로그를 남기되, 애플리케이션에서 라이브러리의 로그 出力을
    制御할 수 있어야 한다. 애플리케이션에서 出力 設定을 따로 하지 않는 限,
    라이브러리의 로그는 어디에도 出力되어서는 안 된다.
 2. 로거가 階層的으로 管理되어야 한다. 上位 로거에 設置된 出力處(sink)는
    下位 로거에도 適用되어야 한다.
 3. 出力處는 具顯하기 쉬운 인터페이스여야 한다.
 4. 타입 安全해야 한다.
 5. Node.js, Deno, Bun, 에지 函數(edge functions), 웹 브라우저 等 多樣한
    JavaScript 런타임에서 두루 動作해야 한다.

大體로 애플리케이션이 아니라 라이브러리에서 로그를 남기기 爲해 必要한
條件들이었다. 於此彼 Fedify에 쓸려고 만든 것이기 때문에, 만들어 놓고 放置하고
있었는데 昨年 가을 지나서부터 어쩌다 입所聞이 나서 사람들이 많이 쓰게 되었다.

[LogTape]: https://logtape.org/
[`logging`]: https://docs.python.org/3/library/logging.html


[Hackers’ Pub]
--------------

소프트웨어 開發과 關聯된 글들을 올릴 블로그를 만들고 싶어서 [velog]를 조금
쓰게 되었는데, ActivityPub을 支援하지 않는 게 아쉬워서 velog 이슈트래커에
[이슈]를 남기게 되었다. 多幸스럽게도 [肯定的으로 檢討하겠다는 答辯]을 받긴
했지만, 製作陣 분들이 바쁘셔서 그 以後로 消息이 없었다. 結局 내가 스스로
ActivityPub을 支援하는 소프트웨어 開發者들을 爲한 소셜 미디어 및 블로그
플랫폼을 만들어보자고 생각한 게 [Hackers’ Pub]이다.

昨年 겨울에 첫 開場을 하고서 얼마 되지 않아 [李在烈] 님께서 加入하셨는데,
招待制임에도 不拘하고 李在烈 님께서 이곳저곳에서 엄청나게 熱情的으로
Hackers’ Pub 弘報를 해 주신 德分에 相當히 많은 분들께서 加入하여 活動하시게
되었다. 短期的 目標는 韓國에서 널리 쓰이게 되는 것이고, 나아가 中長期的 目標는
東아시아 全般과 英語圈을 아우르는 것이다. 하지만 아직은 大部分의 콘텐츠가
韓國語로 되어 있으며, 少數의 日本人 분들이 間歇的으로 日本語 콘텐츠를 올려
주시는 程度이다.

Fedify를 通해 ActivityPub을 具顯했으므로 當然히 Hollo, Mastodon, Misskey 等과
疏通이 可能하며, X처럼 短文(`Note`)을 쓸 수도 있고 긴 揭示글(`Article`)을 쓸
수도 있다. 繪文字 反應이나 引用처럼 Mastodon에는 없는 機能도 提供하고 있다.

그리고 Hackers’ Pub의 또 하나의 자랑거리는 安全하고 平等한 共同體를 이루기 爲한
[行動 綱領]이다. 特히 내가 가장 좋아하는 句節은 다음과 같다.

> 差別과 嫌惡에 對抗하는 發言과, 差別과 嫌惡 自體를 同一線上에 두지 않습니다.

技術的 側面에서는, 元來는 [Deno]와 [Fresh]를 利用해서 만들었었으나,
現在는 웹 프런트엔드 開發에 造詣가 깊으신 [申義河] 님의 도움을 받아 [GraphQL]과
[SolidStart] 基盤으로 移住하고 있다.[^1]

소스 코드는 [AGPL 3.0]으로 [GitHub]에 公開되어 있다. 實際로 꽤 많은 Hackers’ Pub
會員들께서 不便한 點을 스스로 고치는 풀 리퀘스트를 보내주고 계신다.

參考로 내 Hackers’ Pub 어카운트는 [@hongminhee@hackers.pub]이다.

[^1]: 여러 理由로 Deno를 쓴 걸 後悔하고 있긴 하지만,
      어쩔 수 없이 Deno는 移住 後에도 繼續 쓰고 있다.

[Hackers’ Pub]: https://hackers.pub/
[velog]: https://velog.io/
[이슈]: https://github.com/velog-io/velog/issues/48
[肯定的으로 檢討하겠다는 答辯]: https://github.com/velog-io/velog/issues/48
[李在烈]: https://kodingwarrior.github.io/
[行動 綱領]: https://hackers.pub/coc
[Deno]: https://deno.com/
[Fresh]: https://fresh.deno.dev/
[申義河]: https://xiniha.dev/
[GraphQL]: https://graphql.org/
[SolidStart]: https://start.solidjs.com/
[AGPL 3.0]: https://www.gnu.org/licenses/agpl-3.0.en.html
[GitHub]: https://github.com/hackers-pub/hackerspub
[@hongminhee@hackers.pub]: https://hackers.pub/@hongminhee
*[AGPL]: GNU Affero General Public License


[Upyo]
------

Hackers’ Pub을 만들면서 이메일을 發送할 일이 생겼는데, 이메일 提供 業體를
쉽게 交替할 수 있는 이메일 發送 라이브러리를 찾다가 마음에 드는 게 없어서
만들게 된 게 [Upyo]이다. 이름에서 알 수 있는 것처럼, 韓國語 單語 "郵票"에서
이름을 따 왔다.

元來는 .NET 쪽의 [FluentEmail] 같은 걸 JavaScript 生態系에서 찾고 있었는데,
意外로 마땅한 게 없어서 놀랐다. 이메일 提供 業體를 交替하거나 多重化하는 일이
생각보다 잘 없는 걸까?

LLM 基盤의 코딩 에이전트[^2]를 本格的으로 써 본 첫 프로젝트이기도 했다.
그럼에도 아직 LLM의 力量에 期待가 그렇게 높지 않은 탓에,
設計와 初盤 코딩은 스스로 했고, 나중에 트랜스포트(transport)의 種類를
늘릴 때 LLM의 도움을 많이 받았다. 만드는 데에 이틀 걸렸던 것 같다.
코딩 에이전트의 놀라운 生產性이 印象 깊었다.

내가 만든 다른 라이브러리들과 마찬가지로 Node.js, Deno, Bun, 에지 函數,
웹 브라우저 等 多樣한 JavaScript 런타임을 지원하는 것도 特徵이다.

[^2]: [Claude Code]를 썼다.

[Upyo]: https://upyo.org/
[FluentEmail]: https://github.com/lukencode/FluentEmail
[Claude Code]: https://docs.anthropic.com/ko/docs/claude-code/overview
*[LLM]: large language model


[Optique]
---------

Fedify는 프레임워크이기도 하지만 `fedify` 命令이라는 CLI 道具도 提供하는데,
旣存에는 Deno 專用 CLI 프레임워크인 [Cliffy]를 그럭저럭 잘 쓰고 있었으나,
Deno 以外에 Node.js, Bun 等을 支援해야 하게 되면서[^3] Cliffy의 代案을 찾게
되었다. 그런데 이番에도 비슷한 패턴으로… 마음에 드는 걸 찾지 못했다.

事實 내 마음속에는 이미 理想에 가까운 CLI 파서 라이브러리가 存在하긴 했다.
다만 그게 [optparse-applicative]라는 Haskell 라이브러리였기 때문에 Fedify에서는
쓸 수 없었을 뿐이다. 이 optparse-applicative라는 라이브러리의 아이디어는
單純하다. CLI 파서도 파서이니 파서 컴비네이터(parser combinators)로
만들자는 것이다.

아무튼, 願하는 CLI 파서 라이브러리를 찾지 못했으니 스스로 만들 수밖에.
그래서 만든 게 [Optique]이다.

처음에는 optparse-applicative와 거의 비슷하게 포팅하려고 했지만,
아무래도 Haskell과 JavaScript는 DSL을 構成해내는 表現力에 큰 差異가 있었다.
그래서 苦悶하던 끝에 TypeScript 開發者들에게 이미 親熟한 [Zod]와 같은
有效性 檢查 라이브러리의 API를 本뜨기로 했다.

Upyo 프로젝트와는 달리 LLM 코딩 에이전트는 아주 限定的으로 文書化나 테스트 코드
作成 等에 使用했고, 그 때문인지 만드는 데에는 一週日 넘게 걸렸던 것 같다.

만들고 나니 JavaScript 生態系 안에서는 꽤나 유니크한 CLI 파서 라이브러리가
만들어졌다고 自評할 수 있었다. 勿論, 많은 CLI 애플리케이션이 그렇게 複雜한
옵션을 받지는 않지만, 어느 程度 規模가 있는 CLI 애플리케이션을 만든다면
Optique를 써도 後悔하지 않을 것이라고 自負한다.

아, 그리고 앞서 紹介한 다른 라이브러리들과 마찬가지로, Node.js, Deno, Bun,
甚至於 에지 函數나 웹 브라우저에서도 動作한다. 그럴 必要가 있나 싶지만,
그저 自己滿足이랄까. 다만, 德分에 테스트 짜기는 아주 쉬운 라이브러리가 되었다.

[^3]: Fedify 프레임워크 自體는 이미 Node.js, Deno, Bun, Cloudflare Workers 等을
      支援하고 있긴 했지만, CLI 道具인 `fedify` 命令만은 Deno 專用으로 만들어져
      있었다.

[Optique]: https://optique.dev/
[Cliffy]: https://cliffy.io/
[optparse-applicative]: https://github.com/pcapriotti/optparse-applicative
[Zod]: https://zod.dev/
*[CLI]: command-line interface


야크 셰이빙
-----------

생각해 보니 내 오픈 소스 開發의 原動力은 야크 셰이빙(yak shaving)에서 오는 게
아닐까 싶다. Anthony Fu의 <cite>[야크 셰이빙에 關하여]</cite>(<cite lang="en">About Yak Shaving</cite>)라는 글을
읽은 적이 있는데, 모티베이션을 얻는 方式이 나와 아주 비슷하다는 印象을 받았다.
뭔가가 不便해서 道具를 만드려고 하면, 그걸 만드는 途中에 또 不便함을 느끼고 그걸
解決하는 道具를 만들게 된다. 그래서 元來 하려고 했던 最初의 일은 못하게 되는
境遇가 많지만, 그렇다고 해서 途中에 만든 副產物들이 어디로 사라지는 것은 아니다.

나도 맨 처음으로 돌아가서 생각해 보면 結局 하고 싶었던 것은 國漢文混用體로
聯合宇宙에 글을 쓰고 싶었던 것인데, 이를 爲해 Hollo도 만들고 Fedify도 만들고
LogTape도 만들고 Optique까지 만들게 되었다. 그러면서 하고 싶은 다른 것들이
새롭게 생겨났고, Hackers’ Pub 같은 커뮤니티를 通해 여러 貴重한 因緣도 맺게
되었다. 아, 그래서 元來 하려고 했던 聯合宇宙에서 國漢文混用體로 글쓰기는
昨年末에 達成하게 되었다! 앞서 紹介한 副產物들 말고도 Mastodon이나 Misskey
等에 패치를 보내야 했긴 하지만 말이다.[^4]

두 해 남짓한 期間에 일어난 일들인데 무척이나 재밌고 豐盛한 旅程이었던 것 같다.
앞으로도 當分間은 專業으로 오픈 소스 開發을 하게 될 것 같은데, 내게 주어진
福에 感謝하며 奮發해야겠다.

[^4]: 글을 받아 보는 쪽에서도 `<ruby>` 태그를 렌더링할 수 있어야 했기 때문이다.

[야크 셰이빙에 關하여]: https://antfu.me/posts/about-yak-shaving
