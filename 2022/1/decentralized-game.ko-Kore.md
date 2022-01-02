---
published: 2022-01-02T16:50:00+09:00
reads:
  腳光: 각광
  類: 류
---
脫中央 게임, 그리고 블록체인과 NFT
==================================

2018年 여름 5年 넘게 일했던 스포카에서 나와 플라네타리움으로 옮긴 以來,
흔히 "블록체인 게임"이라고 불리는 脫中央 게임을 만드는 프로젝트에 몸담은 지
벌써 5年째를 맞이하게 됐다.

그 동안 여러 이슈를 마주하며 생각이 달라진 部分도 있지만,
脫中央 게임의 價値에 對해서는 크게 생각이 바뀌진 않고,
오히려 精巧해진 것 같다.  그러나 같은 비전 아래 나아가는 팀 안에서도
저마다 크고 작은 생각의 差異가 있기 마련이고,
나도 팀과는 獨自的으로 나름의 생각을 글로 다듬어 보려 한다.

以下의 모든 拙見은 내 멋대로의 생각일 뿐,
내가 屬한 會社 및 同僚들의 立場과 獨立的라는 點을 밝혀둔다.

*[NFT]: non-fungible token


온라인 멀티플레이어 게임의 中央集中 거버넌스 問題
-------------------------------------------------

個人的으로는 게임을 脫中央化할 必要가 없을 때가 많다고 보지만,
그럼에도 몇몇 장르의 온라인 멀티플레이어 게임에서 價値가 있다고 생각하는데,
왜냐하면 온라인 게임 運營社는 一般的으로 게임 플레이어와 利害가 不一致하거나
對立하기 때문이다.  플레이어들이 糾彈하는 게임 運營社의 橫暴는 多樣하다.
甚한 課金 誘導, 플레이어들의 바람과는 相反되는 업데이트 方向,
告示된 아이템 獲得 確率이 實際 具顯과 다른 것 같다는 疑惑, 갑작스러운 섭終 等.

플레이어들이 겪는 이러한 어려움을 說明하는 몇 가지 觀點이 있을 수 있는데,
그 中 하나는 온라인 게임 서비스 各各이 그 안에서는 不公正 獨占 市場을
形成한다는 認識이다.  어째서 플레이어들은 事實上 꽝뿐인 아이템 팩,
卽 低品質의 財貨를 그 價格에 強買하게 될까?
다른 品質의 아이템 팩을 다른 價格에 파는 사람이 없고,
오직 게임 運營社만이 그 販賣權을 獨占하고 있기 때문이다.
이는 Apple의 앱 스토어가 獨占的 地位로 여러 不合理한 去來를 消費者에게 強要하는
것과 비슷하다.  온라인 게임 첫 世代부터 運營社의 그러한 獨占을 우리가 承認해
왔다 보니 그런 地位를 내려놓으라는 運營社에 向한 要求가 生疏할 뿐이다.[^1]

게다가 많은 時間과 돈을 써서 얻은 게임 내의 모든 것은 運營社가 恣意的으로
서비스를 그만두면 그 卽時 물거품이 된다.
싱글 플레이어 게임이라면 남이 맘대로 내 세이브 파일과 게임 패키지를 통째로
없앨 수도 있는 리스크가 있는 것이다.
멀티플레이어 온라인 게임은 시간만 쓰는 게 아니라 돈도 쓰는 境遇가 많은데다,
큰 會社의 大作이 아니라면 서비스가 5年 넘게 運營되는 境遇가 흔치 않으므로
더 리스크가 무겁다.

위와 같은 點들을 따져보면 온라인 멀티플레이어 게임들은 싱글 플레이어 게임들에
比해 훨씬 消費者 保護 水準이 떨어진다는 問題意識에 이른다.
이런 差異는 싱글 플레이어 게임은 製作社 손을 떠나 消費者가 購買한 以後로는
게임을 즐기는 사람이 스스로의 器機에서 實行하는 反面, 멀티플레이어 게임은
게임을 즐기는 것과 運營 및 實行하는 것이 다른 主體에 依해 이뤄지고
그 둘 사이의 利害得失이 서로 干涉하기에 생기는 게 아닌가 싶다.

