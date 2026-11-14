// CrackLET 2 test bot: plays the real index.html headless (animations and sound skipped).
// node tools/bot.mjs [games=40] [director|classic] [easy|normal|hard] [maxMoves=1500]
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
const [games = 40, mode = "director", diff = "normal", maxMoves = 1500] = process.argv.slice(2);
const file = "file://" + path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../index.html");
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", e => console.error("PAGE ERROR", e.message));
await page.addInitScript(m => { localStorage.clear(); window.__BOT__ = { classic: m === "classic" }; }, mode);
await page.goto(file);
await page.waitForFunction(() => window.__CL2);
const res = await page.evaluate(async ({ games, diff, maxMoves }) => {
  const G = window.__CL2; G.setDiff(diff);
  const out = [];
  for (let g = 0; g < games; g++){
    G.newGame(1000 + g);
    let S = G.state();
    while (!S.over && S.moves < maxMoves){
      // greedy: longest chain, then lowest track, then the track whose top is closest in value
      let bestC = -1, bestS = -1e9;
      for (let c = 0; c < 5; c++){
        const ch = G.simChain(c, S.cur); if (ch < 0) continue;
        const col = S.grid[c], top = col.length ? col[col.length - 1].v : 0;
        const sc = ch * 100 - col.length * 4 - (top ? Math.abs(Math.log2(top) - Math.log2(S.cur)) * 2 : 3) + Math.random();
        if (sc > bestS){ bestS = sc; bestC = c; }
      }
      if (bestC < 0) break;
      await G.drop(bestC); S = G.state();
    }
    out.push({ moves: S.moves, max: S.maxEver, prisms: S.prismMade || 0, bursts: S.prisms, dir: S.dealN ? S.dirN / S.dealN : 0,
               danger: S.dangerN || 0, saved: S.savedN, ch4: S.ch4, score: S.score, coins: S.earned, capped: !S.over });
  }
  return out;
}, { games: +games, diff, maxMoves: +maxMoves });
await browser.close();
const med = k => { const a = res.map(r => r[k]).sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
const pct = f => Math.round(res.filter(f).length / res.length * 100) + "%";
const sumD = res.reduce((a, r) => a + r.danger, 0), sumS = res.reduce((a, r) => a + r.saved, 0);
console.log(`${mode}/${diff} · ${res.length} games (cap ${maxMoves} moves)`);
console.log(`median moves ${med("moves")} · median biggest ${med("max")} · median score ${Math.round(med("score"))}`);
console.log(`games with a Prism ${pct(r => r.prisms > 0)} · with a burst ${pct(r => r.bursts > 0)} · reached cap ${pct(r => r.capped)}`);
console.log(`Director ${Math.round(med("dir") * 100)}% of deals · crises ${sumD} · saved ${sumS} (${sumD ? Math.round(sumS / sumD * 100) : 0}%) · chains ≥4 per 100 moves ${(res.reduce((a, r) => a + r.ch4, 0) / res.reduce((a, r) => a + r.moves, 0) * 100).toFixed(1)}`);
console.log(`median coins earned ${Math.round(med("coins"))}`);
