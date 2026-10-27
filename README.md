# CrackLET 2

Drop · Merge · Smash. Glass balls fall down five tracks; equal neighbours merge and double, up to ∞.
HTML5 prototype, installable on Android as an app (PWA), works offline.

**Play:** open the GitHub Pages address in Chrome on the phone → menu ⋮ → *Install app* / *Add to Home screen*.

| Folder | Content |
|---|---|
| `index.html` | the whole game (one file) |
| `manifest.webmanifest`, `sw.js` | app install + offline cache |
| `version.json` | current version; the game checks it and offers **Update** |
| `icons/` | app icons |
| `fonts/` | Anton and Kalam (SIL Open Font License) |
| `voice/` | announcer lines (ElevenLabs v4 via Magnific) |
| `sfx/` | glass sounds (ElevenLabs SFX via Magnific) |

**Releasing a new version:** set the same number in `APP_VERSION` (index.html), `VERSION` (sw.js) and `version.json`, then push. Installed games show the Update bar within 15 min or on next start.

© Toni — prototype, all rights reserved.
