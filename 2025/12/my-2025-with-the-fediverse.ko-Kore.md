---
published: 2025-12-10T00:00:00+09:00
reads:
  二〇二五年: 2025년
  第十一回: 제11회
  二〇二五年度: 2025년도
  一年間: 일년간
  四月: 4월
  第八回: 제8회
  八月: 8월
  檢查: 검사
  十一月: 11월
---

聯合宇宙와 함께 한 二〇二五年
=============================

昨年에도 〈[聯合宇宙와 함께 한 一年]〉이라는 題目의 글을 썼는데,
올해도 비슷한 主題로 글을 또 쓰게 되었다.
아무래도 專業으로 聯合宇宙[^1]와 關聯된 오픈 소스 소프트웨어를 開發하게 되었다 보니,
이 일을 하는 동안에는 每年 이런 글을 쓰게 될 것 같다는 생각도 든다.

[^1]: 페디버스(fediverse)라고도 불리는 分權型 소셜 미디어 네트워크.
      多樣한 소셜 미디어 소프트웨어 및 서비스들이 [W3C]의 勸告案인 [ActivityPub]
      프로토콜을 具顯하여 相互 疏通 可能하게 하는 것이 核心이다.

[聯合宇宙와 함께 한 一年]: /2024/12/a-year-with-the-fediverse/
[W3C]: https://www.w3.org/
[ActivityPub]: https://www.w3.org/TR/activitypub/
*[W3C]: World Wide Web Consortium


《Thinking Penguin Magazine Vol.0》
-----------------------------------

日本의 聯合宇宙 開發者 모임인 [FediLUG]에서 처음으로 펴낸 同人 雜誌인
《[Thinking Penguin Magazine Vol.0]》에 微力하나마 寄稿를 하게 되었다.
내가 쓴 原稿는 〈國漢文混用體에서 Hollo까지〉(<cite
lang="ja">国漢文混用体からHolloまで</cite>)라는 記事로, 내가 어떻게 해서
[Fedify][][^2]와 [Hollo][][^3]를 만들게 되었는지를 다뤘다. 이 雜誌는 第十一回
[技術書同人誌博覽會]에도 出品되었다고 하는데, 나는 餘裕가 없어서 直接 觀覽은
하지 못했지만, 出品에 參與한 것만으로도 貴重한 經驗이 되었다.

[^2]: TypeScript로 作成된 ActivityPub 서버 프레임워크.

[^3]: Fedify 위에서 만들어진 一人 使用者用 ActivityPub 서버. 혼자서 쓰기에는
      Mastodon이 너무 무겁고 必要 없는 機能이 많아서 만들게 되었다.

[FediLUG]: https://fedilug.y-zu.org/
[Thinking Penguin Magazine Vol.0]: https://gishohaku.dev/gishohaku11/books/PmvnNyNv4Rh7dHmt14EH
[Fedify]: https://fedify.dev/
[Hollo]: https://docs.hollo.social/
[技術書同人誌博覽會]: https://gishohaku.dev/


BotKit
------

올해 初에는 Fedify를 基盤으로 해서 [BotKit]이라는 ActivityPub 봇 프레임워크를
만들었다. 맨 처음에는 뭔가 聯合宇宙 봇 計定을 만들고 싶었던 것 같은데,
정작 그게 뭐였는지는 이제 記憶이 안 난다.

何如間, BotKit은 Mastodon이나 Misskey 같은 ActivityPub 서버에 計定을 만들어서
Mastodon API 또는 Misskey API를 利用해 該當 計定에 揭示物을 올리는 方式의 限界를
느끼고 始作하게 된 프로젝트로서,
BotKit 앱 自體가 하나의 ActivityPub 서버로 役割하는 構造로 되어 있다.
그러한 構造 德에 揭示物의 最大 文字數라든가 레이트 리미트(rate limit) 같은 여러
制約에서 自由롭다는 長點이 있다.

만들어서 公開한 뒤로 BotKit으로 만들어진 몇몇 聯合宇宙 봇들이 생겨나기도 했지만,
實은 아직 그렇게 많이 쓰이고 있지는 않다.

[BotKit]: https://botkit.fedify.dev/


Hackers’ Pub
------------

[Hackers’ Pub]이라는 소프트웨어 開發者들을 爲한 ActivityPub 基盤의 招待制
커뮤니티를 昨年 末에 만들었는데, 올해 들어 많은 분들의 關心을 받으면서
정말 多樣한 소프트웨어 開發者 분들과 交流할 機會가 생겼다.
特히, [李在烈] 님께서 熱情的으로 Hackers’ Pub을 弘報해 주신 德分에
많은 분들이 Hackers’ Pub에 오시게 되었다.