이러한 視角에서, 온라인 멀티플레이어 게임의 運營 거버넌스를 脫中央化하여
위와 같은 問題들을 緩和할 수 있을 거라는 期待를 갖고 있다.

[^1]: 甚至於 게임 運營社가 아닌 플레이어조차, 그러한 不均衡까지 게임의 룰로
      內面化한 나머지 "아이템도 못 팔 거면 게임社가 게임을 왜 만들어야
      하는데?"라고 되묻기까지 한다.  獨占權을 내려놓는다고 販賣權이 아예
      사라지는 것이 아님에도, 運營社가 現在의 獨占權 없이는 온라인 멀티플레이어
      게임을 안 만드느니만 못한다는 생각으로 널뛰는 것이다.

*[섭終]: 서비스 終了


脫中央 게임의 具顯 手段으로서의 블록체인
----------------------------------------

現在 "脫中央 게임"과 "블록체인 게임"은 거의 같은 말로 쓰이고 있다.
요즘에는 "NFT 게임"이라는 말로 더 많이 불리는 것 같기도 하다.
그렇지만 私見으로는 이 말들을 區別해서 쓰고 싶고,
적어도 이 글에서는 그러고자 한다.

"脫中央 게임"이라는 것은 멀티플레이어 게임의 거버넌스에 關한 말로,
이는 여러 層位에서 多樣한 方式으로 이뤄질 수 있다.
따라서 脫中央 게임과 中央集中 게임 사이에 뚜렷한 區分線이 있다기 보다는
程度의 問題에 가까울 것이다.
이를테면 게임의 클라이언트와 서버를 모두 오픈 소스로 配布한다면,
그것만으로 相當한 水準의 脫中央化를 이룰 수 있다.
게임이 마음에 안 들면 마음에 들게 고쳐서 再配布할 수 있기 때문이다.[^2]

그렇지만 게임의 소프트웨어 部分뿐만 아니라,
運營되는 게임 內 世界까지 脫中央化하고 싶을 수 있다.
같은 게임을 서비스하는 主體가 여럿 있을 수 있다고 해도,
내가 고른 運營 主體가 멋대로 데이터베이스에 손을 대거나 今方 서비스를
終了하지 않을 거라는 保障이 없기 때문이다.
이런 要求는 오픈 소스만으로는 達成할 수 없는데, 이를 爲해 블록체인이 쓰인다.
(또는, 그런 名目으로 블록체인을 導入한다.)

"블록체인 게임"은 게임의 具顯 細部事項으로,
그 自體로는 플레이어 立場에서 좀더 價値 中立的이다.
現在 게임을 블록체인으로 만들었을 때의 利點으로는
主로 둘 程度를 꼽을 수 있겠는데, 하나는 앞서 말한 運營의 脫中央化이고,
다른 하나는 相對的으로 初期 開發費를 募金하기 쉽다는 것이다.
募金에 關해서는 나중에 따로 다루기로 하고,
그렇다면 블록체인은 具體的으로 어떻게 運營을 脫中央化한다는 것일까?

이를 드러내려면 먼저 블록체인이 [P2P 네트워크]를 前提한다는
點을 짚고 넘어가야 할 듯하다.  블록체인의 脫中央 거버넌스는 基本的으로
P2P 네트워크의 脫中央 거버넌스에 바탕하기 때문이다.
P2P 네트워크가 脫中央化되어 있다는 것은,
現實 世界에서 가장 널리 쓰이는 P2P 네트워크인 [비트토렌트]를
어느 한 主體가 任意로 멈추게 할 수 없다는 것으로 보여줄 수 있다.
비트토렌트 네트워크는 한두 主體의 談合으로 멈출 수 없을 뿐만 아니라,
언젠가 누구도 쓰지 않게 되어 정말로 멈추더라도 以後 언제든 다시 누군가
두 사람이라도 비트토렌트 소프트웨어를 켜면 다시 굴러가게 할 수 있다.

