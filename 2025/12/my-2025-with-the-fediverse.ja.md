---
published: 2025-12-10T00:00:00+09:00
---

フェディバースと過ごした二〇二五年[^1]
======================================

昨年も「[フェディバースと共に過ごした一年]」というタイトルの記事を書いたが、
今年も似たようなテーマでまた記事を書くことになった。
専業でフェディバース︵fediverse︶[^2]関連のオープンソースソフトウェアを開発するようになったこともあり、
この仕事を続ける限り、毎年このような記事を書くことになりそうだという気もする。

[^1]: [Fediverse Advent Calendar 二〇二五]の十日目の記事。

[^2]: 分散型ソーシャルメディアネットワーク。
      様々なソーシャルメディアソフトウェアやサービスが[W3C]の勧告である[ActivityPub]
      プロトコルを実装し、相互に通信可能にすることがポイントである。

[Fediverse Advent Calendar 二〇二五]: https://adventar.org/calendars/11463
[フェディバースと共に過ごした一年]: /2024/12/a-year-with-the-fediverse/
[W3C]: https://www.w3.org/
[ActivityPub]: https://www.w3.org/TR/activitypub/
*[W3C]: World Wide Web Consortium


『Thinking Penguin Magazine Vol.0』
-----------------------------------

日本のフェディバース開発者の集まりである[FediLUG]が初めて発行した同人誌
『[Thinking Penguin Magazine Vol.0]』に微力ながら寄稿することになった。
私が書いた原稿は「国漢文混用体からHolloまで」という記事で、どのようにして
[Fedify][][^3]と[Hollo][][^4]を作ることになったのかを扱った。この雑誌は第十一回
[技術書同人誌博覧会]にも出品されたとのことだが、私は余裕がなくて直接観覧は
できなかったものの、出品に参加できただけでも貴重な経験となった。

[^3]: TypeScriptで作成されたActivityPubサーバーフレームワーク。

[^4]: Fedifyの上で作られた一人ユーザー用ActivityPubサーバー。一人で使うには
      Mastodonが重すぎて不要な機能が多いため、作ることになった。

[FediLUG]: https://fedilug.y-zu.org/
[Thinking Penguin Magazine Vol.0]: https://gishohaku.dev/gishohaku11/books/PmvnNyNv4Rh7dHmt14EH
[Fedify]: https://fedify.dev/
[Hollo]: https://docs.hollo.social/ja/
[技術書同人誌博覧会]: https://gishohaku.dev/


BotKit
------

今年の初めにはFedifyをベースにして[BotKit]というActivityPubボットフレームワークを
作った。最初は何かフェディバースのボットアカウントを作りたかったような気がするが、
正確に何だったかは今では思い出せない。

とにかく、BotKitはMastodonやMisskeyのようなActivityPubサーバーにアカウントを作って
Mastodon APIやMisskey APIを利用してそのアカウントに投稿をする方式の限界を
感じて始めたプロジェクトで、
BotKitアプリ自体が一つのActivityPubサーバーとして機能する構造になっている。
そのような構造のおかげで、投稿の最大文字数やレートリミット︵rate limit︶などの様々な
制約から自由だという利点がある。

作って公開した後、BotKitで作られたいくつかのフェディバースボットが生まれたが、
実はまだそれほど多くは使われていない。

[BotKit]: https://botkit.fedify.dev/


Hackers’ Pub
------------

[Hackers’ Pub]というソフトウェア開発者のためのActivityPubベースの招待制
コミュニティを昨年末に作ったが、今年になって多くの方々から関心を頂き、
本当に多様なソフトウェア開発者の方々と交流する機会ができた。
特に、[<ruby>李在烈<rp>（</rp><rt>イ・ジェヨル</rt><rp>）</rp></ruby>][李在烈]さんが熱心にHackers’ Pubを宣伝してくださったおかげで、
多くの方々がHackers’ Pubに来られるようになった。

夏にはデザイナーの[<ruby>朴恩智<rp>（</rp><rt>パク・ウンジ</rt><rp>）</rp></ruby>][朴恩智]さんに[Hackers’ Pubのビジュアルアイデンティティ]を依頼し、
とても可愛い猫のロゴが誕生することになった。この猫は幸いにも
Hackers’ Pubにいらっしゃる多くの方々に愛され、<q>パブにゃんこ</q>という愛称まで得ることに
なった。パブにゃんこデザインを活用してTシャツやステッカーも制作したが、皆さんの反応が
とても良くて嬉しかった。

