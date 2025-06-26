# Contributing to Oh-My-Security

First off, thanks for taking the time to contribute! 🙏

The following guidelines help keep the project tidy and consistent.

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). Be respectful.

---

## 🛠 Development setup

```bash
# Clone and install deps
git clone https://github.com/Aniket00736/oh-my-security.git
cd oh-my-security
npm install

# Run generator
cd packages/generator
npm start

# Run web
cd ../../apps/web
npm run dev
```

Environment vars required for generator:

```
NEWS_API_KEY=your_newsapi_key
HF_TOKEN=your_huggingface_token
```

---

## 🚀 Pull Request workflow

1. Fork the repo and `git checkout -b my-feature`.
2. If adding a generator feature, include unit tests (`vitest`).
3. Run `npm run lint && npm run test` – comply with ESLint rules.
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
   ```
   feat(generator): add xyz attack detector
   ```
5. Push and open a PR targeting `main`.
6. A GitHub Action will run tests & build. Fix any failures.

---

## 📑 Style guide

- **TypeScript** everywhere, strict mode.
- Prefer functional components and React hooks.
- Keep JSON schema changes backwards-compatible.
- Use Tailwind utility classes before custom CSS.

---

## 🙌 Thanks

You're awesome for wanting to improve OMS. ​​💙❤️