그렇다면 멀티플레이어 게임을 P2P로 具顯하는 것으로 脫中央化를 꾀하면 어떨까?
實은 P2P 멀티플레이어 게임은 이미 오래 前부터 우리에게 익숙하다.
이를테면 《스타크래프트》의 멀티플레이 手段으로는 (製作運營社인 블리자드의
獨占 中央集中 서비스인 배틀넷 말고도) IPX를 쓸 수 있었고,
實際로 많이 썼다.[^3]  그렇지만 이런 式의 IPX 멀티플레이는
大體로 房을 연 사람이 서버 役割을 하게 되어 있어서,
나머지가 그 房에 들어가는 式으로 主客의 區分이 存在했다.
많은 IPX 멀티플레이는 단 둘이서 즐길 때만 P2P처럼 動作했다.
게다가 모든 노드가 正直하고 소프트웨어的 造作이 없다고 假定하기 때문에
맵핵 等의 不正行爲에 脆弱했다.
이런 脆弱性은 不正行爲의 效果가 30分 남짓의 한 판 안에서만 作用하는 《스타》
같은 장르의 게임에서는 無視해도 그만이지만,
《울티마 온라인》처럼 판의 段落 없이 큰 單一 世界가 繼續 이어지는 種類의
게임에서는 그런 不正行爲를 못 본 척 할 수는 없다.

그러므로 世界가 繼續되는 種類의 멀티플레이어 게임을 비트토렌트처럼 P2P로
具顯하면 脫中央化는 이룰 수 있지만 保安이 脆弱해지게 된다.
그런 게임에 限해 中央에서 介入하는 運營 主體를 導入하지 않고서
保安을 確保하는 手段이 블록체인이라고 할 수 있다.
거꾸로 얘기하면, 脫中央 거버넌스와 그런 水準의 保安이 함께 必要한
게임이 아니라면 굳이 블록체인까지 導入하지 않아도 된다는 뜻이기도 하다.
脫中央化만 必要하다면 P2P 네트워크 위에서 돌게만 해도 達成할 수 있고,
或은 不正行爲만 막으면 된다면 信用할 特別 地位의 中間者를 두는 것으로도
훨씬 쉽게 막을 수 있기 때문이다.
게다가  《스타》나 《퀘이크》처럼 플레이어의 操作 熟練度가 勝敗에 主要한
게임은 於此彼 入力器機 水準에서 不正行爲가 可能하기 때문에[^4]
블록체인으로 保安이 크게 나아지지도 않는다.

블록체인이 技術的으로 保障하는 것은 게임에서도 如前하다.
블록체인 네트워크의 노드가 느슨한 時間的 誤差 內에서
같은 狀態(데이터라고 말해도 좋다)를 가질 수 있게 하고,
狀態 轉移(데이터 更新이라고 말해도 좋다)가 모든 노드에게 一貫되게 適用되는
規則과 權限 안에서만 (다시 말해 반달리즘 걱정 없이) 이뤄지도록 하며,
이 모든 것이 어떤 特別한 地位에 있는 主體 없이 돌아가도록 해준다.
그러니까 블록체인의 이러한 性質은 揮發性 데이터나 各自의 사적 데이터가 아니라
公共의 永續 데이터를 主로 다루는 소프트웨어에서나 意味가 있는데다,
그 소프트웨어가 반드시 脫中央 거버넌스를 갖춰야 하는 境遇가 아니라면
誤濫用일 뿐이다.  그리고 비디오 게임도 소프트웨어이므로 같은 判斷을 할 수 있다.

[^2]: 이러한 趣旨에서, 플라네타리움의 첫 게임 《[나인 크로니클]》은
      아트워크까지 모두 [AGPL 3.0]으로 排布되고 있고,
      實際로 人氣 있는 다른 포크 프로젝트도 있다.
[^3]: 90年代 末에는 PC房에 다같이 몰려가서 IPX로 《스타》 멀티플레이를 하는
      일이 흔했다.  《스타》 뿐만 아니라 當時 멀티플레이가 可能했던 게임
      大部分은 IPX 方式을 活用했고, 오히려 배틀넷 같은 獨占 서비스 方式은
      더 나중에 大眾化됐다.
