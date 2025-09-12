---
published: 2025-09-12T20:10:00+09:00
---

オープンソース開発の近況
========================

気が付けば最近かなり多くのオープンソースプロジェクトを作ることになったので、
近況報告を兼ねて、進行中のオープンソースプロジェクトを文章に纏めてみる。
各プロジェクトは何らかの形でお互いに関係している。


[Hollo]
-------

実は最近私が作ることになったオープンソースプロジェクトの出発点となったのが、
まさにこのプロジェクトだ。Elon MuskがTwitterを買収してXに名前を変えてから、
もともと使っていたMastodonをさらに熱心に使うようになったのだが、
[漢字ハングル混じり文]、所謂「国漢文混用体」で投稿を書いていると他の人が読みづらくないかと気を使うようになった。
そこで[Seonbi]を使って漢字ハングル混じり文をハングル専用文に変換する機能をMastodonに追加することも考えたが…私以外誰も使わなさそうなこの機能をMastodonのアップストリームに入れるのはさすがに無理がある。
となるとダウンストリームパッチを維持しながらMastodonサーバーも自分で運営しなければならないということになるが、
Mastodonは重いことで有名なのでそうしたくはなかった。
そこで御一人様向けの軽量ActivityPub実装を作ろうと思ったのが[Hollo]だ。
一人で使うActivityPubサーバーソフトウェアなので、
韓国語で「一人で」という意味の「<ruby lang="ko" >홀로<rp>（</rp><rt lang="ja" >ホロ</rt>
<rp>）</rp></ruby>」と名付けた。

[ドッグフーディング]に成功し、
現在は私のフェディバースアカウントをHolloに移行した。
フェディバースのハンドルは[@hongminhee@hollo.social]。
漢字ハングル混じり文で思う存分投稿を書いており、
漢字の上にハングルの読み仮名が[`<ruby>`]タグで付いている。

実はドッグフーディングを達成してからは、私にとって必要な機能は全て実装されたので、
バグ修正などメンテナンス中心の作業となっている。

[Hollo]: https://docs.hollo.social/
[漢字ハングル混じり文]: https://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%B3%E3%82%B0%E3%83%AB%E5%B0%82%E7%94%A8%E6%96%87%E3%81%A8%E6%BC%A2%E5%AD%97%E3%83%8F%E3%83%B3%E3%82%B0%E3%83%AB%E6%B7%B7%E3%81%98%E3%82%8A%E6%96%87
[Seonbi]: https://github.com/dahlia/seonbi
[ドッグフーディング]: https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%83%E3%82%B0%E3%83%95%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0
[@hongminhee@hollo.social]: https://hollo.social/@hongminhee
[`<ruby>`]: https://developer.mozilla.org/ja/docs/Web/HTML/Element/ruby

[Fedify]
--------

前述のHolloを最初に実装する際は、
ActivityPub実装を一から作ろうと試みた。
しかし作っているうちに、ActivityPub実装のコードが思ったより厚く、
やることが多いと感じた。
そこでHolloの開発を中断してActivityPubサーバーフレームワークを作ることにしたのが[Fedify]だ。
作って半年も経たないうちに[Ghostから資金支援]を受けることになり、
その後しばらくフルタイムでFedifyプロジェクトに取り組むことになった。
現在は韓国の情報通信産業振興院傘下の[オープンソースソフトウェア統合支援センター]が主催する[オープンソースコントリビューションアカデミー]の参与型プロジェクトに選定され、
優秀なメンティーの方々と一緒にプロジェクトを進めている。

Fedify以前にもActivityPubサーバーフレームワークがなかったわけではない。
しかし、どれも私が必要とする抽象化レベルを提供していなかった。
或るものはWebFingerや署名アルゴリズム程度しか提供しない小さなライブラリに近く、
また或るものはほぼMastodonと比較できるような、フレームワークというより完成されたソーシャルメディアプラットフォーム実装に近かった。
例えるなら、HTTPライブラリやWordPressのようなCMSはあっても、
RailsやDjangoに近いフレームワークがなかったのだ。