もしこの記事を読んでHackers’ Pubに興味が湧いた方がいらっしゃれば、
招待できますので個人的にご連絡ください。

[Hackers’ Pub]: https://hackers.pub/
[李在烈]: https://kodingwarrior.github.io/
[朴恩智]: https://www.instagram.com/eunjibak/
[Hackers’ Pubのビジュアルアイデンティティ]: https://github.com/hackers-pub/visual-identity


『Software Sessions』出演
-------------------------

今年の春には良い機会があり、[Jeremy Jung]氏がホストする
『[Software Sessions]』インターネットラジオに出演し、ActivityPubと
Fedifyについて話すことができた——「[Hong Minhee on ActivityPub]」。
ただし英語で進行されたため、かなり緊張してしどろもどろになってしまったことが後悔として残る。
英会話をもっと練習しなければという思いもした。︵しかしいつもそうであるように、思うだけで実行には移せなかった…︶

[Jeremy Jung]: https://bsky.app/profile/jeremyjung.com
[Software Sessions]: https://www.softwaresessions.com/
[Hong Minhee on ActivityPub]: https://www.softwaresessions.com/episodes/activitypub/


『私たちのコードを探して』出演
------------------------------

生まれて初めてYouTubeにも出演することになった。[<ruby>朴賢宇<rp>（</rp><rt>パク・ヒョヌ</rt><rp>）</rp></ruby>][朴賢宇]さんが運営される[ハル開発]
チャンネルの『私たちのコードを探して』︵<span lang="ko">우리의 코드를 찾아서</span>︶シリーズに
「[民憙さんとFedify & Holloについて学ぶ]」︵<span lang="ko">民憙 님과 Fedify & Hollo 알아보기</span>︶編で出ることになったのだ。どのようにFedifyと
Holloを作ることになったのか、その誕生秘話を気楽な雰囲気で語ることができた。

[朴賢宇]: https://lqez.dev/
[ハル開発]: https://www.youtube.com/user/lqez
[民憙さんとFedify & Holloについて学ぶ]: https://youtu.be/sqxR8zscSDo


オープンソースコントリビューションアカデミー︵OSSCA︶
------------------------------------------------------

韓国政府機関である情報通信産業振興院︵NIPA︶傘下のオープンソースソフトウェア統合支援センター︵Open UP︶が
主催する[オープンソースコントリビューションアカデミー][OSSCA]︵以下OSSCA︶二〇二五年度参与型
プロジェクトとしてFedifyが選定された。これを機に本当に多様な優秀なコントリビューターの方々と
ご縁ができた。合計90名以上の方々が志願してくださり、その中から20名余りの
方々と一緒にFedifyプロジェクトを進めることができた。

実際に[Fedify 1.8]及び[Fedify 1.9]はOSSCA<!-- -->を通じて出会ったコントリビューター
の方々がいなければリリースできなかったほど、多くの貢献をしてくださった。

特に、[<ruby>李在烈<rp>（</rp><rt>イ・ジェヨル</rt><rp>）</rp></ruby>][李在烈]さん、[<ruby>李璨行<rp>（</rp><rt>イ・チャンヘン</rt><rp>）</rp></ruby>][李璨行]さん、[<ruby>金炫舒<rp>（</rp><rt>キム・ヒョンソ</rt><rp>）</rp></ruby>][金炫舒]さん、[<ruby>権祉源<rp>（</rp><rt>クォン・ジウォン</rt><rp>）</rp></ruby>][権祉源]さん[^5]はOSSCA期間が
終わった後も継続的にFedifyに貢献してくださっており、本当に心強い。
この縁で十一月には皆で福岡に旅行に行くこともできた。

[^5]: 五十音順。

[OSSCA]: https://www.oss.kr/contribution_academy
[Fedify 1.8]: https://github.com/fedify-dev/fedify/discussions/354
[Fedify 1.9]: https://github.com/fedify-dev/fedify/discussions/462
[権祉源]: https://kwonjiwon.org/
[金炫舒]: https://hackers.pub/@gaebalgom
[李璨行]: https://chomu.dev/
*[OSSCA]: Open Source Software Contribution Academy
*[NIPA]: National IT Industry Promotion Agency


Fedify投資誘致
--------------