[^4]: 요즘에는 FPS 게임 《[PUBG: 배틀그라운드]》에서 低熟練者도 겨냥을 쉽게
      할 수 있도록 도와주는 一名 "배그 핵 마우스" 따위도 市中에 나와 있다.

*[P2P]: peer-to-peer
*[IPX]: internetwork packet exchange
*[FPS]: first-person shooter

[P2P 네트워크]: https://ko.wikipedia.org/wiki/P2P
[비트토렌트]: https://www.bittorrent.org/
[나인 크로니클]: https://nine-chronicles.com/
[AGPL 3.0]: https://www.gnu.org/licenses/agpl-3.0.html
[PUBG: 배틀그라운드]: https://battlegrounds.pubg.com/


無分別한 블록체인 導入
----------------------

그러나 이른바 "블록체인 게임" 業界에 몸담고 있으면 블록체인을 導入할 何等의
理由가 없는 곳에 블록체인을 굳이 어거지로 끼워넣는 事例를 자주 듣고 보게 된다.
率直히 말해 그런 事例가 그렇지 않은 事例보다 훨씬 많을 程度인 마당에,
블록체인 業界에 對한 不信과 폰지 詐欺가 아니냐는 疑心에는 아무리 抑鬱해도
어쩔 수가 없다고 느낀다.

블록체인이 쓸모가 있는 게임이라고 해도, 정작 導入을 제대로 하지 않고서
"블록체인 게임"이라는 레테르만 붙이는 프로젝트도 정말 많다.
그 中 代表的인 것이 요즘 흔히 "NFT 게임"이라고 불리는 것들이다.

이름만 놓고 생각하면 "NFT 게임"은 게임 內에서 쓰일 수 있는 아이템들을
블록체인上의 NFT로 發行하면 그렇게 부를 수 있는 것 같지만,
實狀을 살펴보면 意外로 게임에서 블록체인을 아예 쓰지 않고 아이템만 블록체인
NFT로 發行하는 境遇가 많다.  게임 運營이 如前히 私企業에 依해 獨占的으로
이뤄지고 있는데 아이템만 블록체인 NFT로 다루면 어떤 利點이 있는 것일까?

가장 자주 꼽히는 것은 바로 아이템을 게임 밖 市場에서 去來할 수 있다는 것이다.
그렇지만 아무래도 都統 모르겠는 것은 그게 從來의 [아이템베이]와 무엇이
다르냐는 것이다.  運營社가 直接 手數料 장사를 할 수 있다는 點(이건
플레이어에게는 딱히 도움되진 않는다)이나 훨씬 높은 價格에서 去來가 形成된다는
點이 다른 것일까?  그냥 아이템 去來所를 RDBMS 基盤의 웹 서비스로
具顯하면 안 되는 것일까?

그러한 疑問에 對한 가장 흔한 答은, NFT는 블록체인 위에 記錄되므로 變造나
複製가 不可能할 뿐만 아니라 事實上 永續的이라는 正當化다.
이는 一見 理致에 닿아 있는 이야기지만, 어디까지나 發行된 NFT 自體에만
適用되는 이야기여서, NFT가 가리키는 實際 게임 內 아이템에까지 保障되는 性質은
아니라는 虛點도 함께 짚고 넘어가야 한다.  世間에 NFT라 불리는 것들이 그렇지만,
NFT 그 自體는 一種의 領收證 乃至는 證券처럼 NFT가 가리키는 對象物과는
따로 떨어져 있다.  獨占 運營社가 발급한 NFT 아이템은 게임이 섭終됐을 때
어디에 쓸 것인가?  섭終까지 가지 않더라도, NFT가 가리키는 아이템은 於此彼
運營社의 게임 서버 데이터베이스에 들어있는데, 그 데이터베이스를 造作하지
않으라는 保障은 어떻게 할 것인가?  우리는 그 運營社가 그러지 않을 것이라고
信賴해야 하는데, 그 時點에서 아이템을 NFT로 發行한 趣旨는 褪色되어 버린다.
豆腐처럼 쉽게 부서지는 것을 사면서,
領收證만 鋼鐵로 만들면 그게 무슨 所用인가?[^5]

