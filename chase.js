/* =====================================================================
   THE CHASE — you two against a computer Chaser.

   Flow: the Chaser is revealed → each player in turn plays a 60-second
   Cash Builder, picks an offer, then goes head to head (choosing between
   two categories each question) to get their money home → everyone who
   got home plays the Final Chase together → the Chaser chases their target,
   with pushbacks on every miss.

   The Chaser knows nothing: each answer is a dice roll against its hit rate
   (chasers.js), nudged by difficulty, nerves and how it has done against
   you before. Everything is read aloud and paced on the speech, with
   original synth music under the timed parts.
   ===================================================================== */

/* ---------- music: original synth tension bed, ticks and stingers ---------- */
const ChaseMusic = {
  on: false, urgent: false,
  ok() { return Sound.enabled && (window.AudioContext || window.webkitAudioContext); },
  start(kind) {
    if (!this.ok()) return;
    try {
      Sound.ensure();
      this.stop(true);
      const ctx = Sound.ctx;
      this.out = ctx.createGain(); this.out.gain.value = 0.0001;
      this.out.gain.exponentialRampToValueAtTime(this.level = 0.22, ctx.currentTime + 1.2);
      this.out.connect(ctx.destination);
      this.on = true; this.urgent = false; this.step = 0;
      this.bpm = kind === 'final' ? 136 : kind === 'chaser' ? 128 : 120;
      this.next = ctx.currentTime + 0.1;
      this.timer = setInterval(() => this.schedule(), 40);
    } catch (e) {}
  },
  schedule() {
    const ctx = Sound.ctx; if (!ctx || !this.on) return;
    const spb = 60 / this.bpm / 2;             // eighth notes
    while (this.next < ctx.currentTime + 0.2) { this.note(this.step, this.next); this.next += spb; this.step++; }
  },
  blip(type, f, peak, t, dur, cut) {
    const ctx = Sound.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    o.type = type; o.frequency.setValueAtTime(f, t);
    fl.type = 'lowpass'; fl.frequency.value = cut || 1200;
    g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(fl); fl.connect(g); g.connect(this.out); o.start(t); o.stop(t + dur + 0.02);
  },
  tick(t, f, peak) {
    const ctx = Sound.ctx, len = Math.ceil(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buf; fl.type = 'highpass'; fl.frequency.value = f || 6000; g.gain.value = peak || 0.25;
    s.connect(fl); fl.connect(g); g.connect(this.out); s.start(t);
  },
  note(i, t) {
    // A minor driving pulse: A A F G, one bar each
    const roots = [55, 55, 43.65, 49];
    const r = roots[Math.floor(i / 8) % 4];
    this.blip('sawtooth', r, 0.5, t, 0.16, 380);
    if (i % 8 === 0) [4, 4.76, 6].forEach(m => this.blip('square', r * m, 0.05, t, 0.5, 1800));   // minor stab
    if (i % 2 === 1) this.tick(t, 7000, 0.12);
    if (this.urgent) {                          // last ten seconds: the clock
      if (i % 2 === 0) this.blip('sine', 1760, 0.18, t, 0.06, 4000);
      if (i % 8 === 4) this.blip('square', r * 8, 0.08, t, 0.3, 2400);
    }
  },
  setUrgent(v) { this.urgent = !!v; },
  duck(down) {
    if (!this.on || !this.out) return;
    const t = Sound.ctx.currentTime;
    this.out.gain.cancelScheduledValues(t);
    this.out.gain.setTargetAtTime(down ? 0.07 : this.level, t, 0.12);
  },
  stop(now) {
    clearInterval(this.timer); this.on = false; this.urgent = false;
    const out = this.out; this.out = null;
    if (!out) return;
    try { const t = Sound.ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setTargetAtTime(0.0001, t, now ? 0.02 : 0.3); setTimeout(() => out.disconnect(), 1500); } catch (e) {}
  },
  sting(kind) {
    if (!this.ok()) return;
    try {
      Sound.ensure();
      const ctx = Sound.ctx, t = ctx.currentTime + 0.05;
      const g = ctx.createGain(); g.gain.value = 0.3; g.connect(ctx.destination);
      const play = (type, f, at, dur, peak) => {
        const o = ctx.createOscillator(), e = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t + at);
        e.gain.setValueAtTime(peak || 0.4, t + at); e.gain.exponentialRampToValueAtTime(0.001, t + at + dur);
        o.connect(e); e.connect(g); o.start(t + at); o.stop(t + at + dur + 0.05);
      };
      if (kind === 'timeup') { [880, 698, 523].forEach((f, k) => play('square', f, k * 0.22, 0.35, 0.3)); play('sawtooth', 110, 0.66, 1.2, 0.5); }
      if (kind === 'caught') { play('sawtooth', 98, 0, 1.6, 0.6); play('sawtooth', 104, 0, 1.6, 0.5); play('square', 49, 0.1, 1.8, 0.5); }
      if (kind === 'win') { [523, 659, 784, 1047].forEach((f, k) => play('square', f, k * 0.14, 0.5, 0.3)); [523, 659, 784].forEach(f => play('triangle', f * 2, 0.6, 1.4, 0.2)); }
      if (kind === 'home') { [659, 988].forEach((f, k) => play('triangle', f, k * 0.12, 0.4, 0.35)); }
      if (kind === 'reveal') { play('sawtooth', 220, 0, 0.9, 0.3); play('sawtooth', 330, 0.25, 1.2, 0.25); }
      setTimeout(() => g.disconnect(), 3500);
    } catch (e) {}
  }
};

