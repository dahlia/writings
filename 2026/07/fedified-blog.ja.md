---
published: 2026-07-16T01:00:00+09:00
---

ブログにActivityPub連携を追加した
=================================

[自作の静的サイトジェネレーターJikjiでこのブログを作ってから][1]、
もう五年近く経つ。当時の私はTypeScriptにも最新のウェブ技術にもまだ慣れておらず、
[ActivityPub]を実装したこともなかった。しかし今ではTypeScriptにも
最新のウェブ技術にも比較的慣れ、ActivityPubは私にとって重要な技術になった。
しかも曲がりなりにも[Fedify]のメンテナーでありながら、
肝心のブログが連合していないことが、ずっと気になっていた。
そこでブログにActivityPub連携を追加することにした。

[1]: https://writings.hongminhee.org/2021/12/new-blog/
[Fedify]: https://fedify.dev/
[ActivityPub]: https://www.w3.org/TR/activitypub/


既存スタック: Jikji + PHP
-------------------------

このブログはもともと、自作のDeno製静的サイトジェネレーター[Jikji]を
ベースにしていた。厳密には静的サイトとは言い切れず、
昔の[Movable Type]がそうだったように、単にHTMLを生成するだけでなく
PHPの一部も生成していたからだ。PHPは主にHTTPの
[コンテンツネゴシエーション][]に使っていた。ブラウザの[`Accept-Language`]
ヘッダーを見て、漢字ハングル混じり文の朝鮮語、ハングル専用の韓国語、
英語、日本語のうち適切な言語を表示していた。それだけのことではあるが。

すでにPHPを使っているのだから、PHPで薄くActivityPubを実装することも
一応検討した。しかしPHPを使っているといっても、自分の手で書いたコードでは
なくJikjiが生成してくれるものだったから使っていただけで、PHPを手作業で
書きたいとは思わなかった。新しい記事が公開されたら自動で`Create(Article)`
アクティビティをフォロワーに配送しなければならないが、そのためにはどのみち
メッセージキューのような仕組みが必要になる。PHPにメッセージキューまで
組み合わせるとなると、私見では、PHPに見合う規模と複雑さを超えてしまう
気がした。そして何より、Fedifyがあるのに、わざわざゼロからActivityPubを
実装したくはなかった。

そこでPHPを丸ごと取り除き、Fedifyを組み込むことに決めた。

[Jikji]: https://github.com/dahlia/jikji
[Movable Type]: https://movabletype.org/
[コンテンツネゴシエーション]: https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/Content_negotiation
[`Accept-Language`]: https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Headers/Accept-Language


新スタック: Astro + Netlify
---------------------------

まず最初の選択として、JikjiとPHPを捨て、静的なコンテンツを中心にした
ウェブサイトづくりに特化したJavaScriptフレームワーク[Astro]を採用する
ことにした。すでに[@fedify/astro]という連携パッケージが存在していたことも、
Astroを選んだ大きな理由だった。

ただし、既存のCSSやHTMLテンプレートはできる限り再利用した。今のウェブ
デザインに満足していたし、デザインの刷新まで手を出すと範囲が大きくなり
すぎる気がした。パーマリンクも完全にそのまま維持した。全体として、
訪問者が何が変わったのか気付かないくらい表面を保ちながら、技術スタック
だけを移行するのが目標だった。

デプロイ先はCloudflare WorkersとNetlifyの間で迷ったが、Fedifyをまだ
Netlifyで動かしたことがなかったので、これを機にFedifyのNetlifyサポートを
追加することにした。静的サイトのホスティングでNetlifyは何度も使ってきたが、
エッジ関数を併用するのは今回が初めてだった。基本的には静的なアセット群で
ありながら一部の機能だけが動的に動く、という発想は、九十年代末にウェブ
サイトを作る際、CGIスクリプトだけを`/cgi-bin/`ディレクトリに置いていた
やり方を思い出させた。

以前はブログ記事をMarkdownファイルとして保存してGitにコミットし、
プッシュするとGitHub Actionsが静的サイトをビルドしてからSFTPでデプロイ
する、という流れだった。今ではGitHub Actionsをビルドパイプラインから
外せるようになった。Netlifyが勝手にビルドしてくれるからだ。結果として、
より単純になった。

Astroにはおおむね満足しており、移行も比較的スムーズだった。五年前に
作ってからほとんど更新していなかったJikjiより優れているのは当然のことだ。
Jikjiはもう保守する理由がなくなったので、リポジトリをアーカイブした。

[Astro]: https://astro.build/
[@fedify/astro]: https://fedify.dev/manual/integration#astro


AstroにFedifyを組み込む
-----------------------

### @fedify/astroの最新化

ところがいざAstroにFedifyを組み込もうとすると、@fedify/astroが最新版の
Astro 7に対応していなかった。内部で使っているAstroのAPI自体はそれほど
変わっていなかったが、パッケージに明記された対応範囲とテストはAstro 5
までしかカバーしていなかった。結局、ブログにFedifyを組み込む前に、
まず@fedify/astroを直す必要があった。

