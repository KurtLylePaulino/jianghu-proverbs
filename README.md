# 江湖箴言 · Wisdom of the Rivers & Lakes

A single-page GitHub Pages site that rolls a **random Chinese proverb** from a curated set of **200 classics**, each shown with its **original author / source**, pinyin, and an English rendering — all wrapped in a living *wuxia / murim* (武侠 · 江湖) scene: a hanging silk scroll on aged rice paper, swaying red lanterns, drifting mountain ranges with a distant pagoda, a glowing moon, falling plum-blossom petals, passing birds, and an optional erhu-style ambience.

## Features

- 🎲 **Draw Lots** — roll a random proverb (never repeats the one just shown).
- 📋 **Copy** — one click copies the proverb, pinyin, translation, and attribution to the clipboard.
- 🎻 **Erhu ambience** — a generative erhu-style melody synthesized live with the Web Audio API (D-major pentatonic, bowed envelope, delayed vibrato, valley echo). No audio files, nothing to license; toggle it with the 琴 button.
- 🏮 **Animated scenery** — parallax mountain silhouettes, fog banks, a breathing moon, swaying lanterns (武 / 俠), falling petals, and birds crossing the sky.
- 🖋 **200 attributed proverbs** from 79 sources — Confucius, Laozi, Sun Tzu, Mencius, Zhuangzi, Li Bai, Du Fu, Su Shi, Xin Qiji, the *Water Margin*, and more, each tagged with author and dynasty/text.
- ⌨️ **Keyboard** — `Space` / `Enter` to roll, `C` to copy.
- 📱 Responsive, with a `prefers-reduced-motion` fallback. No build step, no dependencies.

## Files

```
index.html        # markup
css/style.css     # wuxia/murim styling + animated scenery
js/proverbs.js    # the 200 proverbs (zh, pinyin, en, author, dynasty)
js/app.js         # roll + copy + petals + music toggle
js/audio.js       # generative erhu ambience (Web Audio)
.nojekyll         # serve assets as-is on GitHub Pages
```

## Deploy to GitHub Pages

1. Create a repo and push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "江湖箴言: random Chinese proverb scroll"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` / `/ (root)`, save.
3. Visit `https://<you>.github.io/<repo>/`.

## Run locally

Any static server works, e.g.:
```bash
npx http-server -p 4173
# then open http://localhost:4173
```

## Adding proverbs

Append objects to the `PROVERBS` array in `js/proverbs.js`:
```js
{ zh: "中文。", py: "Pinyin.", en: "English meaning.", author: "作者 Author", dynasty: "Era · 《出处》" }
```
The footer count and index seal update automatically from the array length.