const Chase = {
  active: false,
  timeScale: 1,              // tests shrink every wait
  CASH_SECS: 60,
  CASH_PER: 1000,
  STEPS: 8,                  // board: chaser starts at 0, home is 8
  H2H_SECS: 20,
  FINAL_SECS: 120,
  FINAL_PACE: 1.33,     // the Chaser answers about a third faster in the final (≈15 a minute)
  PUSH_SECS: 12,
  LAZARUS_POT: 4000,
  REC_KEY: 'chase_record',

  CAT_MAP: { filmtv: 'film_and_tv', food: 'food_and_drink', sport: 'sport_and_leisure', body: 'science',
             words: 'arts_and_literature', weird: 'general_knowledge', local: 'general_knowledge' },

  /* ---------- small helpers ---------- */
  sleep(ms) {
    const until = Date.now() + ms * this.timeScale;
    return new Promise(async r => { while (this.active && Date.now() < until) await new Promise(x => setTimeout(x, 50)); r(); });
  },
  money(n) { return (n < 0 ? '-£' : '£') + Math.abs(n).toLocaleString('en-GB'); },
  pounds(n) { return n.toLocaleString('en-GB') + ' pounds'; },
  here() { return Object.keys(Host.players).filter(id => Host.isPresent(Host.players[id])); },
  nameOf(id) { return (Host.players[id] || {}).name || 'Someone'; },

  record() { try { return JSON.parse(store.get(this.REC_KEY) || '{}') || {}; } catch (e) { return {}; } },
  saveRecord(r) { store.set(this.REC_KEY, JSON.stringify(r)); },
  bossUnlocked() {
    const r = this.record();
    return CHASERS.filter(c => !c.locked).every(c => r[c.id] && r[c.id].l > 0);
  },
  pickChaser(want) {
    const pool = CHASERS.filter(c => !c.locked || this.bossUnlocked());
    if (want && want !== 'random') { const c = CHASERS.find(x => x.id === want); if (c && pool.includes(c)) return c; }
    return pool[Math.floor(Math.random() * pool.length)];
  },

  /* ---------- the Chaser's brain: a dice roll ----------
     Head to head: weak subjects ~68%, strong ~93% — picking the category
     matters, but nothing is a free ride. Final chase: every Chaser is a
     pro, 80–90% like the real show, so pushbacks are a rare lifeline. */
  hitRate(cat, diff, pressure, phase) {
    const ch = this.chaser;
    const s = ch.skill[cat] != null ? ch.skill[cat] : 65;
    let p = phase === 'final' ? 70 + s * 0.2 : 50 + s * 0.45;
    p += { e: 4, m: 0, h: -6 }[diff] || 0;
    p += this.adj || 0;                          // learns your league
    p -= (pressure || 0) * ch.nerves * 0.9;      // nerves when it matters
    return Math.max(25, Math.min(97, p));
  },
  chaserAnswers(q, pressure, phase) { return Math.random() * 100 < this.hitRate(q.c, q.d, pressure, phase); },

  /* ---------- questions ---------- */
  buildPool() {
    const own = (window.CHASE_Q || []).map(q => ({ ...q, seenKey: 'cq:' + q.id }));
    // its own bank only — the written bank belongs to the other rounds, so
    // nothing you met in Fastest Finger turns up again here
    this.pool = Seen.rank('chase', own);
    this.used = [];
  },
  /* Difficulty levels: easy / medium / hard percentages. "main" is the cash
     builder and head to heads, "final" the Final Chase. The Chaser is the same
     whichever you pick — only the questions change. */
  LEVELS: {
    gentle: { label: '🙂 Gentle', main: [50, 45, 5],  final: [40, 55, 5] },
    normal: { label: '⚖️ Normal', main: [30, 60, 10], final: [20, 70, 10] },
    tough:  { label: '🔥 Tough',  main: [0, 90, 10],  final: [0, 90, 10] }
  },
  mix(stage) { const L = this.LEVELS[this.level] || this.LEVELS.normal; return L[stage] || L.main; },
  pickD(mix) {
    const r = Math.random() * (mix[0] + mix[1] + mix[2]);
    return r < mix[0] ? 'e' : r < mix[0] + mix[1] ? 'm' : 'h';
  },
  take(test, second, mix) {
    let i = -1;
    if (mix) { const d = this.pickD(mix); i = this.pool.findIndex(x => x.d === d && test(x)); }
    if (i < 0) i = this.pool.findIndex(test);
    if (i < 0 && second) i = this.pool.findIndex(second);
    if (i < 0) i = this.pool.findIndex(() => true);
    if (i < 0) { this.buildPool(); i = 0; }    // ran dry: start again, oldest first
    const q = this.pool.splice(i, 1)[0];
    this.used.push(q);
    const opts = Quiz.shuffle([q.a].concat(Quiz.shuffle(q.w.slice()).slice(0, 2)));
    return { ...q, opts, correct: opts.indexOf(q.a), qid: (this.qn = (this.qn || 0) + 1) };
  },
  cats() {
    const n = {};
    this.pool.forEach(q => { if (CHASE_CATS[q.c]) n[q.c] = (n[q.c] || 0) + 1; });
    return Object.keys(n).filter(c => n[c] > 0);
  },

  /* ---------- talking: everything waits for the words ---------- */
  VOICE: {
    professor: { male: true, rate: 0.9, pitch: 0.8 },
    diva:      { male: false, rate: 1.12, pitch: 1.35 },
    landlord:  { male: true, rate: 1.0, pitch: 0.65 },
    librarian: { male: false, rate: 0.92, pitch: 1.05 },
    boss:      { male: true, rate: 0.82, pitch: 0.3 }
  },
  pickVoice(male) {
    const vs = Sound.voices().filter(v => /^en(-|_)/i.test(v.lang));
    const gb = vs.filter(v => /GB/i.test(v.lang));
    const list = gb.length ? gb : vs;
    const F = /female|hazel|susan|sonia|libby|maisie|kate|serena|martha|emily|zira|samantha/i;
    const M = /\bmale|george|ryan|daniel|oliver|arthur|thomas|david|mark|james|alex/i;
    return list.find(v => male ? (M.test(v.name) && !F.test(v.name)) : F.test(v.name)) || list[0] || null;
  },
  /* Speak and resolve when finished. who: 'host' (the game's own voice
     setting) or 'chaser'. wait=false starts it and returns at once. */
  speak(text, who, wait) {
    if (!text) return Promise.resolve();
    const est = 900 + text.length * 70;          // a rough reading time
    if (!Sound.enabled || typeof speechSynthesis === 'undefined') return wait === false ? Promise.resolve() : this.sleep(Math.min(est, 6000));
    return new Promise(resolve => {
      let done = false;
      const fin = () => { if (done) return; done = true; ChaseMusic.duck(false); resolve(); };
      try {
        const u = new SpeechSynthesisUtterance(text);
        if (who === 'chaser') {
          const cfg = this.VOICE[this.chaser.id] || {};
          const v = this.pickVoice(cfg.male);
          if (v) { u.voice = v; u.lang = v.lang; }
          u.rate = cfg.rate || 1; u.pitch = cfg.pitch || 1;
        } else {
          const st = Sound.STYLES[store.get('buzz_style') || 'normal'] || Sound.STYLES.normal;
          u.rate = Math.min(st[1], 1.05); u.pitch = st[2];
          const want = store.get('buzz_voice');
          const v = want && Sound.voices().find(x => x.voiceURI === want);
          if (v) { u.voice = v; u.lang = v.lang; }
        }
        u.onend = fin; u.onerror = fin;
        ChaseMusic.duck(true);
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) { fin(); }
      setTimeout(fin, est * 2 + 2000);           // never hang on a silent voice
      if (wait === false) resolve();
    });
  },
  say(text) { return this.speak(text, 'host'); },
  taunt(text) { return this.speak(text, 'chaser'); },
  readQ(q, withOpts) {
    const opts = withOpts ? ' ' + q.opts.slice(0, -1).join(', ') + ', or ' + q.opts[q.opts.length - 1] + '?' : '';
    return q.q + opts;
  },

  /* ---------- phones ---------- */
  send(id, m) { this.lastTo[id] = m; Host.sendTo(id, Object.assign({ type: 'chase' }, m)); },
  sendAll(m) { Object.keys(Host.players).forEach(id => this.send(id, m)); },
  resend(id) { if (this.lastTo && this.lastTo[id]) Host.sendTo(id, Object.assign({ type: 'chase' }, this.lastTo[id])); },

  /* Put a question on the phones. mode 'one': only `who` answers. mode
     'first': settles on the first right answer from any of `who`. The
     clock (secs) is started separately with startClock, so it can begin
     after the question has been read out. */
  put(who, q, mode, extra) {
    this.cur = { q, who: new Set(who), ans: {}, mode: mode || 'one' };
    const view = { k: 'q', qid: q.qid, text: q.q, opts: q.opts, cat: CHASE_CATS[q.c] || '', ...extra };
    Object.keys(Host.players).forEach(id => this.send(id, Object.assign({}, view, { mine: this.cur.who.has(id) })));
    this.cur.p = new Promise(resolve => { this.cur.done = resolve; });
    return this.cur.p;
  },
  startClock(secs) {
    const c = this.cur; if (!c || !c.done) return;
    clearTimeout(c.timer);
    c.timer = setTimeout(() => this.settle(), secs * 1000 * this.timeScale);
  },
  answer(id, msg) {
    const c = this.cur;
    if (!this.active || !c || !c.q || !c.done || msg.qid !== c.q.qid || !c.who.has(id) || c.ans[id] != null) return;
    c.ans[id] = msg.i;
    const right = msg.i === c.q.correct;
    if (c.mode === 'first' && right) return this.settle();
    // like the show: whoever buzzes first answers for the team, right or wrong
    if (c.mode === 'buzz') return this.settle();
    if ([...c.who].every(x => c.ans[x] != null || !Host.isPresent(Host.players[x]))) this.settle();
  },
  settle() {
    const c = this.cur; if (!c || !c.done) return;
    clearTimeout(c.timer);
    const done = c.done; c.done = null;
    done(c.ans);
  },

  /* ---------- host screen ---------- */
  view(html) {
    const el = $('chaseHost'); if (!el) return;
    el.classList.remove('hidden');
    el.innerHTML = '<div class="chase-wrap" style="--cc:' + this.chaser.colour + '">' + html + '</div>';
  },
  head() {
    const ch = this.chaser;
    return '<div class="ch-head">' + chaserPortrait(ch.id, 84) + '<div><div class="ch-nick">' + ch.emoji + ' ' + ch.nick + '</div>' +
      '<div class="muted">' + esc(ch.name) + '</div></div></div>';
  },
  board(pPos, cPos, label) {
    let rows = '';
    for (let s = 0; s <= this.STEPS; s++) {
      const isP = s === pPos, isC = s === cPos;
      rows += '<div class="ch-step' + (isC ? ' chaser' : '') + (isP ? ' player' : '') + (s === this.STEPS ? ' home' : '') + '">' +
        (isC ? this.chaser.emoji + ' ' + esc(this.chaser.nick) : isP ? '🙂 ' + esc(label) : s === this.STEPS ? '🏠 HOME' : '') + '</div>';
    }
    return '<div class="ch-board">' + rows + '</div>';
  },
  /* The Final Chase track: your steps in gold, the Chaser eating into them */
  track(target, got, mode) {
    const cells = mode === 'run' ? Math.max(target + 4, 16) : Math.max(target, 1);
    let html = '';
    for (let i = 0; i < cells; i++) {
      const cls = mode === 'run' ? (i < target ? ' you' : '') : (i < got ? ' chs' : ' you');
      html += '<div class="ch-cell' + cls + '">' + (mode === 'chase' && i === cells - 1 ? '🏁' : '') + '</div>';
    }
    return '<div class="ch-track">' + html + '</div>';
  },
  /* reveal: { p: player's pick, c: chaser's pick, show: 'p' | 'pc' | 'all' } */
  qHtml(q, reveal) {
    const show = reveal ? (reveal.show || 'all') : '';
    return '<div class="ch-q"><div class="muted">' + esc(CHASE_CATS[q.c] || '') + '</div><div class="ch-qt">' + esc(q.q) + '</div>' +
      '<div class="ch-opts">' + q.opts.map((o, i) => {
        let cls = '';
        if (show === 'all') {
          if (i === q.correct) cls = ' right';
          else if (reveal.p === i || reveal.c === i) cls = ' wrong';
        } else if (show && (reveal.p === i || (show === 'pc' && reveal.c === i))) cls = ' picked';
        const tags = reveal ? (reveal.p === i ? ' <b>🙂</b>' : '') + ((show === 'pc' || show === 'all') && reveal.c === i ? ' <b>' + this.chaser.emoji + '</b>' : '') : '';
        return '<div class="ch-opt' + cls + '">' + esc(o) + tags + '</div>';
      }).join('') + '</div></div>';
  },

  /* ================= THE ROUND ================= */
  async run(cfg) {
    this.active = true; this.lastTo = {}; this.qn = 0;
    this.chaser = this.pickChaser(cfg && cfg.chaser);
    this.level = (cfg && cfg.level) || store.get('chase_level') || 'normal';
    store.set('chase_level', this.level);
    const rec = this.record(); const r0 = rec[this.chaser.id] || { w: 0, l: 0, adj: 0 };
    this.adj = r0.adj || 0;
    this.bossBefore = this.bossUnlocked();
    this.buildPool();
    Quiz.roundGains = {};
    this.players = this.here();
    this.home = {};
    this.results = {};
    if (!this.players.length) { this.active = false; return false; }

    // ---- 1. reveal the Chaser
    const ch = this.chaser;
    const sorted = Object.entries(ch.skill).sort((a, b) => b[1] - a[1]);
    this.view(this.head() +
      '<p style="font-size:1.05rem">' + esc(ch.bio) + '</p>' +
      '<div class="ch-meta">' + (ch.age ? ch.age + ' · ' : '') + esc(ch.gender) + ' · 📍 ' + esc(ch.from) + ' · ⚡ ' + Math.round(ch.speed) + '/min · 😰 nerves ' + ch.nerves + '/10' +
      (r0.w + r0.l ? ' · record v you: won ' + r0.w + ', lost ' + r0.l : '') + '</div>' +
      '<div class="ch-skills">' + sorted.map(([k, v]) => '<div class="ch-sk"><span>' + CHASE_CATS[k] + '</span><i style="width:' + v + '%"></i></div>').join('') + '</div>');
    this.sendAll({ k: 'intro', id: ch.id, nick: ch.nick, name: ch.name, bio: ch.bio, emoji: ch.emoji, colour: ch.colour,
      strong: sorted.slice(0, 3).map(x => CHASE_CATS[x[0]]), weak: sorted.slice(-3).map(x => CHASE_CATS[x[0]]) });
    $('nightStatus').textContent = '⛓️ The Chase — tonight\'s Chaser is ' + ch.nick + '.';
    ChaseMusic.sting('reveal');
    await this.sleep(1200);
    await this.say('Welcome to The Chase. Tonight\'s Chaser is... ' + ch.nick + '!');
    await this.sleep(800);
    await this.taunt(ch.lines.intro);
    await this.say(ch.nick + ' is strongest on ' + CHASE_CATS[sorted[0][0]] + ' and ' + CHASE_CATS[sorted[1][0]] +
      ', and weakest on ' + CHASE_CATS[sorted[sorted.length - 1][0]] + '. Pray for those.');
    await this.sleep(2500);

    // ---- 2. each player: cash builder, offer, head to head
    // by index, re-reading the list each turn: a phone that reconnects comes
    // back on a new id, and Host swaps it into this.players
    for (let i = 0; i < this.players.length; i++) {
      if (!this.active) break;
      const id = await this.waitFor(i);
      if (!id) continue;
      const cash = await this.cashBuilder(id);
      if (!this.active) break;
      const offer = await this.offer(id, cash);
      if (!this.active) break;
      await this.headToHead(id, offer);
    }

    // ---- 3. final chase
    if (this.active) await this.finalChase();
    return this.finish();
  },

  /* Nothing starts until the people involved say they're ready — someone
     might be at the door. Phones get an "I'm ready" button; the laptop has
     a Start button as an override. */
  async gate(who, label, line) {
    if (!this.active) return;
    this.ready = new Set();
    this.gateWho = new Set(who.filter(id => Host.isPresent(Host.players[id])));
    const names = [...this.gateWho].map(id => this.nameOf(id)).join(' and ');
    const draw = () => this.view(this.head() + '<div class="ch-title">⏸ ' + esc(label) + '</div>' +
      '<div class="muted" style="font-size:1.1rem">Waiting for ' + esc(names) + ' to press <b>I\'m ready</b> on ' + (this.gateWho.size > 1 ? 'their phones' : 'their phone') +
      ' (' + this.ready.size + ' of ' + this.gateWho.size + ')</div>' +
      '<button class="btn big green mt" onclick="Chase.goNow()">▶ Start now</button>');
    draw();
    Object.keys(Host.players).forEach(id => this.send(id, this.gateWho.has(id)
      ? { k: 'ready', label, text: line || '' }
      : { k: 'wait', text: '⏸ ' + label + ' — waiting for ' + names }));
    await this.say(names + ', press ready.');
    this.gateDraw = draw;
    while (this.active && this.gateWho && [...this.gateWho].some(id => !this.ready.has(id) && Host.isPresent(Host.players[id]))) await this.sleep(200);
    this.gateWho = null; this.gateDraw = null;
  },
  /* Whose turn it is, once their phone is actually there. A phone that has
     gone to sleep while someone else played used to be skipped without a
     word, straight to the final chase. Now the laptop waits and says why,
     with a Skip button for anyone who really has gone home. */
  async waitFor(i, what) {
    let id = this.players[i];
    if (Host.isPresent(Host.players[id])) return id;
    this.skipTurn = false;
    const name = this.nameOf(id);
    this.view(this.head() + '<div class="ch-title">⏸ ' + (what ? 'Waiting for ' + esc(name) + ' — ' + esc(what) : esc(name) + '\'s turn') + '</div>' +
      '<div class="muted" style="font-size:1.15rem">' + esc(name) + '\'s phone has gone to sleep. Unlock it and open Buzz Night — it reconnects on its own.</div>' +
      '<button class="btn ghost mt" onclick="Chase.skipTurn=true">Skip ' + esc(name) + '</button>');
    $('nightStatus').textContent = '⛓️ The Chase — waiting for ' + name + '\'s phone.';
    this.say(name + ', it\'s your turn. Wake your phone up!');
    while (this.active && !this.skipTurn) {
      id = this.players[i];
      if (Host.isPresent(Host.players[id])) return id;
      await this.sleep(500);
    }
    return null;
  },
  /* The rules get explained the first time on this laptop; after that just
     the name of the stage. Hearing the cash builder explained twice a game
     was most of the gap between turns. */
  firstTime(k) {
    let t = {}; try { t = JSON.parse(store.get('chase_told') || '{}') || {}; } catch (e) {}
    if (t[k]) return false;
    t[k] = 1; store.set('chase_told', JSON.stringify(t)); return true;
  },
  readyUp(id) { if (this.gateWho && this.gateWho.has(id)) { this.ready.add(id); if (this.gateDraw) this.gateDraw(); } },
  goNow() { this.gateWho = null; },

  /* a visible, spoken 3-2-1 so nobody is caught cold */
  async countIn(label) {
    for (const n of ['3', '2', '1']) {
      this.view(this.head() + '<div class="ch-title">' + esc(label) + '</div><div class="ch-big" style="font-size:5rem">' + n + '</div>');
      await this.speak(n, 'host');
      await this.sleep(350);
    }
  },

  /* ---------- Cash Builder ---------- */
  async cashBuilder(id) {
    const name = this.nameOf(id);
    let right = 0, asked = 0;
    this.view(this.head() + '<div class="ch-title">💷 ' + esc(name) + '\'s Cash Builder</div><div class="muted" style="font-size:1.1rem">60 seconds. £1,000 for every right answer.</div>');
    this.sendAll({ k: 'wait', text: name + ' is up next in the Cash Builder…' });
    await this.gate([id], name + '\'s Cash Builder', '60 seconds. £1,000 for every right answer.');
    if (!this.active) return 0;
    await this.say(this.firstTime('cash') ? name + ', it\'s your Cash Builder. Sixty seconds, a thousand pounds for every right answer. Answer on your phone.' : name + '\'s Cash Builder.');
    await this.sleep(400);
    await this.countIn('💷 ' + name + '\'s Cash Builder');
    ChaseMusic.start('cash');
    const end = Date.now() + this.CASH_SECS * 1000 * this.timeScale;
    const left = () => Math.max(0, Math.ceil((end - Date.now()) / 1000 / this.timeScale));
    const show = (q, rv) => this.view(this.head() + '<div class="ch-title">💷 ' + esc(name) + '\'s Cash Builder</div>' +
      '<div class="ch-final"><div><div class="muted">Banked</div><div class="ch-big">' + this.money(right * this.CASH_PER) + '</div></div>' +
      '<div><div class="muted">Clock</div><div class="ch-big' + (left() <= 10 ? ' ch-hot' : '') + '">' + left() + 's</div></div></div>' +
      (q ? this.qHtml(q, rv) : ''));
    const clock = setInterval(() => { ChaseMusic.setUrgent(left() <= 10); const t = document.querySelector('#chaseHost .ch-final > div:nth-child(2) .ch-big'); if (t) { t.textContent = left() + 's'; t.classList.toggle('ch-hot', left() <= 10); } }, 250);
    while (this.active && Date.now() < end) {
      const q = this.take(() => true, null, this.mix('main'));
      asked++;
      show(q);
      const p = this.put([id], q, 'one', { cash: true, total: right * this.CASH_PER, right, left: (end - Date.now()) / 1000, secs: this.CASH_SECS * this.timeScale });
      this.startClock(Math.max(0.5, (end - Date.now()) / 1000 / this.timeScale));
      this.speak(this.readQ(q, false), 'host', false);
      const ans = await p;
      if (!this.active) break;
      const ok = ans[id] === q.correct;
      if (ok) right++;
      if (ans[id] == null) break;           // time ran out on this one
      show(q, { p: ans[id], show: 'all' });
      this.send(id, { k: 'fb', ok, answer: q.a, total: right * this.CASH_PER, right, left: (end - Date.now()) / 1000, secs: this.CASH_SECS * this.timeScale });
      await this.sleep(700);                // see whether it was right before the next
    }
    clearInterval(clock);
    ChaseMusic.stop(); ChaseMusic.sting('timeup');
    const cash = right * this.CASH_PER;
    this.results[id] = { right, asked, cash };
    this.view(this.head() + '<div class="ch-title">⏱ Time\'s up!</div><div class="ch-big">' + this.money(cash) + '</div><div class="muted" style="font-size:1.1rem">' + right + ' right out of ' + asked + '</div>');
    this.sendAll({ k: 'wait', text: name + ' banked ' + this.money(cash) + ' in the Cash Builder' });
    await this.sleep(800);
    await this.say('Time\'s up! ' + name + ', ' + right + ' right. That\'s ' + this.pounds(cash) + '.');
    await this.sleep(900);
    return cash;
  },

  /* ---------- the offer ---------- */
  async offer(id, cash) {
    const name = this.nameOf(id);
    const high = Math.max(cash * 3, 5000), low = Math.max(Math.round(cash * 0.3 / 500) * 500, 500);
    const offers = {
      high: { start: 2, money: high, label: 'High offer', note: '2 steps ahead of me' },
      mid:  { start: 3, money: cash, label: 'Your cash', note: '3 steps ahead' },
      low:  { start: 4, money: low, label: 'Low offer', note: '4 steps ahead — easier' }
    };
    this.view(this.head() + '<div class="ch-title">' + esc(name) + ', here are my offers</div>' +
      Object.values(offers).map(o => '<div class="ch-offer"><b>' + this.money(o.money) + '</b> — ' + o.label + ' (' + o.note + ')</div>').join(''));
    this.sendAll({ k: 'wait', text: this.chaser.nick + ' is making ' + name + ' an offer…' });
    await this.taunt(name + ', you can play for your ' + this.pounds(cash) + '. Or take ' + this.pounds(low) + ', and start further from me. Or... be brave, and play for ' + this.pounds(high) + '.');
    let pick = null;
    this.offerFor = { id, set: p => { pick = p; } };
    this.sendAll({ k: 'wait', text: name + ' is choosing an offer…' });
    this.send(id, { k: 'offer', offers: Object.entries(offers).map(([k, o]) => ({ k, money: this.money(o.money), label: o.label, note: o.note })) });
    const until = Date.now() + 45000 * this.timeScale;
    while (this.active && !pick && Date.now() < until) await this.sleep(150);
    this.offerFor = null;
    const o = offers[pick] || offers.mid;
    await this.say(name + ' is playing for ' + this.pounds(o.money) + '.');
    if (pick === 'high') await this.taunt('Brave. Or foolish. We\'ll see.');
    await this.sleep(600);
    return o;
  },
  offerPick(id, k) { if (this.offerFor && this.offerFor.id === id) this.offerFor.set(k); },

  /* ---------- Head to head ---------- */
  async headToHead(id, offer) {
    const name = this.nameOf(id);
    let p = offer.start, c = 0;
    const draw = (q, rv, line) => this.view(this.head() + '<div class="ch-title">' + esc(name) + ' playing for ' + this.money(offer.money) + '</div>' +
      '<div class="ch-h2h">' + this.board(p, c, name) + '<div style="flex:1">' + (q ? this.qHtml(q, rv) : '') + (line || '') + '</div></div>');
    await this.gate([id], name + ' — head to head', 'Playing for ' + this.money(offer.money) + '. Get home before you are caught.');
    if (!this.active) return;
    draw(null, null, '<div class="ch-title">Head to head!</div>');
    await this.say(this.firstTime('h2h') ? 'Head to head. ' + name + ', get home before ' + this.chaser.nick + ' catches you.' : 'Head to head, ' + name + '.');
    await this.sleep(400);
    let n = 0;
    while (this.active && p < this.STEPS && c < p) {
      n++;
      // a notch harder for the last two steps before home
      const m0 = this.mix('main'), nearHome = p >= this.STEPS - 2;
      const q = this.take(x => !x.soft, null, nearHome ? [m0[0] / 2, m0[1], m0[2] + m0[0] / 2 + 10] : m0);
      draw(q, null, '<div class="ch-timer">🎙 Question ' + n + ' — ' + esc(CHASE_CATS[q.c] || '') + '</div>');
      const ansP = this.put([id], q, 'one', { h2h: { p, c, steps: this.STEPS, money: this.money(offer.money), name, chaser: this.chaser.emoji, nick: this.chaser.nick, colour: this.chaser.colour } });
      await this.say('Question ' + n + ', ' + (CHASE_CATS[q.c] || '') + '. ' + this.readQ(q, true));
      if (!this.active) break;
      draw(q, null, '<div class="ch-timer">⏱ ' + this.H2H_SECS + ' seconds to answer · ' + this.chaser.emoji + ' is thinking…</div>');
      this.startClock(this.H2H_SECS);
      const ans = await ansP;
      if (!this.active) break;
      const pressure = p >= this.STEPS - 1 ? 1 : 0;
      const cRight = this.chaserAnswers(q, pressure, 'h2h');
      const cPick = cRight ? q.correct : [0, 1, 2].filter(i => i !== q.correct)[Math.floor(Math.random() * 2)];
      const pRight = ans[id] === q.correct;
      // the reveal, one beat at a time
      draw(q, { p: ans[id], show: 'p' }, '<div class="ch-timer">' + esc(name) + ' said…</div>');
      await this.say(ans[id] == null ? name + ' ran out of time.' : name + ' said ' + q.opts[ans[id]] + '.');
      await this.sleep(400);
      draw(q, { p: ans[id], c: cPick, show: 'pc' }, '<div class="ch-timer">' + esc(this.chaser.nick) + ' said…</div>');
      await this.say(this.chaser.nick + ' said ' + q.opts[cPick] + '.');
      await this.sleep(500);
      draw(q, { p: ans[id], c: cPick, show: 'all' }, '<div class="ch-timer">The right answer is…</div>');
      await this.say('And the right answer is... ' + q.a + '.');
      if (pRight) p++;
      if (cRight) c++;
      draw(q, { p: ans[id], c: cPick, show: 'all' }, '<div class="ch-title">' + (pRight ? '✅ ' : '❌ ') + esc(name) + ' &nbsp; ' +
        (cRight ? '✅ ' : '❌ ') + esc(this.chaser.nick) + '</div>');
      this.sendAll({ k: 'h2hResult', name, right: pRight, chaserRight: cRight, answer: q.a, p, c, steps: this.STEPS, money: this.money(offer.money), chaser: this.chaser.emoji, nick: this.chaser.nick, colour: this.chaser.colour, moved: { p: pRight, c: cRight } });
      if (!cRight && Math.random() < 0.6) await this.taunt(this.chaser.lines.wrong);
      await this.sleep(1200);
    }
    if (!this.active) return;
    if (p >= this.STEPS) {
      this.home[id] = offer.money;
      Quiz.roundGains[id] = (Quiz.roundGains[id] || 0) + 10;
      Host.players[id].score += 10;
      ChaseMusic.sting('home');
      this.view(this.head() + '<div class="ch-big">🏠 ' + esc(name) + ' is HOME!</div><div class="ch-title">' + this.money(offer.money) + ' goes into the Final Chase (+10 points)</div>');
      this.sendAll({ k: 'wait', text: '🏠 ' + name + ' got home with ' + this.money(offer.money) + '!' });
      await this.say(name + ' is home! ' + this.pounds(offer.money) + ' goes through to the final chase.');
    } else {
      ChaseMusic.sting('caught');
      this.view(this.head() + '<div class="ch-big">⛓️ Caught!</div><div class="ch-title">' + esc(name) + ' is out</div>');
      this.sendAll({ k: 'wait', text: '⛓️ ' + name + ' was caught by ' + this.chaser.nick });
      await this.sleep(1200);
      await this.taunt(this.chaser.lines.catch);
    }
    Host.renderScores();
    await this.sleep(3500);
  },

  /* ---------- Final Chase ---------- */
  async finalChase() {
    /* Everyone who got home is in the final, and their money is in the pot,
       whether or not their phone happens to be awake this second. Dropping
       a sleeping phone used to take its winnings out of the pot and its
       player out of the points. Wait for them instead (Skip if they've gone),
       and a skipped player still shares the result. */
    let team = Object.keys(this.home).filter(id => Host.players[id]);
    let pot = team.reduce((s, id) => s + this.home[id], 0);
    for (const id of team.slice()) {
      if (Host.isPresent(Host.players[id])) continue;
      const i = this.players.indexOf(id);
      if (i >= 0) { const got = await this.waitFor(i, 'the Final Chase'); if (got && got !== id) team = team.map(x => x === id ? got : x); }
      if (!this.active) return;
    }
    let lazarus = false;
    if (!team.length) {
      team = this.players.filter(id => Host.isPresent(Host.players[id]));
      pot = this.LAZARUS_POT; lazarus = true;
    }
    if (!team.length) return;
    this.finalTeam = team; this.pot = pot;
    const names = team.map(id => this.nameOf(id)).join(' and ');
    this.view(this.head() + '<div class="ch-big">🏁 FINAL CHASE</div><div class="ch-title">' + esc(names) + ' playing for ' + this.money(pot) +
      (lazarus ? ' — nobody got home, so this is a second chance' : '') + '</div><div class="muted" style="font-size:1.1rem">Two minutes. Answer on your phones — the first right answer moves you a step. One step head start for each player.</div>');
    this.sendAll({ k: 'wait', text: '🏁 Final Chase for ' + this.money(pot) + ' — get ready!' });
    await this.say(lazarus ? 'Nobody made it home, so you get one last chance, for ' + this.pounds(pot) + '.' : 'The final chase. ' + names + ', playing for ' + this.pounds(pot) + '.');
    if (this.firstTime('final')) await this.say('You have two minutes. The questions are on your phones, not read out, so go as fast as you can. The first right answer moves you on a step. You start with ' + team.length + (team.length === 1 ? ' step.' : ' steps.'));
    await this.gate(team, 'The Final Chase', 'Two minutes. Questions on your phones — go fast!');
    if (!this.active) return;
    await this.countIn('🏁 Final Chase');

    // --- the team's run
    let target = team.length;            // head start
    const end = Date.now() + this.FINAL_SECS * 1000 * this.timeScale;
    const secsLeft = () => Math.max(0, Math.ceil((end - Date.now()) / 1000 / this.timeScale));
    ChaseMusic.start('final');
    const clock = setInterval(() => { ChaseMusic.setUrgent(secsLeft() <= 10); const t = document.querySelector('#chaseHost .ch-clock'); if (t) { t.textContent = secsLeft() + 's'; t.classList.toggle('ch-hot', secsLeft() <= 10); } }, 250);
    while (this.active && Date.now() < end) {
      // short, sharp and not read out: the point is to get through as many as you can
      // medium and hard only — the easy ones let a pair of you rattle off 29
      const q = this.take(x => !x.soft && x.q.length <= 100, x => !x.soft, this.mix('final'));
      this.view(this.head() + '<div class="ch-final"><div><div class="muted">Your steps</div><div class="ch-big">' + target + '</div></div>' +
        '<div><div class="muted">Clock</div><div class="ch-big ch-clock">' + secsLeft() + 's</div></div></div>' + this.track(target, 0, 'run') + this.qHtml(q));
      const pr = this.put(team, q, 'buzz', { final: true, target });
      this.startClock(Math.min(8, Math.max(0.5, (end - Date.now()) / 1000 / this.timeScale)));
      const ans = await pr;
      if (!this.active) break;
      const ok = team.some(id => ans[id] === q.correct);
      const wrong = !ok && Object.keys(ans).length > 0;
      if (ok) target++;
      this.view(this.head() + '<div class="ch-final"><div><div class="muted">Your steps</div><div class="ch-big">' + target + '</div></div>' +
        '<div><div class="muted">Clock</div><div class="ch-big ch-clock">' + secsLeft() + 's</div></div></div>' + this.track(target, 0, 'run') + this.qHtml(q, { show: 'all' }) +
        (wrong ? '<div class="ch-title">❌ Wrong — 2 second freeze</div>' : ''));
      // a wrong answer costs time, as a pass does on the telly — no point
      // jabbing at a guess to get to the next one
      if (wrong) { team.forEach(id => this.send(id, { k: 'wait', text: '❌ Wrong — 2 second freeze' })); await this.sleep(2000); }
      else await this.sleep(250);
    }
    clearInterval(clock);
    if (!this.active) return;
    ChaseMusic.stop(); ChaseMusic.sting('timeup');
    this.view(this.head() + '<div class="ch-big">🎯 Target: ' + target + '</div><div class="ch-title">' + esc(this.chaser.nick) + ' has two minutes to catch you</div>');
    this.sendAll({ k: 'wait', text: '🎯 You set ' + target + '. Now ' + this.chaser.nick + ' chases — be ready for pushbacks!' });
    await this.sleep(1500);
    await this.say('Time\'s up! You\'ve set a target of ' + target + '. ' + this.chaser.nick + ' needs ' + target + ' right answers in two minutes to catch you.');
    if (this.firstTime('push')) await this.say('If the Chaser gets one wrong, you get a pushback on your phones. Get it right and you push them back a step.');
    await this.gate(team, this.chaser.nick + '\'s chase', 'Be ready for pushbacks on your phone.');
    if (!this.active) return;
    await this.countIn('⛓️ ' + this.chaser.nick + '\'s chase');

    // --- the Chaser's run, with pushbacks. A real clock: it ticks while the
    // Chaser is answering and stops dead for a pushback, as on the telly.
    // It used to drop in five-second lumps, one per question, so it never
    // looked like a clock at all.
    let got = 0, pushes = 0, used = 0, runFrom = 0;
    // quicker in the final than in head to heads, as on the telly
    const per = 60000 / (this.chaser.speed * this.FINAL_PACE);
    const total = this.FINAL_SECS * 1000;
    const usedNow = () => used + (runFrom ? (Date.now() - runFrom) / this.timeScale : 0);
    const leftMs = () => Math.max(0, total - usedNow());
    const leftS = () => Math.ceil(leftMs() / 1000);
    const run = () => { if (!runFrom) runFrom = Date.now(); };
    const halt = () => { if (runFrom) { used += (Date.now() - runFrom) / this.timeScale; runFrom = 0; } };
    const draw = (q, rv, note) => this.view(this.head() + '<div class="ch-final"><div><div class="muted">Target</div><div class="ch-big">' + target + '</div></div>' +
      '<div><div class="muted">' + esc(this.chaser.nick) + '</div><div class="ch-big" style="color:var(--cc);filter:brightness(1.5)">' + got + '</div></div>' +
      '<div><div class="muted">Clock' + (runFrom ? '' : ' ⏸') + '</div><div class="ch-big ch-clock' + (leftMs() <= 10000 ? ' ch-hot' : '') + '">' + leftS() + 's</div></div></div>' +
      this.track(target, got, 'chase') + '<div class="ch-timer" style="text-align:center">' + esc(this.chaser.nick) + ' needs ' + Math.max(0, target - got) + ' more to catch you</div>' +
      (note || '') + (q ? this.qHtml(q, rv) : ''));
    const tick = setInterval(() => {
      const t = document.querySelector('#chaseHost .ch-clock');
      if (t) { t.textContent = leftS() + 's'; t.classList.toggle('ch-hot', leftMs() <= 10000); }
      ChaseMusic.setUrgent(!!runFrom && leftMs() <= 10000);
    }, 100);
    // the phones get the same track, and count the clock down themselves
    const trackOut = (note) => this.sendAll({ k: 'track', target, got, nick: this.chaser.nick, emoji: this.chaser.emoji, colour: this.chaser.colour,
      leftMs: leftMs(), running: !!runFrom, note: note || '' });
    ChaseMusic.start('chaser');
    trackOut();
    while (this.active && leftMs() > 0 && got < target) {
      const q = this.take(x => !x.soft, null, this.mix('final'));
      const pressure = target - got <= 2 ? 1 : 0;
      const hit = this.chaserAnswers(q, pressure, 'final');
      const cPick = hit ? q.correct : [0, 1, 2].filter(i => i !== q.correct)[Math.floor(Math.random() * 2)];
      run(); draw(q); trackOut();
      // the Chaser answers at their own pace while the question is read; a
      // long question gets cut off when they buzz in
      this.say(q.q);
      const thinkUntil = Date.now() + Math.max(1800, per - 1200) * this.timeScale;
      while (this.active && Date.now() < thinkUntil && leftMs() > 0) await this.sleep(50);
      try { speechSynthesis.cancel(); } catch (e) {}
      if (!this.active || leftMs() <= 0) break;         // time up mid-question: doesn't count
      await this.taunt(q.opts[cPick]);
      if (hit) { got++; draw(q, { c: cPick, show: 'all' }); trackOut(); await this.sleep(400); continue; }

      // pushback: the clock stops until it's settled
      halt();
      draw(q, { c: cPick, show: 'all' }, '<div class="ch-title">❌ Wrong! PUSHBACK — clock stopped</div>');
      trackOut('Pushback coming!');
      ChaseMusic.duck(true);
      await this.say('Wrong! Pushback!');
      const pq = this.take(x => x.c === q.c && !x.soft, x => !x.soft, this.mix('final'));
      draw(pq, null, '<div class="ch-title">⏪ PUSHBACK — clock stopped, answer on your phones</div>');
      const pr = this.put(team, pq, 'buzz', { pushback: true });
      await this.say(this.readQ(pq, true));
      this.startClock(this.PUSH_SECS);
      const ans = await pr;
      if (!this.active) break;
      const ok = team.some(id => ans[id] === pq.correct);
      const pushed = ok && got > 0;
      if (pushed) { got--; pushes++; }
      const line = pushed ? '✅ Pushed back!' : ok ? '✅ Right — but nothing to push back yet' : '❌ No pushback — it was ' + pq.a;
      draw(pq, { show: 'all' }, '<div class="ch-title">' + esc(line) + '</div>');
      // clear EVERY phone straight away — one of you answering used to leave
      // the other still looking at the pushback while the Chaser carried on
      trackOut(line);
      await this.say(pushed ? 'Yes! Pushed back!' : ok ? 'Right, but there was nothing to push back yet.' : 'No pushback. The answer was ' + pq.a + '.');
      ChaseMusic.duck(false);
      await this.sleep(800);
    }
    halt(); clearInterval(tick);
    ChaseMusic.stop();
    if (!this.active) return;
    const caught = got >= target;
    const r = this.record(); const cr = r[this.chaser.id] = r[this.chaser.id] || { w: 0, l: 0, adj: 0 };
    if (caught) {
      cr.w++; cr.adj = Math.max(-8, (cr.adj || 0) - 2);
      ChaseMusic.sting('caught');
      this.view(this.head() + '<div class="ch-big">⛓️ CAUGHT</div><div class="ch-title">' + esc(this.chaser.nick) + ' caught you with ' + Math.max(0, Math.round((total - used) / 1000)) + ' seconds to spare</div>');
      this.sendAll({ k: 'end', win: false, text: '⛓️ ' + this.chaser.nick + ' caught you. The ' + this.money(pot) + ' is gone!' });
      await this.sleep(1500);
      await this.taunt(this.chaser.lines.catch);
      await this.say(this.chaser.nick + ' caught you, with ' + Math.max(0, Math.round((total - used) / 1000)) + ' seconds to spare. The ' + this.pounds(pot) + ' is gone.');
    } else {
      cr.l++; cr.adj = Math.min(6, (cr.adj || 0) + 2);
      // pot → game points, capped so one Chase can't swamp a whole night
      const each = Math.min(150, 30 + Math.round(pot / 1000));
      team.forEach(id => { Host.players[id].score += each; Quiz.roundGains[id] = (Quiz.roundGains[id] || 0) + each; });
      ChaseMusic.sting('win');
      this.view(this.head() + '<div class="ch-big">🎉 YOU BEAT THE CHASER!</div><div class="ch-title">' + this.money(pot) + ' — ' + each + ' points each to ' + esc(names) + '</div>');
      this.sendAll({ k: 'end', win: true, text: '🎉 You beat ' + this.chaser.nick + '! ' + each + ' points each.' });
      await this.sleep(1800);
      await this.say('Time\'s up! You beat ' + this.chaser.nick + ', with ' + (target - got) + (target - got === 1 ? ' step' : ' steps') + ' to spare! ' + each + ' points each.');
      await this.taunt(this.chaser.lines.lose);
      if (!this.bossBefore && this.bossUnlocked()) { await this.sleep(1000); await this.say('You have now beaten every Chaser. Next time... The Boss is waiting.'); }
    }
    this.saveRecord(r);
    Host.renderScores(); Host.saveGame();
    await this.sleep(5000);
  },

  async finish() {
    this.active = false;
    ChaseMusic.stop(true);
    if (this.cur) this.settle();
    if (this.used && this.used.length) Seen.mark('chase', this.used);
    Host.snapshotRound('The Chase');
    Host.pushBoard();
    setTimeout(() => { const el = $('chaseHost'); if (el && !this.active) el.classList.add('hidden'); }, 12000);
    return true;
  },
  stop() { this.active = false; ChaseMusic.stop(true); try { speechSynthesis.cancel(); } catch (e) {} if (this.cur) this.settle(); }
};

