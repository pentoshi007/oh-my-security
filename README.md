# Oh-My-Security (OMS)

A fully-automated, zero-cost website that publishes a fresh, structured breakdown of a real-world cyber-attack every day.

> Because security knowledge should be as fresh as today's headlines.

---

## ✨ Features

- **Daily content pipeline** – pulls the day's top cybersecurity news, detects the attack technique, generates blue-team & red-team write-ups, and stores them as JSON/Markdown.
- **Modern Next.js front-end** – stylish UI; blue sections for defence, red for offence.
- **Archive** – browse any previous day's article via the navbar.
- **Automated GitHub Actions** – cron job commits new daily content and redeploys the site.
- **Free-tier everything** – NewsAPI, Hugging Face inference, GitHub Actions & Vercel/Netlify hosting.

---

## 📂 Repository layout

```
/oh-my-security
├── apps/
│   └── web           # Next.js front-end
├── packages/
│   └── generator     # TypeScript CLI that creates daily content
├── content/          # Auto-generated JSON (& optional .md) files, one per day
└── .github/workflows # CI / daily cron
```

---

## ⚙️ Tech stack

| Layer              | Choice                                                    |
| ------------------ | --------------------------------------------------------- |
| Front-end          | Next.js 14, Tailwind CSS, DaisyUI                         |
| Content generation | Node 18, TypeScript, NewsAPI, Hugging Face free inference |
| Automation         | GitHub Actions scheduled workflow                         |
| Hosting (static)   | Vercel Hobby (or Netlify / GH Pages)                      |
| Storage            | `/content` folder version-controlled in Git               |

---

## 🏗️ Architecture

```mermaid
flowchart TD;
    A[GitHub Actions – daily cron] --> B(generator CLI);
    B --> C[/content/YYYY-MM-DD.json];
    C -->|Static import at build time| D[Next.js];
    D --> E[Vercel / Netlify CDN];
```

---

## 🚀 Quick start (local)

```bash
# Clone & install
git clone https://github.com/Aniket00736/oh-my-security.git
cd oh-my-security
npm install

# Generate today\'s content locally (needs NEWS_API_KEY, HF_TOKEN)
cd packages/generator
npm start

# Run the website
cd ../../apps/web
npm run dev
```

Create a `.env` file:

```
NEWS_API_KEY=your_newsapi_key
HF_TOKEN=your_huggingface_token
```

---

## 🛠️ Daily automation

`.github/workflows/daily.yml` runs at 03:00 UTC, commits the new JSON to `content/`, and pushes. The push triggers an automatic redeploy on Vercel/Netlify.

---

## 🌐 Deployment

1. **Vercel** – Import repo, build command `npm run build`, output `.next`.
2. **Netlify (static)** – `next export` during build and serve `/out`.
3. **GitHub Pages** – Export site and push to `gh-pages` branch.

---

## 🙌 Credits

Built with ❤️ by [Aniket Pandey](https://linkedin.com/in/aniket00736).  
Follow me on [Twitter](https://x.com/lunatic_ak_) · [GitHub](https://github.com/pentoshi007).
