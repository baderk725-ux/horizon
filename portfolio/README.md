# KHALED — Beyond the Interface (portfolio app)

Next.js 16 · React 19 · TypeScript 7 · Tailwind CSS 4 · GSAP 3 + Lenis · React Three Fiber.
Creative direction: [`../docs/art-direction.md`](../docs/art-direction.md) · Hero review: [`../docs/review/hero/README.md`](../docs/review/hero/README.md)

## Run it locally

Requires **Node.js 20.9 or newer** (`node -v`).

```bash
git clone https://github.com/baderk725-ux/horizon.git
cd horizon
git checkout claude/portfolio-skills-setup-rwlc89
cd portfolio
npm install
npm run build
npm start
```

Open **http://localhost:3000**.

- **Review the real experience with the production build** (`build` + `start`). `npm run dev` also works (http://localhost:3000) but is slower and not representative of motion or performance.
- **To see the first-visit opening again**, open the page in a **new tab or window**. The opening plays once per browser session.
- **Mobile:** use a real phone on the same Wi-Fi (`npm start -- -H 0.0.0.0`, then open `http://<your-computer-ip>:3000`), or the browser's device toolbar. Device emulation doesn't reproduce mobile GPU performance.
- **Quality-tier overrides** (QA only): `?tier=high`, `?tier=medium`, `?tier=low`, `?tier=static`. A forced tier also disables the automatic downgrade.
- **Reduced motion:** enable "Reduce motion" in your OS accessibility settings and reload.

## Optional environment (`.env.local`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata/sitemap (default `http://localhost:3000`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shows the email in the UI and enables the mailto fallback for inquiries |
| `INQUIRY_WEBHOOK_URL` | Delivers Start-a-Project inquiries as JSON to a webhook (Slack, Discord, Make, Zapier, Formspree…) |

Without either delivery variable, the inquiry form clearly says online inquiries aren't connected yet.

## QA

```bash
npm run build && npm start   # in one terminal
npm run qa -- http://localhost:3000 --widths 360,390,768,1024,1440,1920 --axe
```