Fedifyを作る際に念頭に置いた目標は以下の通り。

 1. できるだけ多くの開発者が使えるようにする。
 2. データベースやストレージに依存しない。
    アプリケーション開発者が使いたいデータベースを使えるようにする。
 3. ActivityPubプロトコルを活用する方法に制約がないようにする。
    例えば、マイクロブログのような完成されたアプリケーションの形を前提としない。
 4. ActivityPubを実装するなら備えるべき全てのもの——認証、署名、
    アウトボックスおよびインボックスキューなど——を一切提供する。
 5. ActivityPubをよく知らない人でも使えるほど豊富なドキュメントを提供する。
 6. 型安全でなければならない。

そして、この記事を書いている現在、以上の目標はほぼ達成出来たと思う。
結果的にHolloはFedifyベースで作られることになり、その他にも——後述する——Hackers'
Pub、Ghostなどが Fedifyを使ってActivityPubを実装することになった。
また、まだ完成していないが[Kosmo]、
[Cosmoslide]などのプロジェクトがFedifyを使ってActivityPubを実装している。

[Fedify]: https://fedify.dev/
[Ghostから資金支援]: /2024/07/ghost-funds-fedify/
[オープンソースソフトウェア統合支援センター]: https://www.oss.kr/
[オープンソースコントリビューションアカデミー]: https://www.oss.kr/contribution_academy
[Kosmo]: https://github.com/byulmaru/kosmo
[Cosmoslide]: https://github.com/cosmoslide/cosmoslide
*[NIPA]: National IT Industry Promotion Agency
*[OSSCA]: Open Source Software Contribution Academy


[LogTape]
---------

Fedifyにログシステムを追加しようとJavaScriptで作られたログライブラリを探してみたが、
私が望む条件のライブラリがなかったので新しく作ることになったのが[LogTape]だ。

私が望む条件というのも大したものではなかった。
ただPython標準ライブラリの[`logging`]モジュールに相当するものを探しただけなのだが、
振り返ってみると`logging`モジュールがかなりよく出来たものだったようにも思える。
私が望む条件は以下の通りだった。

 1. ライブラリでログを残すが、
    アプリケーションでライブラリのログ出力を制御できるようにする。
    アプリケーションで出力設定を別途しない限り、
    ライブラリのログはどこにも出力されてはならない。
 2. ロガーが階層的に管理されるべき。
    上位ロガーにインストールされた出力先は下位ロガーにも適用されるべき。
 3. 出力先は実装しやすいインターフェースでなければならない。
 4. 型安全でなければならない。
 5. Node.js、Deno、Bun、エッジ関数、
    ウェブブラウザなど様々なJavaScriptランタイムで幅広く動作する。

概してアプリケーションではなくライブラリでログを残すために必要な
条件だった。どうせFedifyで使うために作ったので、作った後放置していたが、
去年の秋を過ぎてから、なぜか口コミで広まって多くの人が使うようになった。

[LogTape]: https://logtape.org/
[`logging`]: https://docs.python.org/3/library/logging.html