여름에는 디자이너 [朴恩智] 님께 [Hackers’ Pub의 비주얼 아이덴티티]를 依賴하여
아주 귀여운 고양이 로고가 誕生하게 되었다. 이 고양이는 多幸스럽게도
Hackers’ Pub에 계신 많은 분들께 사랑 받고 <q>펍냥이</q>라는 愛稱까지 얻게
되었다. 펍냥이 디자인을 活用하여 티셔츠나 스티커도 制作했는데, 사람들 反應이
아주 좋아서 기뻤다.

혹시 이 글을 읽고 Hackers’ Pub에 興味가 생기신 분이 있다면,
招待해 드릴 수 있으니 個人的으로 連絡 주시기 바란다.

[Hackers’ Pub]: https://hackers.pub/
[李在烈]: https://kodingwarrior.github.io/
[朴恩智]: https://www.instagram.com/eunjibak/
[Hackers’ Pub의 비주얼 아이덴티티]: https://github.com/hackers-pub/visual-identity


《소프트웨어 세션》 (Software Sessions) 出演
--------------------------------------------

올해 봄에는 좋은 機會로 [Jeremy Jung] 氏가 호스트하는
《[소프트웨어 세션]》(Software Sessions) 인터넷 라디오에 出演하여 ActivityPub과
Fedify에 關해 이야기할 수 있었다: 〈[洪民憙의 ActivityPub 이야기]〉(<cite
lang="en">Hong Minhee on ActivityPub</cite>). 다만 英語로 進行된 탓에,
크게 緊張하여 橫說竪說한 것이 後悔로 남는다. 英語 會話를 많이 鍊習해야겠다는
생각도 했다. (하지만 언제나 그렇듯이 생각만 하고 實行에 옮기지는 못했다…)

[Jeremy Jung]: https://bsky.app/profile/jeremyjung.com
[소프트웨어 세션]: https://www.softwaresessions.com/
[洪民憙의 ActivityPub 이야기]: https://www.softwaresessions.com/episodes/activitypub/


《우리의 코드를 찾아서》 出演
-----------------------------

난생 처음으로 YouTube에도 出演하기도 했다. [朴賢宇] 님께서 運營하시는 [하루開發]
채널의 《우리의 코드를 찾아서》 시리즈에
〈[民憙 님과 Fedify & Hollo 알아보기]〉編으로 나오게 된 것이다. 어떻게 Fedify와
Hollo를 만들게 되었는지, 그 誕生 祕話를 便한 雰圍氣에서 풀어낼 수 있었다.

[朴賢宇]: https://lqez.dev/
[하루開發]: https://www.youtube.com/user/lqez
[民憙 님과 Fedify & Hollo 알아보기]: https://youtu.be/sqxR8zscSDo


오픈 소스 컨트리뷰션 아카데미 (OSSCA)
-------------------------------------

情報通信產業振興院(NIPA) 傘下 오픈 소스 소프트웨어 統合 支援 센터(Open UP)에서
主催하는 [오픈 소스 컨트리뷰션 아카데미][OSSCA](이하 OSSCA) 二〇二五年度 參與型
프로젝트로 Fedify가 選定되었다. 이를 契機로 정말 多樣한 훌륭한 컨트리뷰터 분들과
因緣을 맺게 되었다. 總 90名이 넘는 분들이 志願을 해 주셨고, 그 中에서 20餘名의
분들과 함께 Fedify 프로젝트를 進行할 수 있었다.

實際로 [Fedify 1.8] 및 [Fedify 1.9]는 OSSCA<!-- -->를 通해 만난 컨트리뷰터
분들이 아니었다면 릴리스할 수 없었을 程度로 많은 寄與를 해 주셨다.

特히, [權祉源] 님, [金炫舒] 님, [李在烈] 님, [李璨行] 님[^4]께서는 OSSCA 期間이
끝난 뒤에도 持續的으로 Fedify에 寄與를 해 주시고 있으셔서 정말 마음이 든든하다.
이 因緣으로 十一月에는 다 같이 福岡에 旅行을 가기도 했다.

[^4]: 辭典順.

[OSSCA]: https://www.oss.kr/contribution_academy
[Fedify 1.8]: https://github.com/fedify-dev/fedify/discussions/354
[Fedify 1.9]: https://github.com/fedify-dev/fedify/discussions/462
[權祉源]: https://kwonjiwon.org/
[金炫舒]: https://hackers.pub/@gaebalgom
[李璨行]: https://chomu.dev/
*[OSSCA]: Open Source Software Contribution Academy
*[NIPA]: National IT Industry Promotion Agency


Fedify 投資 誘致
----------------

昨年 여름 [Ghost로부터 資金 支援]을 받고 한동안 專業으로 Fedify 프로젝트에
專念할 수 있었는데, 그것도 올해 一分期 때 마무리가 되면서 白手 處地가 되었다.
새로운 資金源을 찾기 爲해 올해 봄에 [NLnet]에 志願書를 냈지만 아쉽게도 떨어졌고,
就職하는 것까지 생각하던 次에 多幸스럽게도 志願했던 [STF]에 냈던 志願書가
通過하게 되었다. 오히려 NLnet에서 받을 수 있는 投資金보다 훨씬 더 넉넉한
金額을 投資 받을 수 있게 되었으니 轉禍爲福이 된 셈이다. 이에 關해서는
〈[STF의 Fedify 投資]〉라는 글에서 仔細히 썼다.