単にパッケージのバージョン範囲を広げただけではない。既存のテストは偽の
Astroコンテキストを作ってミドルウェアを直接呼び出すものだったので、
ViteのSSR設定やアダプター間の互換性、ビルド後のサーバーにおけるリクエスト
のルーティングといった問題は検出できなかった。そこでFedifyパッケージを
実際にパックして小さなAstroアプリケーションにインストールし、サーバーを
ビルドして起動したうえでHTTPリクエストまで送る、という互換性テストを
新たに作った。

このテストは、Astro 5、6、7それぞれで、HTMLリクエストがAstroのページに
渡るか、ActivityPubとWebFingerのリクエストをFedifyが処理するか、それ以外
のパスではAstroの`404 Not Found`レスポンスが維持されるか、といった点を
確認する。Astro 7についてはNode.jsだけでなくDenoとBunでもビルドを
試すようにした。

[この作業][2]はすでにアップストリームにマージされており、Fedify 2.4.0に
含まれる予定だ。

[2]: https://github.com/fedify-dev/fedify/pull/936

### 静的ページと動的エンドポイント

Astroプロジェクト全体はサーバー出力としてビルドしつつ、既存のブログページ
はこれまで通りプリレンダリングするようにした。一方、WebFingerやアクター、
インボックス、アウトボックス、フォロワーコレクション、ActivityPubオブジェクト
のパスは、リクエストを受けた時点でFedifyが動的に処理する。@fedify/astroが
提供するミドルウェアはリクエストのURLと`Accept`ヘッダーを見て、Fedifyが
処理すべきリクエストだけを横取りする。同じURLでも、HTMLをリクエストすれば
既存のAstroページが返り、ActivityPub表現をリクエストすればFedifyが作った
オブジェクトが返ることもある。

結果として、訪問者が目にするブログは依然として静的サイトに近い。新しく
加わった動的な部分は、ほとんどがフェディバースの他のサーバーだけがアクセス
する場所にある。先ほどCGIを思い出したのも、この構成のせいだ。

### `Person`と`Article`

ActivityPubを組み込むにあたっては、このブログで何をアクターとし、何を
オブジェクトとするかも決めなければならなかった。ブログのアクターには
[`Person`]タイプを選んだ。実際の公開作業はプログラムが自動でやってくれるが、
アクターが表しているのはブログのソフトウェアやサービスではなく、
この文章を書いている私自身だからだ。そのためハンドルは
`@hongminhee@writings.hongminhee.org`で、アクターのウェブURLはこのブログを
指している。

各ブログ記事には[`Article`]タイプを選んだ。タイトルと本文があり、独立した
パーマリンクを持つ長文の文書だから、`Note`よりも意味的にしっくりくると
考えた。幸い、Mastodonをはじめとする主要なActivityPub実装の大半も
`Article`をサポートしている。人間が読む既存のパーマリンクはそのままにしつつ、
ActivityPubオブジェクトには`/ap/articles/{year}/{month}/{slug}`という形の
別のURIを与えた。`Article`の`url`は、あらためて既存のパーマリンクを指す。
ActivityPubオブジェクトのURIと、人間が読むウェブページのパーマリンクを、
はっきり分けたわけだ。

多言語対応は、もう少し悩んだところだ。言語ごとのページをそれぞれ別の
`Article`オブジェクトとして表現すると、同じ記事に対する反応やシェアが
複数のオブジェクトに分散してしまう。そこで、同じパーマリンクに属する
漢字ハングル混じり文の朝鮮語︵`ko-Kore`︶、ハングル専用の韓国語
︵`ko-Hang-KR`︶、英語︵`en`︶、日本語︵`ja`︶の各バージョンを、一つの
`Article`にまとめることにした。タイトルと概要、本文には、それぞれ言語タグ
の付いた値をすべて入れてある。JSON-LDでシリアライズすると、それぞれ
`nameMap`、`summaryMap`、`contentMap`として表現される。言語別の値を
処理しない実装のために、`name`、`summary`、`content`にはデフォルト言語
の値も併せて入れた。英語版があれば英語を、なければ漢字ハングル混じり文の
朝鮮語をデフォルトとした。言語別のHTMLページは、`Article`の`url`にも
`hreflang`属性の付いた`Link`オブジェクトとして加えてある。