獨占的으로 運營되는 온라인 게임에서 아이템만 블록체인 NFT로 파는 方式은
블록체인 要素 없이 運營 主體의 서버에 모든 것을 다 두는 從來의 方式에 比해
複雜度와 具顯 難度가 잔뜩 올라가기 때문에,
굳이 그렇게 해야만 하는 必要性이 있어야 한다.
拙見으로는, 그러한 合理的 必要性은 적어도 게임 內的으로는 찾을 수 없고,
아마도 "NFT"나 "블록체인" 같은 키워드가 붙어야 프로젝트의 株價가 크게 오르기
때문에 그러한 複雜性을 勘收하는 것으로 여겨진다.

[^5]: 한便, 最近 NFT 熱風의 中心에는 NFT 디지털 아트가 놓여 있는데,
      이를 두고 一角에서는 사람들이 디지털 아트를 實題로 손에 쥐고 싶은 게
      아니라 (디지털 아트라 그럴 수도 없지만) 아티스트가 作品과 NFT를 所有한
      自身의 關係를 公認해줬으면 하는 마음이나 그걸 사람들 앞에서 보이고 싶은
      誇示慾, 내가 그 아티스트에 後援했다는 滿足感 같은 것을 NFT가 채워준다고
      이야기하기도 한다.  萬若 그러한 說明이 정말이라면 NFT 디지털 아트의
      熱風은 오프라인 展示와 販賣가 어려워진 코로나19 時局이기 때문에 眞品
      保證書 代用으로 腳光 받고 있는 걸지도 모른다.
      어찌되었든 디지털 아트에는 適用 可能한 說明일지 몰라도,
      게임 아이템에까지 擴張될 수 있는 說明은 아닌 듯하다.

*[RDBMS]: relational database management system

[아이템베이]: https://itembay.com/


바람직한 블록체인 게임
----------------------

글이 꽤나 여러 곳을 건들며 돌아다녔는데,
그렇다면 블록체인 게임은 어떠해야 할까?
몇 해 동안 씨름하며 切實하게 느낀 바는,
맨 처음 가장 重要한 것은 블록체인이나 NFT가 必要 없는 게임에
블록체인을 억지로 끼워 넣으려고 하지 말아야 한다는 것이다.
블록체인은 게임을 全的으로 脫中央化할 動機가 없다면 導入할 까닭이 없다.
脫中央 게임을 만든다고 해도,
많은 境遇는 블록체인 없이 소프트웨어 全般을 오픈 소스로 配布하고 P2P 네트워크를
導入하는 것만으로 相當한 水準의 脫中央化를 이룰 수 있다.
게다가 블록체인은 技術的 制弱도 커서, 레이턴시가 짧아야 하는 게임에서는 無理다.
그럼에도 억지스럽게 블록체인을 끼워 넣는 프로젝트는 꾸준히 나타나는데,
이런 意思決定은 大體로 블록체인 技術의 特性과 限界도 모르고 具顯 難度도
把握하지 못하는 經營陣의 上命下達로 이뤄진다는 心證이 있다.

블록체인이 有用할 수 있는 게임이라면, 블록체인 導入을 하더라도 綜合的 디자인이
블록체인의 用途를 無色케 하지 않도록 꼼꼼히 信經써야 한다.
기껏 게임에 블록체인을 導入해놓고 重要한 컴포넌트를 中央化하면 (專門用語로
[오라클]을 두게 되면) 特定 主體를 向한 信賴에 依存하게 되는데,
全體 시스템에서 信賴에 依存하는 部分이 조금만 많아져도 脫中央
거버넌스는 쉽게 脆弱해진다.
블록체인은 信賴에 依存하지 않기 爲한 몸부림 같은 것인데,
그럴 거면 블록체인이 없는 게 效率的이지 않겠는가?