[Hackers' Pub]
--------------

ソフトウェア開発に関する記事を投稿するブログを作りたくて[velog][^0]を少し使うようになったが、
ActivityPubをサポートしていないのが残念で、
velogのイシュートラッカーに[イシュー]を残すことになった。
幸いにも[前向きに検討するという返答]を受けたが、
制作陣の方々が忙しくてその後音沙汰がなかった。
結局私が自分でActivityPubをサポートするソフトウェア開発者のためのソーシャルメディア兼ブログプラットフォームを作ってみようと思ったのが[Hackers' Pub]だ。

去年の冬に初めてオープンしてからすぐに[<ruby>李在烈<rp>（</rp><rt>イ・ジェヨル</rt>
<rp>）</rp></ruby>](https://kodingwarrior.github.io/)さんが参加されたが、
招待制にも拘わらず、
李在烈さんがあちこちでものすごく熱心にHackers' Pubを宣伝してくださったお陰で、
かなり多くの方が参加して活動されるようになった。
短期的な目標は韓国で広く使われるようになることで、
さらに中長期的な目標は東アジア全般と英語圏を網羅することだ。
しかし、まだ大部分のコンテンツが韓国語で書かれており、
少数の日本人の方が間欠的に日本語コンテンツを投稿してくださる程度だ。

Fedifyを通じてActivityPubを実装したので、当然Hollo、Mastodon、
Misskeyなどと通信が可能で、Xのように投稿——`Note`——を書くことも出来、
長い記事——`Article`——を書くことも出来る。
絵文字リアクションや引用のようなMastodonにはない機能も提供している。

そしてHackers' Pubのもう一つの自慢は、
安全で平等なコミュニティを作るための[行動規範]だ。
特に私が最も気に入っている文言は次の通り。

> 差別的な発言と、差別に対抗する発言を区別します

技術的な側面では、もともと[Deno]と[Fresh]を使って作っていたが、
現在はウェブフロントエンド開発に造詣が深い[<ruby>申義河<rp>（</rp><rt>シン・ウィハ</rt>
<rp>）</rp></ruby>](https://xiniha.dev/)さんの協力を得て[GraphQL]と[SolidStart]ベースに移行している。[^1]

ソースコードは[AGPL 3.0]で[GitHub]に公開されている。
実際にかなり多くのHackers'
Pub会員の方々が不便な点を自ら修正するプルリクエストを送ってくださっている。

ちなみに私のHackers' Pubアカウントは[@hongminhee@hackers.pub]だ。

[^0]: 韓国で広く使われているソフトウェア開発者向けのブログプラットフォーム。
      日本のQiitaやZennと似た位置づけ。
[^1]: いろいろな理由でDenoを使ったことを後悔しているが、
      仕方なくDenoは移行後も使い続けている。

[Hackers' Pub]: https://hackers.pub/
[velog]: https://velog.io/
[イシュー]: https://github.com/velog-io/velog/issues/48
[前向きに検討するという返答]: https://github.com/velog-io/velog/issues/48
[行動規範]: https://hackers.pub/coc
[Deno]: https://deno.com/
[Fresh]: https://fresh.deno.dev/
[GraphQL]: https://graphql.org/
[SolidStart]: https://start.solidjs.com/
[AGPL 3.0]: https://www.gnu.org/licenses/agpl-3.0.ja.html
[GitHub]: https://github.com/hackers-pub/hackerspub
[@hongminhee@hackers.pub]: https://hackers.pub/@hongminhee
*[AGPL]: GNU Affero General Public License


[Upyo]
------

Hackers' Pubを作りながらメール送信が必要になったが、
メールプロバイダーを簡単に切り替えられるメール送信ライブラリを探していて、
気に入るものがなかったので作ることになったのが[Upyo]だ。
韓国語で切手を意味する単語「<ruby lang="ko" >郵票<rp>（</rp><rt lang="ja" >ウピョ</rt>
<rp>）</rp></ruby>」から名前を取った。

もともと.NET系の[FluentEmail]のようなものをJavaScriptエコシステムで探していたが、
意外にも適当なものがなくて驚いた。
メールプロバイダーを切り替えたり冗長化したりすることは思ったよりあまりないのだろうか？

LLMベースのコーディングエージェント[^2]を本格的に使った最初のプロジェクトでもあった。
それでもまだLLMの能力にそれほど期待していなかったため、
設計と初期コーディングは自分で行い、後でトランスポートの種類を増やす際にLLMの助けを多く借りた。
作るのに2日かかったと思う。
コーディングエージェントの驚くべき生産性が印象的だった。

私が作った他のライブラリと同様に、Node.js、Deno、Bun、エッジ関数、
ウェブブラウザなど様々なJavaScriptランタイムをサポートしているのも特徴だ。

[^2]: [Claude Code]を使った。

[Upyo]: https://upyo.org/
[FluentEmail]: https://github.com/lukencode/FluentEmail
[Claude Code]: https://docs.anthropic.com/ja/docs/claude-code/overview
*[LLM]: large language model


[Optique]
---------

Fedifyはフレームワークでもあるが、`fedify`コマンドというCLIツールも提供しているが、
以前はDeno専用CLIフレームワークの[Cliffy]をそれなりにうまく使っていたが、
Deno以外にNode.js、Bunなどをサポートする必要が出てきて[^3]、
Cliffyの代替を探すことになった。
しかし今回も同じパターンで…気に入るものが見つからなかった。

実は私の心の中には、既に理想に近いCLIパーサーライブラリが存在していた。
ただそれが[optparse-applicative]というHaskellライブラリだったため、
Fedifyでは使えなかっただけだ。このoptparse-applicativeというライブラリのアイデアはシンプルだ。
CLIパーサーもパーサーなのでパーサーコンビネーターで作ろうというものだ。

とにかく、欲しいCLIパーサーライブラリが見つからなかったので自分で作るしかない。
それで作ったのが[Optique](https://optique.dev/)だ。

最初はoptparse-applicativeとほぼ同じようにポーティングしようとしたが、
やはりHaskellとJavaScriptではDSLを構成する表現力に大きな差があった。
そこで悩んだ末に、
TypeScript開発者に既に馴染みのある[Zod]のようなバリデーションライブラリのAPIを参考にすることにした。

Upyoプロジェクトとは違い、
LLMコーディングエージェントはごく限定的にドキュメント作成やテストコード作成などに使用し、
そのせいか作るのに一週間以上かかったと思う。

作ってみると、
JavaScriptエコシステム内ではかなりユニークなCLIパーサーライブラリが出来たと自評出来た。
勿論、多くのCLIアプリケーションがそれほど複雑なオプションを受け取るわけではないが、
ある程度規模のあるCLIアプリケーションを作るならOptiqueを使っても後悔しないと自負している。

あ、そして前述した他のライブラリと同様に、Node.js、Deno、Bun、
さらにはエッジ関数やウェブブラウザでも動作する。そんな必要があるのかと思うが、
ただの自己満足というか。ただし、お陰でテストがとても書きやすいライブラリになった。

[^3]: Fedifyフレームワーク自体は既にNode.js、Deno、Bun、
      Cloudflare Workersなどをサポートしていたが、
      CLIツールの`fedify`コマンドだけはDeno専用で作られていた。

[Optique]: https://optique.dev/
[Cliffy]: https://cliffy.io/
[optparse-applicative]: https://github.com/pcapriotti/optparse-applicative
[Zod]: https://zod.dev/
*[CLI]: command-line interface


ヤクシェービング
----------------

考えてみると、
私のオープンソース開発の原動力はヤクシェービングから来るのではないかと思う。
Anthony Fuの「[ヤクシェービングについて]」という記事を読んだことがあるが、
モチベーションを得る方法が私ととても似ているという印象を受けた。
何かが不便でツールを作ろうとすると、
それを作る途中でまた不便さを感じてそれを解決するツールを作ることになる。
それで元々やろうとしていた最初のことは出来なくなる場合が多いが、
だからといって途中で作った副産物がどこかに消えるわけではない。

私も最初に戻って考えてみると、
結局やりたかったのは漢字ハングル混じり文でフェディバースに投稿を書きたかったのだが、
そのためにHolloも作り、Fedifyも作り、LogTapeも作り、Optiqueまで作ることになった。
そうしながらやりたい他のことが新しく生まれ、Hackers'
Pubのようなコミュニティを通じて多くの貴重な縁も結ぶことが出来た。あ、
それで元々やろうとしていたフェディバースで漢字ハングル混じり文で投稿を書くことは去年末に達成することが出来た！
前述した副産物以外にもMastodonやMisskeyなどにパッチを送る必要はあったが。[^4]

2年余りの期間に起きたことだが、とても楽しく豊かな旅路だったと思う。
これからもしばらくはフルタイムでオープンソース開発をすることになりそうだが、
私に与えられた恵みに感謝しながら奮起しなければ。

[^4]: 投稿を受け取る側でも`<ruby>`タグをレンダリング出来る必要があったからだ。

[ヤクシェービングについて]: https://antfu.me/posts/about-yak-shaving