const ChasePhone = {
  /* ---- Cash Builder graphics: a growing pile of £1,000 notes, the total,
     and a draining clock bar ---- */
  css() {
    if (this._css) return; this._css = true;
    const st = document.createElement('style');
    st.textContent = '.cb{background:linear-gradient(160deg,#123d24,#0b2416);border-radius:14px;padding:10px;margin-bottom:8px;position:relative;overflow:hidden}' +
      '.cb-total{font-size:2.4rem;font-weight:900;color:#7dffa8;font-variant-numeric:tabular-nums;line-height:1}' +
      '.cb-sub{font-size:.8rem;opacity:.8;margin-bottom:6px}' +
      '.cb-pile{display:flex;flex-wrap:wrap-reverse;justify-content:center;gap:3px;min-height:34px;max-width:280px;margin:6px auto}' +
      '.cb-note{width:38px;height:20px;border-radius:3px;background:linear-gradient(90deg,#3fa463,#6fd28f 50%,#3fa463);border:1px solid #1d5c33;font-size:.6rem;font-weight:800;color:#0b3a1c;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 0 #0a2a15}' +
      '.cb-note.new{animation:cbDrop .5s ease-out}' +
      '@keyframes cbDrop{0%{transform:translateY(-60px) rotate(-12deg);opacity:0}70%{transform:translateY(4px)}100%{transform:none;opacity:1}}' +
      '.cb-bar{height:10px;border-radius:5px;background:rgba(255,255,255,.15);overflow:hidden;margin-top:6px}' +
      '.cb-bar i{display:block;height:100%;background:#7dffa8;transition:width .25s linear}' +
      '.cb-bar.hot i{background:#ff5a5a}' +
      '.cb-time{font-weight:800;font-size:.95rem;margin-top:3px}' +
      '.cb-pop{position:absolute;right:12px;top:8px;font-size:1.5rem;font-weight:900;color:#ffd257;animation:cbPop 1s ease-out forwards}' +
      '@keyframes cbPop{0%{transform:scale(.6);opacity:0}25%{transform:scale(1.25);opacity:1}100%{transform:translateY(-30px);opacity:0}}';
    document.head.appendChild(st);
  },
  cashHtml(msg, pop) {
    this.css();
    const n = msg.right || 0;
    const shown = Math.min(n, 24);
    const notes = Array.from({ length: shown }, (_, i) => '<div class="cb-note' + (pop && i === shown - 1 ? ' new' : '') + '">£1K</div>').join('') +
      (n > shown ? '<div class="cb-note" style="width:auto;padding:0 4px">+' + (n - shown) + '</div>' : '');
    return '<div class="cb">' + (pop ? '<div class="cb-pop">+£1,000!</div>' : '') +
      '<div class="cb-sub">💷 YOUR CASH BUILDER</div><div class="cb-total">' + esc(Chase.money(msg.total || 0)) + '</div>' +
      '<div class="cb-pile">' + (notes || '<span style="opacity:.6;font-size:.85rem">Every right answer adds £1,000 to the pile</span>') + '</div>' +
      '<div class="cb-bar"><i id="cbBar"></i></div><div class="cb-time" id="cbTime"></div></div>';
  },
  /* ---- Head to head: the board, you, the Chaser closing in ---- */
  boardHtml(b, moved) {
    this.css();
    if (!this._bcss) {
      this._bcss = true;
      const st = document.createElement('style');
      st.textContent = '.hb{background:rgba(0,0,0,.25);border-radius:14px;padding:8px;margin-bottom:8px}' +
        '.hb-top{display:flex;justify-content:space-between;font-weight:800;font-size:.9rem;margin-bottom:6px}' +
        '.hb-rows{display:flex;flex-direction:column;gap:3px}' +
        '.hb-step{height:22px;border-radius:7px;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.85rem}' +
        '.hb-step.home{background:rgba(95,214,139,.3)}' +
        '.hb-step.you{background:#ffd257;color:#241a04}.hb-step.ch{color:#120f2b}' +
        '.hb-step.gap{background:rgba(255,90,90,.12)}' +
        '.hb-step.mv{animation:hbMv .6s ease-out}' +
        '@keyframes hbMv{0%{transform:scale(1.15);filter:brightness(1.8)}100%{transform:none}}' +
        '.hb-note{font-size:.85rem;margin-top:6px;font-weight:700}';
      document.head.appendChild(st);
    }
    let rows = '';
    for (let st = 0; st <= b.steps; st++) {
      const you = st === b.p, ch = st === b.c, home = st === b.steps;
      const between = st > b.c && st < b.p;
      rows += '<div class="hb-step' + (you ? ' you' : '') + (ch ? ' ch' : '') + (home && !you ? ' home' : '') + (between ? ' gap' : '') +
        ((moved && ((you && moved.p) || (ch && moved.c))) ? ' mv' : '') + '"' + (ch ? ' style="background:' + b.colour + '"' : '') + '>' +
        (ch ? b.chaser + ' ' + esc(b.nick) : you ? '🙂 ' + esc(b.name) + ' · ' + esc(b.money) : home ? '🏠 HOME' : '') + '</div>';
    }
    const toHome = b.steps - b.p, lead = b.p - b.c;
    return '<div class="hb"><div class="hb-top"><span>⛓️ Head to head</span><span>' + esc(b.money) + '</span></div><div class="hb-rows">' + rows + '</div>' +
      '<div class="hb-note">' + (toHome <= 0 ? '🏠 Home!' : lead <= 0 ? '⛓️ Caught!' : toHome + ' to get home · ' + lead + ' step' + (lead === 1 ? '' : 's') + ' ahead of ' + esc(b.nick)) + '</div></div>';
  },
  trackHtml(target, got, mode, colour) {
    const cells = mode === 'run' ? Math.max(target + 4, 16) : Math.max(target, 1);
    let h = '';
    for (let i = 0; i < cells; i++) {
      const c = mode === 'run' ? (i < target ? '#ffd257' : 'rgba(255,255,255,.1)') : (i < got ? colour : '#ffd257');
      h += '<div style="flex:1;height:22px;border-radius:4px;background:' + c + ';filter:' + (mode !== 'run' && i < got ? 'brightness(1.3)' : 'none') + '"></div>';
    }
    return '<div style="display:flex;gap:2px;margin:6px 0">' + h + '</div>';
  },
  cashClock(msg) {
    clearInterval(this._cbT);
    if (msg.left == null) return;
    const end = Date.now() + msg.left * 1000, span = (msg.secs || 60) * 1000;
    const tick = () => {
      const ms = Math.max(0, end - Date.now());
      const bar = $('cbBar'), t = $('cbTime');
      if (!bar) { clearInterval(this._cbT); return; }
      bar.style.width = Math.min(100, ms / span * 100) + '%';
      bar.parentNode.classList.toggle('hot', ms <= 10000 * (span / 60000));
      t.textContent = '⏱ ' + Math.ceil(ms / 1000 * (60000 / span)) + 's left';
      if (!ms) clearInterval(this._cbT);
    };
    tick(); this._cbT = setInterval(tick, 200);
  },
  box() { return $('chaseBox'); },
  show(html) { const b = this.box(); b.innerHTML = '<div class="card" style="text-align:center">' + html + '</div>'; b.classList.remove('hidden'); },
  on(msg) {
    Player.hideExtras && ['roundCard', 'revealBox', 'raceBox'].forEach(x => { const e = $(x); if (e) e.classList.add('hidden'); });
    const k = msg.k;
    if (k === 'intro') {
      this.show(chaserPortrait(msg.id, 140) + '<div class="rc-name" style="color:' + msg.colour + ';filter:brightness(1.4)">' + msg.emoji + ' ' + esc(msg.nick) + '</div>' +
        '<div class="muted">' + esc(msg.name) + '</div><p style="font-size:.9rem">' + esc(msg.bio) + '</p>' +
        '<div style="font-size:.9rem"><b style="color:#5fd68b">Strong:</b> ' + msg.strong.map(esc).join(', ') + '<br><b style="color:#ff7a7a">Weak:</b> ' + msg.weak.map(esc).join(', ') + '</div>');
      return;
    }
    if (k === 'ready') {
      this.show('<div class="rc-kicker">⏸ ' + esc(msg.label) + '</div><div style="margin:8px 0">' + esc(msg.text) + '</div>' +
        '<button class="btn big green" style="width:100%;font-size:1.4rem" onclick="ChasePhone.send({type:\'chaseReady\'});ChasePhone.show(\'<div class=rc-name>✅ Ready — waiting…</div>\')">✅ I\'m ready</button>');
      Player.vibe && Player.vibe([60, 40, 60]); return;
    }
    if (k === 'track') {
      const need = Math.max(0, msg.target - msg.got);
      if (msg.leftMs != null) msg.left = Math.ceil(msg.leftMs / 1000);
      this.show('<div class="rc-kicker">' + esc(msg.emoji + ' ' + msg.nick) + ' is chasing you</div>' + this.trackHtml(msg.target, msg.got, 'chase', msg.colour) +
        '<div style="display:flex;justify-content:space-around;font-weight:800"><span>🎯 ' + msg.target + '</span><span style="color:' + msg.colour + ';filter:brightness(1.5)">' + esc(msg.nick) + ' ' + msg.got + '</span><span>⏱ <b id="chTrkClock">' + msg.left + '</b>s' + (msg.running ? '' : ' ⏸') + '</span></div>' +
        '<div class="rc-name" style="font-size:1.2rem;margin-top:8px">' + (need ? 'Needs ' + need + ' more to catch you' : '⛓️ Caught!') + '</div>' + (msg.note ? '<div class="rc-name" style="font-size:1.3rem">' + esc(msg.note) + '</div>' : '<div class="muted">Be ready for a pushback</div>'));
      clearInterval(this._trkT);
      if (msg.running && msg.leftMs != null) {
        const end = Date.now() + msg.leftMs;
        this._trkT = setInterval(() => { const e = document.getElementById('chTrkClock'); if (!e) return clearInterval(this._trkT); e.textContent = Math.max(0, Math.ceil((end - Date.now()) / 1000)); }, 200);
      }
      return;
    }
    if (k === 'fb') {
      this.show(this.cashHtml(msg, msg.ok) + '<div class="rc-name" style="font-size:1.5rem">' + (msg.ok ? '✅ Right!' : '❌ It was ' + esc(msg.answer)) + '</div>');
      this.cashClock(msg);
      if (msg.ok) Player.vibe && Player.vibe(40);
      return;
    }
    if (k === 'wait') { this.show('<div class="rc-name" style="font-size:1.2rem">' + esc(msg.text) + '</div>'); return; }
    if (k === 'end') { this.show('<div class="rc-name">' + esc(msg.text) + '</div>'); Player.vibe && Player.vibe(msg.win ? [80, 60, 80] : 200); return; }
    if (k === 'offer') {
      this.show('<div class="rc-kicker">Pick your offer</div>' + msg.offers.map(o =>
        '<button class="btn big' + (o.k === 'mid' ? ' green' : '') + '" style="width:100%;margin-top:8px" onclick="ChasePhone.send({type:\'chaseOffer\',pick:\'' + o.k + '\'});ChasePhone.show(\'<div class=rc-name>Locked in: ' + esc(o.money) + '</div>\')">' +
        esc(o.money) + '<br><small style="font-weight:600">' + esc(o.label) + ' — ' + esc(o.note) + '</small></button>').join(''));
      Player.vibe && Player.vibe(60); return;
    }
    if (k === 'cat') {
      this.show('<div class="rc-kicker">Choose your category</div><div class="muted">Pick the one the Chaser is weaker at!</div>' + msg.cats.map(c =>
        '<button class="btn big" style="width:100%;margin-top:10px" onclick="ChasePhone.send({type:\'chaseCat\',cat:\'' + c.k + '\'});ChasePhone.show(\'<div class=rc-name>' + esc(c.label) + '</div>\')">' + esc(c.label) + '</button>').join(''));
      Player.vibe && Player.vibe(60); return;
    }
    if (k === 'q') {
      if (!msg.mine) { this.show((msg.h2h ? this.boardHtml(msg.h2h) : '') + '<div class="muted">' + esc(msg.cat) + '</div><div class="rc-name" style="font-size:1.1rem">' + esc(msg.text) + '</div><div class="muted">Watching…</div>'); return; }
      this.qid = msg.qid;
      const head = msg.cash ? '' : msg.pushback ? '⏪ PUSHBACK — get it right to push them back' : msg.final ? '🏁 Final Chase · ' + msg.target + ' steps' : '⛓️ Head to head';
      this.show((msg.cash ? this.cashHtml(msg) : msg.h2h ? this.boardHtml(msg.h2h) : '<div class="rc-kicker">' + head + '</div>' + (msg.final ? this.trackHtml(msg.target, 0, 'run') : '')) + '<div class="muted">' + esc(msg.cat) + '</div><div class="rc-name" style="font-size:1.15rem;margin:8px 0">' + esc(msg.text) + '</div>' +
        msg.opts.map((o, i) => '<button class="btn big" style="width:100%;margin-top:8px;font-size:1.05rem" onclick="ChasePhone.pick(' + msg.qid + ',' + i + ',this)">' + esc(o) + '</button>').join(''));
      if (msg.cash) this.cashClock(msg); else clearInterval(this._cbT);
      return;
    }
    if (k === 'h2hResult') {
      this.show(this.boardHtml(msg, msg.moved) + '<div class="rc-name">' + (msg.right ? '✅' : '❌') + ' ' + esc(msg.name) + ' &nbsp; ' + (msg.chaserRight ? '✅' : '❌') + ' ' + esc(msg.nick) + '</div><div class="muted">Answer: ' + esc(msg.answer) + '</div>');
    }
  },
  pick(qid, i, btn) {
    if (qid !== this.qid) return;
    this.qid = null;
    this.send({ type: 'chaseAns', qid, i });
    btn.style.outline = '4px solid #ffd257';
    [...btn.parentNode.querySelectorAll('button')].forEach(b => b.disabled = true);
  },
  send(m) { try { Player.conn.send(m); } catch (e) {} }
};
