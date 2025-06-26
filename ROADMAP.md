# OMS Roadmap

A chronological checklist for building, automating and scaling **Oh-My-Security**.

> Tick items as you go ✅

---

## Phase 0 – Repo & Local Setup

- [ ] Create public repo `oh-my-security` on GitHub.
- [ ] Initialise `apps/web`, `packages/generator`, `content`, `.github/workflows` folders.
- [ ] Install Node 18 LTS.
- [ ] `git commit -m "chore: project scaffold"`.

## Phase 1 – Content Generator (CLI)

- [ ] Sign-up for a free **NewsAPI.org** key.
- [ ] Sign-up for **Hugging Face** Inference API & grab token.
- [ ] `cd packages/generator && npm init -y && tsconfig.json`.
- [ ] Implement `src/index.ts`:
  1. Fetch today's top cyber-security headline.
  2. Detect attack type via keyword/NER.
  3. Call HF model to create JSON schema.
  4. Validate & write to `../../content/YYYY-MM-DD.json`.
- [ ] `npm start` should output the day's file.

## Phase 2 – Optional Image Support

- [ ] Use Unsplash Source API to fetch a hero image per attack.
- [ ] Save under `/public/images/YYYY-MM-DD.jpg`.

## Phase 3 – Web Front-end

- [ ] `npx create-next-app apps/web --ts --tailwind`.
- [ ] Set up Tailwind + DaisyUI.
- [ ] Build pages:
  - `/` → shows latest JSON.
  - `/archive` → lists all days.
  - `/archive/[date]` → renders chosen JSON.
- [ ] Implement blue/red colour sections.
- [ ] Add responsive Navbar (Home, Archive, GitHub) and Footer (author + socials).

## Phase 4 – Automation (GitHub Actions)

- [ ] `.github/workflows/daily.yml` scheduled at `0 3 * * *` (03:00 UTC).
- [ ] Steps: checkout → `npm ci` → `packages/generator` → commit `/content` → push.

## Phase 5 – Hosting

- [ ] Import repo into **Vercel** (free Hobby tier).
- [ ] Configure build: `npm run build`.
- [ ] Set production branch = `main`.
- [ ] Push → watch auto-deploy.

## Phase 6 – Polish & Launch

- [ ] Lighthouse ≥ 90 mobile/desktop.
- [ ] Add SEO meta tags & Open Graph.
- [ ] Prepare `README.md`, badges, and MIT `LICENSE`.
- [ ] Tweet and share on LinkedIn 🎉

---

## Nice-to-Haves

- [ ] RSS feed (`next-rss`).
- [ ] PWA offline support.
- [ ] Algolia DocSearch community plan.
- [ ] Dark mode toggle.
