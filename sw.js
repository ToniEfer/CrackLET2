/* CrackLET 2 — offline cache. Bump VERSION after every change so phones pick up the new build. */
const VERSION = "cracklet2-v0.8.3";
const FILES = [
"./",
"index.html",
"manifest.webmanifest",
"fonts/anton-latin-400-normal.woff2",
"fonts/anton-latin-ext-400-normal.woff2",
"fonts/kalam-latin-400-normal.woff2",
"fonts/kalam-latin-700-normal.woff2",
"fonts/kalam-latin-ext-400-normal.woff2",
"fonts/kalam-latin-ext-700-normal.woff2",
"icons/apple-touch-icon.png",
"icons/favicon-48.png",
"icons/icon-192.png",
"icons/icon-512.png",
"icons/maskable-512.png",
"voice/ball_back_again.mp3",
"voice/ball_big_one.mp3",
"voice/ball_there_it_is.mp3",
"voice/best_new_high_score.mp3",
"voice/best_personal_best.mp3",
"voice/best_you_did_it.mp3",
"voice/burst_boom_cleared.mp3",
"voice/burst_infinity_burst.mp3",
"voice/burst_jackpot.mp3",
"voice/clear_clean_sweep.mp3",
"voice/clear_fresh_space.mp3",
"voice/clear_small_fry.mp3",
"voice/combo2_combo.mp3",
"voice/combo2_double.mp3",
"voice/combo2_nice.mp3",
"voice/combo3_keep_going.mp3",
"voice/combo3_ooh_nice.mp3",
"voice/combo3_triple.mp3",
"voice/danger_careful.mp3",
"voice/danger_getting_tight.mp3",
"voice/great_chain_reaction.mp3",
"voice/great_great.mp3",
"voice/great_now_talking.mp3",
"voice/herecomes.mp3",
"voice/inf_beyond_numbers.mp3",
"voice/inf_infinity.mp3",
"voice/inf_legendary.mp3",
"voice/mega_mega.mp3",
"voice/mega_unstoppable.mp3",
"voice/mega_what_a_chain.mp3",
"voice/mode_easy.mp3",
"voice/mode_hard.mp3",
"voice/mode_normal.mp3",
"voice/newball_brand_new.mp3",
"voice/newball_never_seen.mp3",
"voice/newball_new_record.mp3",
"voice/over_almost_had_it.mp3",
"voice/over_one_more_try.mp3",
"voice/over_so_close.mp3",
"voice/revive_back_in_game.mp3",
"voice/revive_second_chance.mp3",
"voice/saved_phew.mp3",
"voice/saved_saved.mp3",
"voice/start_drop_it.mp3",
"voice/start_lets_smash.mp3",
"voice/unlock_level_up.mp3",
"voice/unlock_new_balls.mp3",
"voice/unlock_stepping_up.mp3",
"sfx/clink1.mp3",
"sfx/clink2.mp3",
"sfx/clink3.mp3",
"sfx/crash_big1.mp3",
"sfx/crash_big2.mp3",
"sfx/crash_big3.mp3",
"sfx/crash_s1.mp3",
"sfx/crash_s2.mp3",
"sfx/crash_s3.mp3",
"sfx/crash_s4.mp3"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // game page: network first (fresh build when online), cache when offline; assets: cache first
  if (e.request.mode === "navigate"){
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put("index.html", cp)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