블록체인이 제 機能을 하려면 結局 게임 플레이에 必須的인
로직과 데이터는 모두 블록체인 위에 놓여야 한다.
아이템이나 게임 머니만 블록체인에 올리면 게임 自體가 오라클이 되어버린다.
(大部分의 플레이어는 칼이 NFT로 發行됐어도 게임 월드 內에서
휘두룰 수 없다면 쓸모가 없다고 여길 것이다.)
그런데 그러자니 블록체인 게임은 만들기도 성가시고, 性能도 떨어진다.
그렇기에 그런 逆機能을 勘收하고도 블록체인만의 機能인 脫中央 거버넌스를
熱望하는 프로젝트에서만 블록체인 導入이 意味가 있다.

블록체인을 原則대로 게임에 適用하더라도,
게임이 脫中央 거버넌스와 어울리는지 亦是 따져봐야 한다.
現在 블록체인의 가장 큰 技術的 限界는 레이턴시가 從來의
方式과는 比較하기 어려울 만큼 길다는 것이다.
從來의 온라인 게임에서 技術 妥當性을 檢討할 때 네트워크 레이턴시의
具體的 許容 範圍는 밀리秒 單位를 넘어가지 않는다.
하지만 블록체인은 빨라봐야 秒 單位에서 움직인다.
이를 게임에서 活用하려면 기다림을 게임 디자인의 一部로서 곳곳에 받아들여야
한다.[^6]

또, 脫中央 게임은 업데이트도 簡單치 않다.
커뮤니티 피드백을 取捨選擇하여 닫힌 組織 안에서 發展 方向을 定할 수 있다면
빠르고 좋겠지만, 오픈 소스 프로젝트처럼 決定 自體를 열려있는 커뮤니티
안에서 合議를 通해 決定해야 하기 때문이다.
그래서 많은 블록체인 프로젝트들이 [BIP]니 [EIP]니 하는 꽤 複雜한 意思決定
體系를 갖추고 있고, 네트워크 프로토콜을 바꾸는 것은 改憲을 하는 것처럼
어렵고 가끔씩 일어나는 일로 認識된다.
그러다보니 些少한 變更은 모두 블록체인 위에서 데이터와 스마트 콘트랙트를
업데이트하는 것만으로 可能하도록 發展되어 가고 있다.

따라서 블록체인 게임도 업데이트를 자주 하지 않고도 게임의 新鮮함을
維持할 수 있도록 設計될 必要가 있다.
게임 로직의 많은 部分을 時間이 지남에 따라 調整될 수 있는 것으로 보기보다는,
웬만하면 永久的이거나 超長期的으로 그리고 全域的으로 作用될 적고 단단한
룰로 構成하고, 그 위에서 노는 플레이어들의 創發的인 相互作用이
그 自體로 즐길거리가 되어야 한다.
(말은 쉽지만 게임 디자인이 훨씬 어려워진다.)

나아가 콘텐츠를 週期的 업데이트를 通해 꾸준히 채워줘야 한다면
脫中央 거버넌스와는 兩立하기가 아주 어려워진다.
스토리를 包含한 콘텐츠는 規則 한 두 個를 고치는 것보다 公共 合議가 훨씬 어렵고
(새 惡役은 어떤 背景의 人物이어야 하는지를 어느 歲月에 커뮤니티에서
모여서 定한단 말인가), 結果的으로 特定 主體가 獨斷으로 새 콘텐츠의 方向과
디테일 모두를 만들어 내는 方法이 現實的이기 때문이다.[^7]

將來에는 새 콘텐츠의 方向과 디테일 모두를 民主的 節次에 따라 블록체인
위에서 할 수 있도록 高度化될 수도 있겠지만, 아직은 갈 길이 멀다.
게다가 그런 節次를 具顯하는 블록체인上의 프로그램이 게임 自體보다 複雜性이
아득히 높을 것으로 보여서, 私見으로는 배보다 배꼽이 크지 않은가 하는
悲觀的 展望이 있다.
個人的으로는 亦是 아예 콘텐츠 업데이트를 持續的으로 하지 않아도 플레이어들끼리의
創發性이 재미의 열쇠가 되는 쪽이 훨씬 깔끔한 디자인으로 여겨진다.

[^6]: 한 때 人氣 있던 [징가]類 [소셜 네트워크 게임]들이 썼던 裝置들을
      벤치마킹해 볼 수 있겠다.
