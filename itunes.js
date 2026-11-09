/* Tunes — the music rounds' fallback when Spotify won't play ball.

   Since 2026 a Spotify development-mode app shares one quota per developer
   account, and once it is spent every search and every "play this" comes back
   429 QUOTA_EXCEEDED. Apple's iTunes Search API needs no login, allows
   browser requests from any site, and gives a 30-second preview clip per song.
   So when Spotify is out:
     - searches are answered from iTunes, shaped like Spotify's answer, so the
       rounds don't know the difference;
     - playing a track (even one from the Spotify library cache) looks the
       song up on iTunes and plays the clip in a plain <audio> element.
   Deezer (JSONP, also free 30s previews) is the backup when iTunes has no
   clip. Everything is cached on this laptop, and calls are spaced out, as
   iTunes softly limits to about 20 a minute. */
(function () {
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const GAP_MS = 1600;           // spacing between iTunes calls
  const RES_KEY = 'tunes_resolve', SRCH_KEY = 'tunes_search';
  const load = k => { try { return JSON.parse(store.get(k) || '{}') || {}; } catch (e) { return {}; } };

  const Tunes = {
    audio: null, active: false, hushed: false,
    clips: {},                   // itunes:<id> -> preview url, this session
    meta: {},                    // spotify uri -> { n: name, a: artist }
    pausedUntil: 0, lastCall: 0, queue: Promise.resolve(),
    calls: 0,

    /* ---------- talking to iTunes, one call at a time ---------- */
    get(url) {
      const run = async () => {
        const wait = Math.max(0, this.lastCall + GAP_MS - Date.now(), this.pausedUntil - Date.now());
        if (wait) await new Promise(r => setTimeout(r, wait));
        this.lastCall = Date.now(); this.calls++;
        const r = await fetch(url);
        if (r.status === 403 || r.status === 429) { this.pausedUntil = Date.now() + 60000; throw new Error('iTunes asked us to slow down'); }
        if (!r.ok) throw new Error('iTunes ' + r.status);
        return r.json();
      };
      const p = this.queue.then(run, run);
      this.queue = p.catch(() => {});
      return p;
    },
    async itunes(term, limit) {
      const u = 'https://itunes.apple.com/search?' + new URLSearchParams({ term, media: 'music', entity: 'song', country: 'gb', limit: String(limit || 50) });
      const j = await this.get(u);
      return (j && j.results || []).filter(r => r.previewUrl && r.kind === 'song');
    },
    deezer(term) {
      return new Promise(res => {
        const cb = 'dz' + Date.now() + Math.floor(Math.random() * 1e4);
        const s = document.createElement('script');
        const done = v => { delete window[cb]; s.remove(); res(v); };
        window[cb] = j => done((j && j.data || []).filter(t => t.preview));
        s.onerror = () => done([]);
        setTimeout(() => window[cb] && done([]), 8000);
        s.src = 'https://api.deezer.com/search?' + new URLSearchParams({ q: term, output: 'jsonp', callback: cb, limit: '10' });
        document.head.appendChild(s);
      });
    },

    /* ---------- searches, in Spotify's shape ---------- */
    // Spotify query words like year:1990-1999, track:"x", artist:"y", genre:pop
    parse(q) {
      let s = String(q || ''); const f = {};
      s = s.replace(/(\w+):("([^"]*)"|(\S+))/g, (m, k, _v, quoted, bare) => { f[k.toLowerCase()] = quoted != null ? quoted : bare; return ' '; });
      let lo = 0, hi = 9999;
      if (f.year) { const m = f.year.split('-'); lo = +m[0] || 0; hi = +(m[1] || m[0]) || 9999; }
      const words = [f.track, f.artist, f.album, s.replace(/\s+/g, ' ').trim(), f.genre].filter(Boolean).join(' ').trim();
      return { lo, hi, words };
    },
    toSpotify(r) {
      const uri = 'itunes:' + r.trackId;
      this.clips[uri] = r.previewUrl;
      return {
        id: 'it' + r.trackId, uri, name: r.trackName, preview_url: r.previewUrl,
        artists: [{ name: r.artistName }],
        album: { name: r.collectionName || '', release_date: String(r.releaseDate || '').slice(0, 10),
                 images: r.artworkUrl100 ? [{ url: r.artworkUrl100.replace('100x100', '600x600'), width: 600, height: 600 }] : [] },
        duration_ms: r.trackTimeMillis || 30000, popularity: 50, explicit: r.trackExplicitness === 'explicit'
      };
    },
    inflight: {},
    slim(list) {
      return (list || []).map(r => ({ trackId: r.trackId, trackName: r.trackName, artistName: r.artistName,
        collectionName: r.collectionName, releaseDate: r.releaseDate, artworkUrl100: r.artworkUrl100,
        previewUrl: r.previewUrl, trackTimeMillis: r.trackTimeMillis, kind: 'song', trackExplicitness: r.trackExplicitness }));
    },
    async search(q, offset, limit) {
      const { lo, hi, words } = this.parse(q);
      // iTunes can't search by year: with only a year to go on, look for that
      // decade's hits and keep the ones actually released in range
      const term = words || ((lo ? Math.floor(lo / 10) * 10 + 's' : '') + ' hits').trim();
      const cache = load(SRCH_KEY); let rows = cache[term];
      // the rounds ask for four pages at once; one iTunes call serves them all
      if (!rows && this.inflight[term]) rows = await this.inflight[term];
      if (!rows) {
        const job = this.itunes(term, words ? 50 : 200);   // year-only searches need more to filter
        this.inflight[term] = job.then(x => this.slim(x)).catch(() => []);
        try { rows = this.slim(await job).filter(r => { const y = +String(r.releaseDate || '').slice(0, 4); return words || !y || (y >= lo && y <= hi); }).slice(0, 50); } finally { delete this.inflight[term]; }
        const keys = Object.keys(cache); if (keys.length > 80) keys.slice(0, 30).forEach(k => delete cache[k]);
        cache[term] = rows; store.set(SRCH_KEY, JSON.stringify(cache));
      }
      const inRange = rows.filter(r => { const y = +String(r.releaseDate || '').slice(0, 4); return !y || (y >= lo && y <= hi); });
      return inRange.slice(offset || 0, (offset || 0) + (limit || 10)).map(r => this.toSpotify(r));
    },

    /* ---------- finding a clip for a Spotify track ---------- */
    note(tracks) { (tracks || []).forEach(t => { if (t && t.uri && t.name) this.meta[t.uri] = { n: t.name, a: ((t.artists || [])[0] || {}).name || '' }; }); },
    metaFor(uri) {
      if (this.meta[uri]) return this.meta[uri];
      try {   // the song library keeps name/artist for every Spotify track it holds
        const d = typeof Library !== 'undefined' && Library.load && Library.load();
        const hit = d && d.t && Object.values(d.t).find(s => s.u === uri);
        if (hit) return (this.meta[uri] = { n: hit.n, a: (hit.a || [])[0] || '' });
      } catch (e) {}
      try {   // and the search cache holds whole Spotify track objects
        const all = JSON.parse(store.get(typeof Spot !== 'undefined' ? Spot.CACHE_KEY : '') || '{}');
        for (const v of Object.values(all)) { const t = (v.tracks || []).find(t => t && t.uri === uri); if (t) { this.note([t]); return this.meta[uri]; } }
      } catch (e) {}
      return null;
    },
    clean(s) { return String(s || '').toLowerCase().replace(/\(.*?\)|\[.*?\]| - .*$|feat\..*$|remaster.*$/g, '').replace(/[^a-z0-9 ]/g, '').trim(); },
    async resolve(uri) {
      if (this.clips[uri]) return this.clips[uri];
      const m = this.metaFor(uri); if (!m) throw new Error('No details for this song to find it without Spotify.');
      const key = this.clean(m.n) + '|' + this.clean(m.a);
      const saved = load(RES_KEY); if (saved[key]) return (this.clips[uri] = saved[key]);
      const want = this.clean(m.n), who = this.clean(m.a);
      let url = null;
      try {
        const rows = await this.itunes(m.n + ' ' + m.a, 10);
        const best = rows.find(r => this.clean(r.trackName) === want && this.clean(r.artistName).includes(who.split(' ')[0]))
          || rows.find(r => this.clean(r.trackName).startsWith(want)) || null;
        url = best && best.previewUrl;
      } catch (e) {}
      if (!url) {
        const dz = await this.deezer(m.n + ' ' + m.a);
        const best = dz.find(t => this.clean(t.title) === want) || dz[0];
        url = best && best.preview;   // Deezer links expire, so these aren't saved
        if (url) return (this.clips[uri] = url);
      }
      if (!url) throw new Error('No preview clip found for ' + m.n + ' — ' + m.a + '.');
      saved[key] = url; store.set(RES_KEY, JSON.stringify(saved));
      return (this.clips[uri] = url);
    },

    /* ---------- playing ---------- */
    el() {
      if (!this.audio) { this.audio = new Audio(); this.audio.preload = 'auto'; this.audio.crossOrigin = 'anonymous'; }
      return this.audio;
    },
    /* Load the next clip in a spare player while this one plays. Held in
       memory only, and dropped once used or replaced; nothing is saved. */
    spare: null,
    async preload(uri) {
      try {
        const url = await this.resolve(uri);
        if (this.spare && this.spare.src === url) return;
        const s = new Audio(); s.preload = 'auto'; s.crossOrigin = 'anonymous'; s.src = url; s.load();
        this.spare = s;
      } catch (e) {}
    },
    async play(uri, positionMs) {
      const url = await this.resolve(uri);
      if (this.spare && this.spare.src === url) {   // swap the ready one in
        if (this.audio) { this.audio.pause(); this.audio.removeAttribute('src'); }
        this.audio = this.spare; this.spare = null;
      }
      const a = this.el();
      if (a.src !== url) { a.src = url; await new Promise(r => { a.onloadedmetadata = r; a.onerror = r; setTimeout(r, 4000); }); }
      // a clip is 30 seconds: an offset meant for the full song starts it from the top
      const clip = (a.duration && isFinite(a.duration) ? a.duration : 30) * 1000;
      a.currentTime = positionMs && positionMs < clip - 8000 ? positionMs / 1000 : 0;
      a.volume = 1; this.hushed = false; this.active = true;
      await a.play();
    },
    pause() { if (this.audio) this.audio.pause(); },
    hush() { if (this.audio) { this.audio.volume = 0; this.audio.pause(); } this.hushed = true; },
    unhush() { if (this.audio) this.audio.volume = 1; this.hushed = false; },
    toggle() { const a = this.audio; if (!a || !a.src) return; if (a.paused) { a.volume = 1; a.play(); } else a.pause(); },
    seek(ms, alsoPlay) { const a = this.audio; if (!a) return; a.currentTime = Math.min(ms / 1000, Math.max(0, (a.duration || 30) - 5)); if (alsoPlay) { a.volume = 1; a.play(); } },
    playing() { return !!(this.audio && !this.audio.paused); }
  };
  window.Tunes = Tunes;
})();
