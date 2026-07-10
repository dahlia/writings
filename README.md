[洪民憙雜記]
============

[洪民憙]의 多言語 블로그. [Astro]로 靜的 HTML을 만들고 [Netlify]에서 配布한다.
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

生成物은 *dist/*에 놓인다. `pnpm netlify:dev`는 Netlify Edge Function을
包含한 로컬 環境을 띄운다.

配布
----

Netlify에서 이 貯藏所를 連結하면 *netlify.toml*의 빌드 設定이 適用된다.
Netlify의 Pretty URLs 後處理는 明示的으로 꺼 두었는데, 이는
_index.ko-kore.html_ 같은 旣存 公開 URL을 保存하기 爲함이다.

[洪民憙雜記]: https://writings.hongminhee.org/
[洪民憙]: https://hongminhee.org/
[Astro]: https://astro.build/
[Netlify]: https://www.netlify.com/
[Seonbi]: https://github.com/dahlia/seonbi
[mise]: https://mise.jdx.dev/
