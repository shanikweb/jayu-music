# jayu-music

Local development
- Install deps: `npm install`
- Run dev server: `npm run dev`

Deploy to GitHub Pages
- Vite is configured with `base: '/jayu-music/'` and outputs to `docs/`.
- Build the site: `npm run build` (this also creates `docs/404.html`).
- Commit and push the generated `docs/` folder.
- In GitHub: Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main` and Folder: `/docs`.
- Site URL: https://shanikweb.github.io/jayu-music/

Notes
- React Router is configured with the same base so routes work under `/jayu-music/`.
- `404.html` mirrors `index.html` so direct links and refreshes work.
