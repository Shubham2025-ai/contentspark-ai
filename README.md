# ContentSpark AI

> Agency-quality marketing copy for small businesses — powered by Groq + LLaMA 3.3 70B. Free tier. No backend. No subscription.

![ContentSpark AI](https://img.shields.io/badge/Powered%20by-Groq-orange) ![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Free](https://img.shields.io/badge/API-Free%20Tier-green)

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3. Get your free Groq API key

Visit [console.groq.com](https://console.groq.com) → Create account → API Keys → Create key

Paste it into the generator. Your key **never leaves your browser**.

---

## 🏗 Build for production

```bash
npm run build
```

Output in `/dist` — deploy to Vercel, Netlify, or GitHub Pages instantly.

### Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

---

## ✦ Features

| Feature | Detail |
|---|---|
| AI Engine | Groq API · `llama-3.3-70b-versatile` · Free tier |
| Platforms | Instagram, X/Twitter, Facebook, LinkedIn, Google Ads |
| Content types | Social post, Tagline, Ad headline, Product description, Promo offer |
| Tones | Playful, Professional, Urgent, Inspirational, Conversational |
| Quality scoring | Readability · CTA strength · Emoji density · Hashtag compliance |
| Privacy | API key stays in browser · No server · No logging |
| Performance | < 5s generation · Parallel requests per combo |

---

## 🧱 Tech Stack

- **React 18** + **Vite 5** — fast SPA
- **CSS Modules** — scoped, no conflicts
- **Groq API** — `llama-3.3-70b-versatile` via `api.groq.com/openai/v1`
- **Local NLP scoring** — no external service needed
- **Google Fonts** — Instrument Serif + Satoshi

---

## 📁 Project Structure

```
contentspark/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # Root component
│   ├── index.css         # Global styles + CSS variables
│   ├── utils.js          # Groq API, prompt builder, quality scorer
│   └── components/
│       ├── Hero.jsx / .module.css        # Landing hero section
│       ├── Features.jsx / .module.css    # Features + how it works + samples
│       ├── Generator.jsx / .module.css   # Main generation form + results
│       └── NavFooter.jsx / .module.css   # Navbar + Footer
```

---

## 🎯 Hackathon Notes

- **Zero backend required** — pure client-side, no CORS issues
- **Free tier Groq** — 14,400 tokens/min, ~500 req/day — more than enough for demo
- **Quality scoring is local** — uses heuristics only, no extra API calls
- **Deployable in 60 seconds** — `npm run build` → Vercel

---

## 📜 License

MIT