こうしておけば、受信側のサーバーが多言語の値を理解できる場合は利用者の
言語に合ったタイトルと本文を選べるし、そうでなくてもデフォルト値は表示
できる。もっとも、私が知る限りほぼすべてのActivityPub実装は、こうした
多言語の自然言語値をまだきちんと表示できていない。
[Mastodonのイシュートラッカーにはこのためのイシューが立てられているし][mastodon/mastodon#11013]、
[Hackers' Pubのイシュートラッカーにも似たような提案があるが][hackers-pub/hackerspub#330]、
実装される見込みはまだ立っていない。おそらくUIデザインの面でも検討が
必要になるだろう。

[`Person`]: https://www.w3.org/TR/activitystreams-vocabulary/#dfn-person
[`Article`]: https://www.w3.org/TR/activitystreams-vocabulary/#dfn-article
[mastodon/mastodon#11013]: https://github.com/mastodon/mastodon/issues/11013
[hackers-pub/hackerspub#330]: https://github.com/hackers-pub/hackerspub/issues/330


FedifyをNetlifyで動かす
-----------------------

静的ファイルだけをデプロイするのと違い、ActivityPubサーバーにはデプロイ
が終わった後も残っていなければならない状態がある。まず、アクターの署名鍵
はデプロイのたびに変わってはならない。フォロワーの一覧も、次のデプロイで
消えてしまっては困る。この二つは[Netlify Database]に保存した。

インボックスで受け取ったアクティビティと、リモートサーバーに送る
アクティビティは、[Async Workloads]で作ったメッセージキューの中で処理する。
アクティビティの配送は相手サーバーの状態次第で遅くなったり失敗したり
しうるので、HTTPリクエストを受けた関数の中ですべて終わらせようとしては
いけない。キューに入れておけば、リクエストの受付と配送を切り離せるし、
失敗した処理も後で再試行できる。幸い[Fedifyはこうした処理をあらかじめ
抽象化してくれていて][3]、バックエンドのアダプターも拡張できるように
なっている。ただ、NetlifyのAsync Workloads向けのアダプターはまだなかった
ので、FedifyがAsync Workloadsをメッセージキューとして使いながら、
Netlify Databaseに配送順序の状態を保存できるよう、
[@fedify/netlifyというパッケージも作った。][4]

新しい記事をフェディバース︵fediverse︶に知らせるのは、また別の問題
だった。静的サイトのビルドが終わったからといって、実行中のActivityPub
サーバーがどの記事に変化があったのか自動的に分かるわけではない。そこで、
本番環境へのデプロイが成功すると、前回のデプロイと今回のデプロイとで
記事一覧を比較する。新しく追加された記事には`Create(Article)`、内容や
更新日時が変わった記事には`Update(Article)`、削除された記事には
`Delete(Article)`アクティビティを作ってフォロワーに送る。再試行しても
同じ変更には同じアクティビティIDを使い、より古いデプロイが後から同期
されて最新の状態を巻き戻してしまわないよう、デプロイの順序も確認する。

Netlifyにはデプロイプレビュー︵deploy preview︶とブランチデプロイ
︵branch deploy︶という機能があるが、これらの場合は連合機能を丸ごと
無効にした。プレビューのたびに同じブログを名乗るアクターが増えたり、
テスト用のデプロイが実際のフォロワーにアクティビティを送ってしまったり
すると困るからだ。ローカルではインメモリのストレージとキューで開発でき、
本番環境でのみ永続的なデータベースとキューを使う。

ともあれ、そのおかげでFedifyは今やDeno DeployやCloudflare Workersに
加えて、Netlify Functionsもサポートするようになった。もちろん、Node.js、
Deno、Bunで動くのは相変わらず基本だ。

[Netlify Database]: https://docs.netlify.com/build/data-and-storage/netlify-database/
[Async Workloads]: https://docs.netlify.com/build/async-workloads/get-started/
[3]: https://fedify.dev/manual/mq
[4]: https://github.com/fedify-dev/fedify/pull/934


おわりに
--------

今回の作業で、ブログにタイムラインや返信作成画面のようなソーシャル機能が
付いたわけではない。文章を書いて読むやり方も、既存のパーマリンクやデザイン
も、ほとんどそのままだ。ただ、このブログと各記事には、フェディバースで
通用する名前と住所ができた。読者は`@hongminhee@writings.hongminhee.org`
をフォローして新しい記事を受け取れるし、各記事のActivityPubオブジェクトの
URIを検索して元の文章にたどり着くこともできる。

Fedifyを保守しながら、他の開発者にActivityPubを実装する手段を提供して
きたし、[Hollo]や[Hackers' Pub]などを作りながらドッグフーディングも
それなりにやってきたが、すでに運用中のウェブサイト、それも静的なページで
できていたブログにFedifyを組み込むのは今回が初めてだった。おかげで
Astroインテグレーションの互換性テストとNetlifyサポートを追加することに
なったし、ドキュメントや単体テストを見ただけでは分からないデプロイや
運用上の問題にも直面した。Fedifyがソーシャルネットワークを新しく作る
ためだけに使われるのではなく、すでに存在するウェブサイトが自分の姿を
保ったままフェディバースに参加するためにも使えることを、確認できた。

[Hollo]: https://docs.hollo.social/ja/
[Hackers' Pub]: https://hackers.pub/
[ドッグフーディング]: https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%83%E3%82%B0%E3%83%95%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0
