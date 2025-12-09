---
published: 2024-12-24T00:00:00+09:00
---

フェディバースと共に過ごした一年[^1]
====================================

二〇二四年は、本当にフェディバースに夢中になって過ごした一年だった。
フェディバースとActivityPubに関連する大小様々なプロジェクトを進め、
その中のいくつかは多くの人々から好評を得る事が出来た。
良い思い出として記録に残しておこうと思い、この文章を書く事にした。

[^1]: [Fediverse Advent Calendar 二〇二四]の二四日目の記事。

[Fediverse Advent Calendar 二〇二四]: https://adventar.org/calendars/10051


フェディバースとは
------------------

先ず、フェディバース︵fediverse︶とは何かを簡単に説明すると、
異なる種類のソーシャルメディアが相互に通信出来るネットワークの事を指す。
詰まり、全く異なるソーシャルメディア上の二つのアカウントが相互にフォローし、
コメントを残し、いいねを送り合える事だ。 技術的には、
異なるソーシャルメディア間の相互運用性︵interoperability︶を実現する為に、
W3Cの技術標準である[ActivityPub]プロトコルが使用されている。

現在、フェディバースに参加している代表的なソーシャルメディアとしては、
[Mastodon]、[Pixelfed]、[Akkoma]、[Misskey]、[WordPress]等があり、
その他にも一つ一つ挙げ切れない程多くのプロジェクトが存在する。
その大半はオープンソースプロジェクトでも有る。また、オープンソースではないが、
Metaの[Threads]も今年の夏からActivityPubを少しずつ実装し、
既にある程度フェディバースに参入していると言える。

異なるソーシャルメディアが通信し合う仕組みである為、
フェディバース内のアカウントアドレスにはユーザー名だけでなく、
サーバー名も含まれる。
一般に<q>フェディバースハンドル</q>と呼ばれるこのアドレス形式は、
@username@hostの様に、まるでメールアドレスに似ている。
これにより、異なるサーバーやプラットフォームに属するアカウント同士が相互にフォローし、
コミュニケーションを取る事が出来る。
勿論私自身もフェディバースアカウントを持っており、
[@hongminhee@hollo.social]をフォローしてくれれば良い。

[ActivityPub]: https://activitypub.rocks/
[Mastodon]: https://joinmastodon.org/ja
[Pixelfed]: https://pixelfed.org/
[Akkoma]: https://akkoma.social/
[Misskey]: https://misskey-hub.net/ja/
[WordPress]: https://ja.wordpress.org/
[Threads]: https://www.threads.net/
[@hongminhee@hollo.social]: https://hollo.social/@hongminhee


Fedify
------

[Fedify]は、今年の私にとって最大の成果と言えるだろう。
FedifyはTypeScriptで書かれたActivityPubサーバーフレームワークで、
ActivityPubサーバーを実装する際に使える適切な抽象化レベルが見つからなかった為、
作る事にした。最初は一からActivityPubサーバーアプリを作ろうと何度か試みて、
ある程度動作するものも作ってみたが、その結果のコードには満足出来なかった。
そこで、きちんと抽象化をしながら作成を進めていく内に、
結局フレームワークの様なものを作っている事に気づき、
FedifyといったActivityPubサーバーフレームワークの必要性を痛感する様になった。

Fedifyには計4回の書き直しが有った。最初はTypeScriptで書き、その後Pythonに移行し、
更にC#、そして最終的にTypeScriptに戻ってきた。
言語選択には複数の考慮事項があった。第一に、
ActivityPubのデータ交換形式である[JSON-LD]の実装がある言語である必要があり、
またJSON-LDを簡単かつ便利に扱う為にある程度動的である必要があった。
第二に、動的言語であっても静的型付け、
所謂[gradual typing]を良くサポートしている必要があった。
最後に、ユーザーが多く、エコシステムが豊かである必要があった。
これはFedifyが広く使われる事を望んでいた為だ。
全てを考慮した結果、TypeScriptを選択する事になった。

全ての書き直しの過程を含めると昨年12月初めから着手し、
最後の書き直しに限って言えば[2月末から作り始め][1]、
3月初めに最初の[0.1.0バージョン]をリリースした。
リリース前に考えていたコードネームはFedikitだったが、
[リリースに先立って検索してみると、
既に同じ名前のプロジェクトが存在する事が分かり、
急いでFedifyに名前を変更する事になった][2]。
Fedikitというコードネームで作業していたPythonバージョンは[GitHubにアップロードしてある][3]。

