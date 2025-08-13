# WordCloud – Word Cloud Generator (PT-BR/EN)

A static, minimalist, and responsive app to generate **word clouds** directly in the browser. Ideal for GitHub Pages.

## ✨ Use it up

[Click on this link](http://www.wilsonfrantine.github.io/wordcloud-app/)

## ✨ Features
- **Input modes**:
  - **Free text** (automatic frequency count)
  - **Word + frequency list** (one per line) with configurable separator
- **Palettes**: Viridis, Plasma, Cividis, Warm, Cool, Mono, High Contrast
- **Fonts**: Sans (Inter), Serif (Merriweather), Mono (JetBrains Mono)
- **PT-BR/EN** language toggle
- **Options**: max words, rotation, min/max font size, PT/EN stopwords + custom, normalization
- **Export PNG**
- **Help** modal included

## 🛠️ How to use locally
    git clone https://github.com/YOUR_USERNAME/wordcloud-app.git
    cd wordcloud-app
    # open index.html in your browser (double-click) or use a static server

## 🌐 Deploy to GitHub Pages
1. Create a repository `wordcloud-app`.
2. Push these files to it.
3. Enable Settings → Pages → Deploy from branch (branch `main`, folder `/root`).
4. Access the provided public URL.

## 📁 Structure
    wordcloud-app/
    ├─ index.html
    ├─ assets/
    │  ├─ css/style.css
    │  └─ js/{app.js, wordcloud2.min.js}
    ├─ LICENSE
    └─ README.md

## 🔎 Notes
- Very large texts can be slow; adjust **Max words** accordingly.
- The **stopwords** lists are minimal; add your own in the “extra” field as needed.
- You may replace `assets/js/wordcloud2.min.js` with a CDN in `index.html`.

## 📜 License
**MIT** — Long live free software!

## 🙌 Citation
Please **cite this repository** when using the app.