何如間, 感謝하게도 앞으로 一年間 專業으로 Fedify 프로젝트에 集中할 수 있게
되었다.

[Ghost로부터 資金 支援]: /2024/07/ghost-funds-fedify/
[NLnet]: https://nlnet.nl/
[STF]: https://www.sovereign.tech/programs/fund
[STF의 Fedify 投資]: /2025/10/stf-fedify/
*[STF]: Sovereign Tech Fund


各種 發表
---------

올해는 여러 모임이나 컨퍼런스에서 發表를 할 機會가 많았다.

올해 처음으로 한 發表는 四月 初에 開催된 第八回 FediLUG 勉強會[^5]에서 한 것인데,
앞서 言及한 《Thinking Penguin Magazine Vol.0》에 寄稿한 記事
〈[國漢文混用體에서 Hollo까지]〉(<cite lang="ja">国漢文混用体からHolloまで</cite>)와
같은 題目으로 發表했다. 內容은 記事와 大同小異하다. 日本에 갈 餘裕가 없어서
發表 自體는 온라인으로 進行하였다.

그 다음으로 한 發表도 日本에서 한 것으로, 八月 初 [OSC 2025 京都]에서 開催되었던
《[聯合宇宙 만들기—開發者·管理者들의 現場에서]》(<span
lang="ja">Fediverseのつくりかた 〜開発者・管理者たちの現場から〜</span>)
세미나에서 〈[BotKit by Fedify: 누구나 쉽게 만들 수 있는 ActivityPub 봇]〉(<cite
lang="ja">BotKit by Fedify：誰でも簡単に作れるActivityPubボット</cite>)이라는
主題로 發表했다. 이 때도 京都까지 갈 餘裕가 없어서 온라인으로 參與했다.

가을에는 올해 첫 開催인 韓國의 自有·오픈 소스 소프트웨어 컨퍼런스
[FOSS for All 컨퍼런스 2025]에서〈[야크 셰이빙: 새로운 오픈 소스의 原動力]〉이라는
主題로 基調演說을 하게 되었다. 이 發表는 日本에서 했던 發表인 〈國漢文混用體에서
Hollo까지〉를 바탕으로 내가 만든 오픈 소스 프로젝트 中에 聯合宇宙와 關聯 없는
것들까지 함께 다룬 것이다.

겨울에는 函數型 프로그래밍 컨퍼런스인 [liftIO 2025]에서
〈[Optique: TypeScript의 타입 推論으로 CLI 有效性 檢查를 代替하기]〉라는
發表를 했다. 올해 내가 한 發表 中에서는 唯一하게 聯合宇宙와 關聯이 없는 發表였다.

[^5]: 日本의 [FediLUG]에서 隔月로 開催하는 工夫 모임.

[國漢文混用體에서 Hollo까지]: https://speakerdeck.com/minhee/guo-han-wen-hun-yong-ti-karahollomade
[OSC 2025 京都]: https://event.ospn.jp/osc2025-kyoto/
[聯合宇宙 만들기—開發者·管理者들의 現場에서]: https://event.ospn.jp/osc2025-kyoto/session/2211664
[BotKit by Fedify: 누구나 쉽게 만들 수 있는 ActivityPub 봇]: https://speakerdeck.com/minhee/botkit-by-fedify-shui-demojian-dan-nizuo-reruactivitypubbotuto
[FOSS for All 컨퍼런스 2025]: https://2025.fossforall.org/
[야크 셰이빙: 새로운 오픈 소스의 原動力]: https://docs.google.com/presentation/d/11cAmiOkI2bvqfon7ZX_YvV2OqLoKB_gJHxl7OcfsFJU/edit?usp=sharing
[liftIO 2025]: https://event-us.kr/liftioconf/event/114005
[Optique: TypeScript의 타입 推論으로 CLI 有效性 檢查를 代替하기]: https://hongminhee.codeberg.page/optique-liftio-2025/
*[OSC]: Open Source Conference
*[CLI]: command-line interface


一年을 마무리하며
-----------------

別로 한 게 없다고 생각했지만, 막상 整理해 보니 意外로 이것저것 한 게 많은 한
해였다. STF<!-- -->로부터의 投資는 來年 末까지니, 아마도 來年에도 Fedify
프로젝트를 中心으로 聯合宇宙와 關聯된 많은 活動을 이어가게 될 듯하다.
個人的으로는 ActivityPub 및 聯合宇宙의 立地가—X가 Elon Musk의 손아귀에
넘어갔음에도—아직 鞏固하지 못하다는 게 걱정인데, 來年에는 狀況이 좀 더
나아지길 바란다.