Fedifyは現在、
ActivityPubサーバーを作る際に必要な機能を最も幅広く提供するフレームワークだと自負している。
フェディバースはActivityPubを実装するだけでは終わらず、JSON-LD、
[Activity Vocabulary]、[WebFinger]、[NodeInfo]、[HTTP Signatures]、
[Linked Data Signatures]、[Object Integrity Proofs]等、
多くの仕様を扱う必要がある。Fedifyはそれら全てを網羅している。
更には、ActivityPubの主要な実装と言えるMastodonやMisskeyで未実装の機能も、
Fedifyでは実装されているものが多くある。ActivityPubの仕様だけを見て、
ActivityPubサーバーの実装が簡単だと思い込み、
ActivityPubフレームワークなしで着手して、
結局その複雑さに戸惑うケースもよく見かける。
これからActivityPubサーバーを一つ作ってみようと考えている人々には、
是非Fedifyを使う事を勧める。

また、Fedifyを作る上で力を入れたもう一つが[文書化][Fedify]だ。
[リファレンス文書]は勿論、
Fedifyの全ての機能を網羅する豊富なマニュアルが存在する必要があると考えた。
新機能を追加する際も、マニュアル文書を先に作成してから実装を行う程だった。
その御陰で文書の量がかなり多くなり、
今では英語以外の言語にどの様に翻訳すべきかが悩みの種となっている。

最後に、私がFedifyを通じて自分なりに満足出来る成果を上げたと感じた最大の出来事は、
[GhostによるFedifyの資金支援][4]だ。
これにより人生で初めて専業のオープンソース開発者になる事が出来た。[^2]
何より、GhostはFedifyの最大のユーザーでもある。
GhostのActivityPub実装は現在進行中で、プライベートベータ段階にある。
恐らく来年には公開される予定だ。

[^2]: 厳密には元の職場でもオープンソース製品を専業で作っていましたが、
      私が始めたプロジェクトではなかった。

[Fedify]: https://fedify.dev/
[JSON-LD]: https://json-ld.org/
[gradual typing]: https://en.wikipedia.org/wiki/Gradual_typing
[1]: https://github.com/dahlia/fedify/commit/9858cea9db609e7aa7a65b3bcec8dd0d8838b574
[0.1.0バージョン]: https://github.com/dahlia/fedify/releases/tag/0.1.0
[2]: https://todon.eu/@hongminhee/111976051313889872
[3]: https://github.com/dahlia/fedikit
[Activity Vocabulary]: https://fedify.dev/manual/vocab
[NodeInfo]: https://fedify.dev/manual/nodeinfo
[HTTP Signatures]: https://fedify.dev/manual/send#http-signatures
[Linked Data Signatures]: https://fedify.dev/manual/send#linked-data-signatures
[Object Integrity Proofs]: https://fedify.dev/manual/send#object-integrity-proofs
[リファレンス文書]: https://jsr.io/@fedify/fedify/doc
[4]: https://writings.hongminhee.org/2024/07/ghost-funds-fedify/


Hollo
-----

[Hollo]はお一人様向けActivityPubサーバーだ。
通常はMastodonやMisskeyサーバーの中から気に入った所に登録する形でフェディバースアカウントを作成するが、
時々ソフトウェアエンジニアの中には自分のドメイン名で直接運営するサーバーを連携させてフェディバースアカウントを設置する人もいる。
しかし、MastodonやMisskeyの様なソフトウェアは基本的に多くの人々がアカウントを作成して共に使用する事を前提に設計されている為、
一人で使うには不要な機能も多く、重たい上に設置も面倒だ。
そういった人々の為に作ったのがHolloだ。
HolloはPostgreSQLさえ有れば動作する為、設置も比較的簡単で、
機能も一人で使う際に必要なものだけを備えている為、シンプルな事が特徴だ。

Holloを作る事になった経緯は少し複雑だ。
実はFedifyを作る事になったきっかけがHolloだと言える。
Holloの様な自分専用のActivityPubサーバーを作り始めた事で、
ActivityPubサーバーフレームワークの必要性を実感する事になった為だ。
但し、その時最初に作ろうとしたプロジェクトのコードはHolloには再利用されず、
当時のプロジェクト名もHolloではなかった為、
厳密に言えばHolloがFedifyを作るきっかけになったとは言えない。
しかし、
Fedifyを作った後にこれを使って究極的に作りたかったものがHolloの様なものだった事は事実だ。

