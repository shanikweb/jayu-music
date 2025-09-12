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

Customize the homepage
- Add a bio photo at `public/avatar.jpg` (optional; a fallback avatar renders if missing).
- Edit `src/pages/Home.tsx` to tweak bio copy and the grid tiles.

Custom drum samples (optional)
- Place files in `public/samples/` with these names (any of .wav/.mp3/.ogg):
  - `kick.wav`, `snare.wav`, `clap.wav`, `hat.wav`, `openhat.wav`
- On load, the app will try to fetch and decode these files and use them instead of the synthesized drums.
- Keep files short (sub‑second to a few hundred ms) for best results.
- After adding files, run `npm run dev` locally or `npm run build` to update `docs/` for GitHub Pages.