昨年の夏に[GhostのFedifyへの資金支援][1]を受けてしばらくの間フルタイムでFedifyプロジェクトに
専念することができたが、それも今年の第一四半期で終わり、振り出しに戻った。
新しい資金源を探すために今年の春に[NLnet]に申請書を出したが、残念ながら落選し、
就職することまで考えていた矢先に、幸いにも申請していた[STF]に出した申請書が
通過することになった。むしろNLnetから受けられる投資金よりもはるかに余裕のある
金額を投資してもらえることになったので、転禍為福となったわけだ。これについては
「[STFのFedifyへの投資]」という記事で詳しく書いた。

とにかく、ありがたいことにこれから一年間フルタイムでFedifyプロジェクトに集中できる
ようになった。

[1]: /2024/07/ghost-funds-fedify/
[NLnet]: https://nlnet.nl/
[STF]: https://www.sovereign.tech/programs/fund
[STFのFedifyへの投資]: /2025/10/stf-fedify/
*[STF]: Sovereign Tech Fund


各種発表
--------

今年は様々な集まりやカンファレンスで発表する機会が多かった。

今年初めてした発表は四月初めに開催された第八回FediLUG勉強会[^6]でのもので、
先に述べた『Thinking Penguin Magazine Vol.0』に寄稿した記事
「[国漢文混用体からHolloまで]」と
同じタイトルで発表した。内容は記事とほぼ同じだ。日本に行く余裕がなかったため、
発表自体はオンラインで行った。

その次にした発表も日本でのもので、八月初めに[OSC 2025 京都]で開催された
「[フェディバースのつくりかた—開発者・管理者たちの現場から]」
セミナーで「[BotKit by Fedify〜誰でも簡単に作れるActivityPubボット]」という
テーマで発表した。この時も京都まで行く余裕がなかったのでオンラインで参加した。

秋には今年初開催となる韓国の自由・オープンソースソフトウェアカンファレンス
[FOSS for All カンファレンス 2025]で「ヤクシェービング——新しいオープンソースの原動力」︵<span lang="ko">야크 셰이빙: 새로운 오픈 소스의 原動力</span>︶という
テーマで基調講演をすることになった。この発表は日本でした発表である「国漢文混用体から
Holloまで」を基に、私が作ったオープンソースプロジェクトの中でフェディバースと関係ない
ものまで一緒に扱ったものだ。

冬には韓国の関数型プログラミングカンファレンスである[liftIO 2025]で
「Optique——TypeScriptの型推論でCLIバリデーションを代替する」︵<span lang="ko">Optique: TypeScript의 타입 推論으로 CLI 有效性 檢查를 代替하기</span>︶という
発表をした。今年私がした発表の中では唯一フェディバースと関連のない発表だった。

[^6]: 日本の[FediLUG]で隔月で開催する勉強会。

[国漢文混用体からHolloまで]: https://speakerdeck.com/minhee/guo-han-wen-hun-yong-ti-karahollomade
[OSC 2025 京都]: https://event.ospn.jp/osc2025-kyoto/
[フェディバースのつくりかた—開発者・管理者たちの現場から]: https://event.ospn.jp/osc2025-kyoto/session/2211664
[BotKit by Fedify〜誰でも簡単に作れるActivityPubボット]: https://speakerdeck.com/minhee/botkit-by-fedify-shui-demojian-dan-nizuo-reruactivitypubbotuto
[FOSS for All カンファレンス 2025]: https://2025.fossforall.org/
[야크 셰이빙: 새로운 오픈 소스의 原動力]: https://docs.google.com/presentation/d/11cAmiOkI2bvqfon7ZX_YvV2OqLoKB_gJHxl7OcfsFJU/edit?usp=sharing
[liftIO 2025]: https://event-us.kr/liftioconf/event/114005
[Optique: TypeScript의 타입 推論으로 CLI 有效性 檢查를 代替하기]: https://hongminhee.codeberg.page/optique-liftio-2025/
*[OSC]: Open Source Conference
*[CLI]: command-line interface


一年を締めくくりながら
----------------------

大したことをしていないと思っていたが、いざ整理してみると意外にあれこれしたことが多い一年
だった。STF<!-- -->からの投資は来年末まであるので、おそらく来年もFedify
プロジェクトを中心にフェディバースと関連した多くの活動を続けることになりそうだ。
個人的にはActivityPubとフェディバースの状況が—XがElon Muskの手中に
落ちたにもかかわらず—まだ盤石ではないことが心配だが、来年には状況がもう少し
良くなることを願う。