しかし、実際にFedifyを作ってみると、私が作りたいものはFedify自体となってしまい、
元々の動機は多少色あせてしまった。その為、Holloを本格的に作り始める頃には、
Fedifyのデモを作る事がHolloの最大の目的となっていた。実際、
Holloを作りながらFedifyに必要な機能を追加したり、バグを見つけて修正したりもした。
但し、あくまでもFedifyプロジェクトの一環だった為、
Hollo自体のコード品質はFedifyと比べるとかなり劣る。
この問題はHolloをFedifyプロジェクトの一環として見なくなった時点から改善を始めたが、
依然としてコード品質については改善すべき点が多く残っている。

Holloは予想外に日本でユーザー層が生まれ、公式文書を日本語に翻訳したり、
日本で開催された[オープンソースカンファレンス 二〇二四 Tokyo/Fall]というイベントに出展してブースを出したりもした。
この時、現地のHolloユーザーである[Esurio]さんがブースを一緒に運営してくれて、
大変お世話になった。

最近は[ドッグフーディング]の為に、私が持っていたMastodonアカウントを捨ててHolloに移行した。

[Hollo]: https://docs.hollo.social/ja/
[オープンソースカンファレンス 二〇二四 Tokyo/Fall]: https://event.ospn.jp/osc2024-fall/
[Esurio]: https://c.koliosky.com/@esurio1673
[ドッグフーディング]: https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%83%E3%82%B0%E3%83%95%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0


韓国フェディバース開発者の会
----------------------------

ある日ふと、
韓国にはフェディバースソフトウェアを開発する開発者達の交流がない事に気づいた。
そこで、[Neovim用Mastodonクライアント][5]を作った[<ruby>李在烈<rp>（</rp><rt>イ・ジェヨル</rt><rp>）</rp></ruby>](https://kodingwarrior.github.io/)さんに声をかけ、
共に[韓国フェディバース開発者の会]を発足させた。
先ず[Discordサーバー][6]を設置し、かなり多くの開発者が集まった。

そして定期的なスプリント会を企画し、
その[第一回目の会][7]を八月三一日に[リターンゼロ]のオフィスで開催したところ、
予想以上に多くの人々が参加した。この時に出会った人々とは、
今でもフェディバース上で交流を続けている。

最近は年末という事もあり、オフライン交流は少し減っているが、来年になればまた活発な活動を再開する予定だ。

[5]: https://github.com/kode-team/mastodon.nvim
[韓国フェディバース開発者の会]: https://fedidev.kr/
[6]: https://discord.gg/B2ABMBpHNA
[7]: https://sprints.fedidev.kr/posts/2024-08-31-sprint/
[リターンゼロ]: https://www.rtzr.ai/en


初めての同人誌販売
------------------

今年の秋から日本語圏のフェディバースで本格的な活動を始め、
その過程で日本のHolloユーザー達と交流する様になった。
その中で[Esurio]さんから、
日本で開催されるオープンソースカンファレンスにブース出展してみては如何かという提案を頂き、
悩んだ末に出展する事にした。
日本のイベントへの出展は勿論、ブース出展自体が初めての経験だった為、
Esurioさんには様々な面でお世話になった。この場を借りて感謝の意を表したいと思う。

とにかく、ブースを出展する事になったからには何か展示品が必要だった。
その一環として、
Fedifyのチュートリアル<q>[自分だけのフェディバースのマイクロブログを作ろう！]</q>を紙の本として印刷して販売する事にした。
幸い、作って持っていった本は殆ど売れ、帰りは随分と軽く帰る事が出来た。
この時に本を買ってくれた方々の中の一人である[モナコ広告]さんが、
チュートリアルを実践してみた過程を[FediLUG]
勉強会で<q>[FedifyでActivityPubサーバを作ってみた]</q>という題目で発表してくれた。

必ずしも本を買ってくれた方々だけでなく、
不十分な日本語ながらも手探りで交流が出来て良かった。

[自分だけのフェディバースのマイクロブログを作ろう！]: https://github.com/dahlia/fedify-microblog-tutorial-ja
[モナコ広告]: https://monaco.every-little.com/
[FediLUG]: https://fedilug.y-zu.org/
[FedifyでActivityPubサーバを作ってみた]: https://www.docswell.com/s/monaco_koukoku/5DN28R-fedilug05-20241123


専業フェディバース開発
----------------------

何だかんだあって年初には全く予想していなかった方向へ流れ、
一種の<q>専業フェディバース開発者</q>となった状況だが、
来年はフェディバース自体の裾野を広げる事に力を注いでみる予定だ。
その一環として、
ソフトウェアエンジニア達の為のActivityPub基盤のソーシャルプラットフォームを作ってみているが、
近々公開出来る様にしたいと思う。