[^7]: 내가 屬한 會社의 첫 게임 《[나인 크로니클]》도 이런 面에서 아쉬움이 많다.
      RPG의 特性上 單純한 舞臺만으로 재미가 成立되지 않고,
      플레이어들은 콘텐츠를 消耗하며 世界의 끝을 向해 좇아오기 때문에 새로운
      콘텐츠가 持續的으로 供給되어야 하기 때문이다.
      次期作은 創發的인 장르의 게임이 되었으면 좋겠다.

*[RPG]: role-playing game
*[BIP]: Bitcoin Improvement Proposals
*[EIP]: Ethereum Improvement Propsals

[오라클]: https://en.wikipedia.org/wiki/Blockchain_oracle#Concerns
[BIP]: https://github.com/bitcoin/bips
[EIP]: https://eips.ethereum.org/
[징가]: https://www.zynga.com/
[소셜 네트워크 게임]: https://ko.wikipedia.org/wiki/%EC%86%8C%EC%85%9C_%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC_%EA%B2%8C%EC%9E%84

## 마무리

내게 큰 多幸이라면, 플라네타리움은 完全한 脫中央 게임을 만들고자 모인 팀이라는
것이다.
게임을 全部 블록체인 위에 올려, 終局에 우리 開發팀이 모든 손을 놓더라도 게임을
즐기고 싶어하는 커뮤니티가 있다면 언제까지나 存續될 수 있는 脫中央 게임을
만드는 것이 우리 팀의 目標이다.
이 글에서 참지 못하고 冷笑的으로 쓴 部分들이 여럿 있지만,
이는 여태까지 한통속으로 싸잡혀 疑心의 눈길을 받곤 했던 經驗의 發露일 뿐이고,
事實 나 스스로는 이런 저런 말을 하기보다는 바람직한 블록체인 게임을 정말로
만들어내서 사람들에게 이런 게임도 있을 수 있다는 것을 提示하고 싶은 마음이
굴뚝같다.

긴 글을 마무리하자면, 아래와 같이 要約할 수 있을 것 같다.

 -  모든 게임이 脫中央化될 必要는 없으며,
    脫中央化는 여러 層位에서 多樣한 方式으로 追求할 수 있다.
 - 불록체인은 脫中央化를 이루기 爲한 여러 方法들 中 하나일 뿐이며,
   一旦 소프트웨어의 오픈 소스化나 P2P 네트워크 導入부터 하는 것만으로
   相當한 脫中央化를 이룰 수 있다.
     -  그럼에도 脫中央化 手段으로 블록체인이 必要한 장르가 있겠으나,
        私見으로 그 幅은 매우 狹小하다.
     -  블록체인을 導入해도 全體 시스템에서 特定 主體를 向한 信賴에 많이
        依存한다면 블록체인은 導入 안 하느니만 못하다.
        從來의 方式보다 技術的 制弱도 크고 만들기 성가시기 때문이다.
	 -  아이템만 NFT化해서 얻는 利得은 없다고 判斷되며,
        RDBMS를 써서 아이템 去來所를 構築하는 게 빠르고 效率的이다.
	 -  그럼에도 안 하느니만 못한 블록체인 導入을 하는 프로젝트가 안 그런
        프로젝트보다 많은데, 이는 底意가 疑心될 수밖에 없다.
        블록체인 業界가 스캠이나 폰지 詐欺 疑惑을 避할 수 없는 까닭이기도 하다.
 -  블록체인을 導入한다면 게임 플레이의 主要 로직과 데이터는
    모두 블록체인 위에서 돌아가야 한다.
     -  具顯하기 매우 성가시기 때문에,
        脫中央化에 熱情이 있지 않다면 블록체인 導入을 굳이 안 하는 게 낫다.
 -  블록체인의 特性이 게임 디자인에 浸透되어야 한다.
     - 긴 레이턴시를 게임의 一部로 녹여내야 한다.
     - 脫中央 거버넌스를 害치지 않도록 留意해야 한다.
       꾸준한 콘텐츠 업데이트가 必要한 장르는 애初부터 脫中央化와 兩立되기
       어려울 可能性이 높다.