/* =====================================================================
   THE CHASE — you two against a computer Chaser.

   Flow: the Chaser is revealed → each player in turn plays a 60-second
   Cash Builder, picks an offer, then goes head to head (choosing between
   two categories each question) to get their money home → everyone who
   got home plays the Final Chase together → the Chaser chases their target,
   with pushbacks on every miss.

   The Chaser knows nothing: each answer is a dice roll against its hit rate
   for that category (chasers.js), nudged by difficulty, nerves and how it
   has done against you before.
   ===================================================================== */
const Chase = {
  active: false,
  timeScale: 1,              // tests shrink every wait
  CASH_SECS: 60,
  CASH_PER: 1000,
  STEPS: 8,                  // board: chaser starts at 0, home is 8
  H2H_SECS: 15,
  FINAL_SECS: 120,
  PUSH_SECS: 10,
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

  /* ---------- the Chaser's brain: a dice roll ---------- */
  hitRate(cat, diff, pressure) {
    const ch = this.chaser;
    let p = ch.skill[cat] != null ? ch.skill[cat] : 65;
    p += { e: 6, m: 0, h: -8 }[diff] || 0;
    p += this.adj || 0;                          // learns your league
    p -= (pressure || 0) * ch.nerves * 1.2;      // nerves when it matters
    return Math.max(15, Math.min(97, p));
  },
  chaserAnswers(q, pressure) { return Math.random() * 100 < this.hitRate(q.c, q.d, pressure); },

  /* ---------- questions ---------- */
  buildPool() {
    const own = (window.CHASE_Q || []).map(q => ({ ...q, seenKey: 'cq:' + q.id }));
    const old = (window.QUESTIONS || []).map(q => ({ id: q.id, q: q.q, a: q.a, w: q.w, c: this.CAT_MAP[q.cat] || q.cat,
      d: (q.diff || 'medium')[0], seenKey: 'wq:' + q.id }));
    this.pool = Seen.rank('chase', own.concat(old));
    this.used = [];
  },
  take(test) {
    let i = this.pool.findIndex(test);
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

  /* ---------- talking ---------- */
  VOICE: {
    professor: { male: true, rate: 0.88, pitch: 0.8 },
    diva:      { male: false, rate: 1.18, pitch: 1.35 },
    landlord:  { male: true, rate: 1.0, pitch: 0.65 },
    librarian: { male: false, rate: 0.9, pitch: 1.05 },
    boss:      { male: true, rate: 0.8, pitch: 0.3 }
  },
  pickVoice(male) {
    const vs = Sound.voices().filter(v => /^en(-|_)/i.test(v.lang));
    const gb = vs.filter(v => /GB/i.test(v.lang));
    const list = gb.length ? gb : vs;
    const F = /female|hazel|susan|sonia|libby|maisie|kate|serena|martha|emily|zira|samantha/i;
    const M = /\bmale|george|ryan|daniel|oliver|arthur|thomas|david|mark|james|alex/i;
    return list.find(v => male ? (M.test(v.name) && !F.test(v.name)) : F.test(v.name)) || list[0] || null;
  },
  chaserSay(text) {
    if (!Sound.enabled || !text) return;
    try {
      const cfg = this.VOICE[this.chaser.id] || {};
      const u = new SpeechSynthesisUtterance(text);
      const v = this.pickVoice(cfg.male);
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = cfg.rate || 1; u.pitch = cfg.pitch || 1;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  },
  host(text) { Sound.say(text); },

  /* ---------- phones ---------- */
  send(id, m) { this.lastTo[id] = m; Host.sendTo(id, Object.assign({ type: 'chase' }, m)); },
  sendAll(m) { Object.keys(Host.players).forEach(id => this.send(id, m)); },
  resend(id) { if (this.lastTo && this.lastTo[id]) Host.sendTo(id, Object.assign({ type: 'chase' }, this.lastTo[id])); },

  /* Ask a question and wait. mode 'one': only `who` answers. mode 'first':
     resolves on the first right answer from any of `who`. */
  ask(who, q, secs, mode, extra) {
    this.cur = { q, who: new Set(who), ans: {}, mode: mode || 'one' };
    const view = { k: 'q', qid: q.qid, text: q.q, opts: q.opts, secs, cat: CHASE_CATS[q.c] || '', ...extra };
    Object.keys(Host.players).forEach(id => this.send(id, Object.assign({}, view, { mine: this.cur.who.has(id) })));
    return new Promise(resolve => {
      this.cur.done = resolve;
      this.cur.timer = setTimeout(() => this.settle(), secs * 1000 * this.timeScale);
    });
  },
  answer(id, msg) {
    const c = this.cur;
    if (!this.active || !c || !c.q || msg.qid !== c.q.qid || !c.who.has(id) || c.ans[id] != null) return;
    c.ans[id] = msg.i;
    const right = msg.i === c.q.correct;
    if (this.onAnswer) this.onAnswer(id, right);
    if (c.mode === 'first' && right) return this.settle();
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
  qHtml(q, reveal) {
    return '<div class="ch-q"><div class="muted">' + esc(CHASE_CATS[q.c] || '') + '</div><div class="ch-qt">' + esc(q.q) + '</div>' +
      '<div class="ch-opts">' + q.opts.map((o, i) => {
        let cls = '';
        if (reveal) {
          if (i === q.correct) cls = ' right';
          else if (reveal.p === i || reveal.c === i) cls = ' wrong';
        }
        const tags = reveal ? (reveal.p === i ? ' <b>🙂</b>' : '') + (reveal.c === i ? ' <b>' + this.chaser.emoji + '</b>' : '') : '';
        return '<div class="ch-opt' + cls + '">' + esc(o) + tags + '</div>';
      }).join('') + '</div></div>';
  },

  /* ================= THE ROUND ================= */
  async run(cfg) {
    this.active = true; this.lastTo = {}; this.qn = 0;
    this.chaser = this.pickChaser(cfg && cfg.chaser);
    const rec = this.record(); const r0 = rec[this.chaser.id] || { w: 0, l: 0, adj: 0 };
    this.adj = r0.adj || 0;
    this.bossBefore = this.bossUnlocked();
    this.buildPool();
    Quiz.roundGains = {};
    this.players = this.here();
    this.home = {};                     // id -> money banked
    this.results = {};
    if (!this.players.length) { this.active = false; return false; }

    // ---- 1. reveal the Chaser
    const ch = this.chaser;
    const sorted = Object.entries(ch.skill).sort((a, b) => b[1] - a[1]);
    this.view(this.head() +
      '<p style="font-size:1.05rem">' + esc(ch.bio) + '</p>' +
      '<div class="ch-meta">' + (ch.age ? ch.age + ' · ' : '') + esc(ch.gender) + ' · 📍 ' + esc(ch.from) + ' · ⚡ ' + ch.speed + '/min · 😰 nerves ' + ch.nerves + '/10' +
      (r0.w + r0.l ? ' · record v you: won ' + r0.w + ', lost ' + r0.l : '') + '</div>' +
      '<div class="ch-skills">' + sorted.map(([k, v]) => '<div class="ch-sk"><span>' + CHASE_CATS[k] + '</span><i style="width:' + Math.round(this.hitRate(k, 'm')) + '%"></i></div>').join('') + '</div>');
    this.sendAll({ k: 'intro', id: ch.id, nick: ch.nick, name: ch.name, bio: ch.bio, emoji: ch.emoji, colour: ch.colour,
      strong: sorted.slice(0, 3).map(x => CHASE_CATS[x[0]]), weak: sorted.slice(-3).map(x => CHASE_CATS[x[0]]) });
    $('nightStatus').textContent = '⛓️ The Chase — tonight\'s Chaser is ' + ch.nick + '.';
    this.host('Tonight\'s Chaser is ' + ch.nick + '!');
    await this.sleep(2500);
    this.chaserSay(ch.lines.intro);
    await this.sleep(6000);

    // ---- 2. each player: cash builder, offer, head to head
    for (const id of this.players) {
      if (!this.active) break;
      if (!Host.isPresent(Host.players[id])) continue;
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

  /* ---------- Cash Builder ---------- */
  async cashBuilder(id) {
    const name = this.nameOf(id);
    let right = 0, asked = 0;
    this.host(name + ', your cash builder. Sixty seconds. Go!');
    this.sendAll({ k: 'wait', text: name + ' is in the Cash Builder…' });
    await this.sleep(2500);
    const end = Date.now() + this.CASH_SECS * 1000 * this.timeScale;
    const show = (q, flash) => this.view(this.head() + '<div class="ch-title">💷 ' + esc(name) + '\'s Cash Builder</div>' +
      '<div class="ch-big">' + this.money(right * this.CASH_PER) + '</div><div class="ch-timer">⏱ ' + Math.max(0, Math.ceil((end - Date.now()) / 1000 / this.timeScale)) + 's</div>' +
      (q ? this.qHtml(q) : '') + (flash || ''));
    while (this.active && Date.now() < end) {
      const q = this.take(x => x.d !== 'h');
      asked++;
      show(q);
      const left = Math.max(1, (end - Date.now()) / 1000 / this.timeScale);
      const ans = await this.ask([id], q, left, 'one', { cash: true, total: right * this.CASH_PER });
      if (!this.active) break;
      if (ans[id] === q.correct) { right++; Sound.correct && Sound.correct(); }
      if (ans[id] == null) break;           // time ran out on this one
    }
    const cash = right * this.CASH_PER;
    this.results[id] = { right, asked, cash };
    show(null, '<div class="ch-title">' + esc(name) + ' got ' + right + ' right</div>');
    this.sendAll({ k: 'wait', text: name + ' banked ' + this.money(cash) + ' in the Cash Builder' });
    this.host(name + ', ' + right + ' right. That\'s ' + this.money(cash).replace('£', '') + ' pounds.');
    await this.sleep(3500);
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
    this.chaserSay('I\'ll give you ' + high + ' pounds. If you\'re brave enough.');
    let pick = null;
    this.offerFor = { id, set: p => { pick = p; } };
    this.sendAll({ k: 'wait', text: name + ' is choosing an offer…' });
    this.send(id, { k: 'offer', offers: Object.entries(offers).map(([k, o]) => ({ k, money: this.money(o.money), label: o.label, note: o.note })) });
    const until = Date.now() + 25000 * this.timeScale;
    while (this.active && !pick && Date.now() < until) await this.sleep(150);
    this.offerFor = null;
    const o = offers[pick] || offers.mid;
    this.host(name + ' goes for ' + this.money(o.money).replace('£', '') + ' pounds.');
    await this.sleep(1500);
    return o;
  },
  offerPick(id, k) { if (this.offerFor && this.offerFor.id === id) this.offerFor.set(k); },

  /* ---------- Head to head ---------- */
  async headToHead(id, offer) {
    const name = this.nameOf(id);
    let p = offer.start, c = 0;
    const draw = (q, rv, line) => this.view(this.head() + '<div class="ch-title">' + esc(name) + ' playing for ' + this.money(offer.money) + '</div>' +
      '<div class="ch-h2h">' + this.board(p, c, name) + '<div style="flex:1">' + (q ? this.qHtml(q, rv) : '') + (line || '') + '</div></div>');
    draw(null, null, '<div class="ch-title">Head to head!</div>');
    await this.sleep(2000);
    while (this.active && p < this.STEPS && c < p) {
      // player picks one of two categories
      const cats = Quiz.shuffle(this.cats()).slice(0, 2);
      let cat = null;
      this.catFor = { id, set: x => { if (cats.includes(x)) cat = x; } };
      this.sendAll({ k: 'wait', text: name + ' is picking a category…' });
      this.send(id, { k: 'cat', cats: cats.map(x => ({ k: x, label: CHASE_CATS[x] })) });
      draw(null, null, '<div class="ch-title">' + esc(name) + ' picks: ' + cats.map(x => CHASE_CATS[x]).join(' or ') + '</div>');
      const until = Date.now() + 12000 * this.timeScale;
      while (this.active && !cat && Date.now() < until) await this.sleep(120);
      this.catFor = null;
      if (!this.active) break;
      cat = cat || cats[0];
      const wantD = p >= this.STEPS - 2 ? 'h' : 'm';
      const q = this.take(x => x.c === cat && x.d === wantD) ;
      draw(q, null, '<div class="ch-timer">' + this.chaser.emoji + ' thinking…</div>');
      const ans = await this.ask([id], q, this.H2H_SECS);
      if (!this.active) break;
      const pressure = p >= this.STEPS - 1 ? 1 : 0;
      const cRight = this.chaserAnswers(q, pressure);
      const cPick = cRight ? q.correct : [0, 1, 2].filter(i => i !== q.correct)[Math.floor(Math.random() * 2)];
      const pRight = ans[id] === q.correct;
      draw(q, { p: ans[id], c: cPick }, '<div class="ch-timer">Locked in…</div>');
      await this.sleep(2200);
      if (pRight) p++;
      if (cRight) c++;
      draw(q, { p: ans[id], c: cPick }, '<div class="ch-title">' + (pRight ? '✅ ' + esc(name) : '❌ ' + esc(name)) + ' &nbsp; ' +
        (cRight ? '✅ ' : '❌ ') + esc(this.chaser.nick) + '</div>');
      this.sendAll({ k: 'h2hResult', name, right: pRight, chaserRight: cRight, answer: q.a, p, c, steps: this.STEPS });
      if (!cRight && Math.random() < 0.6) this.chaserSay(this.chaser.lines.wrong);
      await this.sleep(3000);
    }
    if (!this.active) return;
    if (p >= this.STEPS) {
      this.home[id] = offer.money;
      Quiz.roundGains[id] = (Quiz.roundGains[id] || 0) + 10;
      Host.players[id].score += 10;
      this.view(this.head() + '<div class="ch-big">🏠 ' + esc(name) + ' is HOME!</div><div class="ch-title">' + this.money(offer.money) + ' goes into the Final Chase (+10 points)</div>');
      this.sendAll({ k: 'wait', text: '🏠 ' + name + ' got home with ' + this.money(offer.money) + '!' });
      this.host(name + ' is home! ' + this.money(offer.money).replace('£', '') + ' pounds goes through.');
    } else {
      this.view(this.head() + '<div class="ch-big">⛓️ Caught!</div><div class="ch-title">' + esc(name) + ' is out</div>');
      this.sendAll({ k: 'wait', text: '⛓️ ' + name + ' was caught by ' + this.chaser.nick });
      this.chaserSay(this.chaser.lines.catch);
    }
    Host.renderScores(); Host.pushBoard();
    await this.sleep(4000);
  },

  /* ---------- Final Chase ---------- */
  async finalChase() {
    let team = Object.keys(this.home).filter(id => Host.isPresent(Host.players[id]));
    let pot = team.reduce((s, id) => s + this.home[id], 0);
    let lazarus = false;
    if (!team.length) {
      team = this.players.filter(id => Host.isPresent(Host.players[id]));
      pot = this.LAZARUS_POT; lazarus = true;
    }
    if (!team.length) return;
    this.finalTeam = team; this.pot = pot;
    const names = team.map(id => this.nameOf(id)).join(' & ');
    this.view(this.head() + '<div class="ch-big">🏁 FINAL CHASE</div><div class="ch-title">' + esc(names) + ' playing for ' + this.money(pot) +
      (lazarus ? ' — nobody got home, so this is a second chance' : '') + '</div><div class="muted">Two minutes. Answer on your phones — first right answer moves you on. One step head start for each player.</div>');
    this.sendAll({ k: 'wait', text: '🏁 Final Chase for ' + this.money(pot) + ' — get ready!' });
    this.host('The final chase, for ' + this.money(pot).replace('£', '') + ' pounds. Two minutes. Answer on your phones. Go!');
    await this.sleep(5000);

    // --- the team's run
    let target = team.length;            // head start
    const end = Date.now() + this.FINAL_SECS * 1000 * this.timeScale;
    const secsLeft = () => Math.max(0, Math.ceil((end - Date.now()) / 1000 / this.timeScale));
    while (this.active && Date.now() < end) {
      const q = this.take(x => x.d !== 'h' || Math.random() < 0.3);
      this.view(this.head() + '<div class="ch-title">🏁 Your run</div><div class="ch-big">' + target + ' steps</div><div class="ch-timer">⏱ ' + secsLeft() + 's</div>' + this.qHtml(q));
      const ans = await this.ask(team, q, Math.min(10, Math.max(1, secsLeft())), 'first', { final: true, target });
      if (!this.active) break;
      if (team.some(id => ans[id] === q.correct)) target++;
    }
    if (!this.active) return;
    this.view(this.head() + '<div class="ch-big">🎯 Target: ' + target + '</div><div class="ch-title">' + esc(this.chaser.nick) + ' has two minutes to catch you</div>');
    this.sendAll({ k: 'wait', text: '🎯 You set ' + target + '. Now ' + this.chaser.nick + ' chases — watch for pushbacks!' });
    this.host('You have set a target of ' + target + '. ' + this.chaser.nick + ', two minutes on the clock. Go!');
    await this.sleep(4500);

    // --- the Chaser's run, with pushbacks
    let got = 0, used = 0;
    const per = 60000 / this.chaser.speed;           // ms per answer
    const total = this.FINAL_SECS * 1000;
    while (this.active && used < total && got < target) {
      const q = this.take(() => true);
      const pressure = target - got <= 2 ? 1 : 0;
      const hit = this.chaserAnswers(q, pressure);
      used += per;
      const left = Math.max(0, Math.ceil((total - used) / 1000));
      this.view(this.head() + '<div class="ch-final"><div><div class="muted">Target</div><div class="ch-big">' + target + '</div></div>' +
        '<div><div class="muted">' + esc(this.chaser.nick) + '</div><div class="ch-big" style="color:var(--cc)">' + got + '</div></div>' +
        '<div><div class="muted">Clock</div><div class="ch-big">' + left + 's</div></div></div>' + this.qHtml(q, { c: hit ? q.correct : (q.correct + 1) % 3 }));
      await this.sleep(per);
      if (hit) { got++; continue; }
      if (used >= total) break;
      // pushback: clock stops, you get a go
      this.view(this.head() + '<div class="ch-title">❌ ' + esc(this.chaser.nick) + ' got it wrong — PUSHBACK! Answer on your phones</div>' + this.qHtml(q));
      this.sendAll({ k: 'wait', text: 'Pushback!' });
      this.host('Pushback!');
      const pq = { ...q, qid: (this.qn = (this.qn || 0) + 1) };
      const ans = await this.ask(team, pq, this.PUSH_SECS, 'first', { pushback: true });
      if (!this.active) break;
      if (team.some(id => ans[id] === q.correct) && got > 0) { got--; this.host('Pushed back!'); }
      else if (team.some(id => ans[id] === q.correct)) this.host('Right, but nothing to push back yet.');
      await this.sleep(1500);
    }
    if (!this.active) return;
    const caught = got >= target;
    const r = this.record(); const cr = r[this.chaser.id] = r[this.chaser.id] || { w: 0, l: 0, adj: 0 };
    if (caught) {
      cr.w++; cr.adj = Math.max(-12, (cr.adj || 0) - 3);
      this.view(this.head() + '<div class="ch-big">⛓️ CAUGHT</div><div class="ch-title">' + esc(this.chaser.nick) + ' caught you with ' + Math.max(0, Math.round((total - used) / 1000)) + 's to spare</div>');
      this.sendAll({ k: 'end', win: false, text: '⛓️ ' + this.chaser.nick + ' caught you. The ' + this.money(pot) + ' is gone!' });
      this.chaserSay(this.chaser.lines.catch);
    } else {
      cr.l++; cr.adj = Math.min(9, (cr.adj || 0) + 3);
      // pot → game points, capped so one Chase can't swamp a whole night
      const each = Math.min(150, 30 + Math.round(pot / 1000));
      team.forEach(id => { Host.players[id].score += each; Quiz.roundGains[id] = (Quiz.roundGains[id] || 0) + each; });
      this.view(this.head() + '<div class="ch-big">🎉 YOU BEAT THE CHASER!</div><div class="ch-title">' + this.money(pot) + ' — ' + each + ' points each to ' + esc(names) + '</div>');
      this.sendAll({ k: 'end', win: true, text: '🎉 You beat ' + this.chaser.nick + '! ' + each + ' points each.' });
      this.chaserSay(this.chaser.lines.lose);
      if (!this.bossBefore && this.bossUnlocked()) {
        setTimeout(() => this.host('You have beaten every Chaser. The Boss is coming.'), 4000);
      }
    }
    this.saveRecord(r);
    Host.renderScores(); Host.pushBoard(); Host.saveGame();
    await this.sleep(7000);
  },

  async finish() {
    const was = this.active;
    this.active = false;
    if (this.cur) this.settle();
    if (this.used && this.used.length) Seen.mark('chase', this.used);
    Host.snapshotRound('The Chase');
    Host.pushBoard();
    setTimeout(() => { const el = $('chaseHost'); if (el && !this.active) el.classList.add('hidden'); }, 12000);
    return true;
  },
  stop() { this.active = false; if (this.cur) this.settle(); }
};

/* ================= the phone side ================= */
const ChasePhone = {
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
      if (!msg.mine) { this.show('<div class="muted">' + esc(msg.cat) + '</div><div class="rc-name" style="font-size:1.1rem">' + esc(msg.text) + '</div><div class="muted">Watching…</div>'); return; }
      this.qid = msg.qid;
      const head = msg.cash ? '💷 Cash Builder · ' + esc(Chase.money(msg.total)) : msg.pushback ? '⏪ PUSHBACK — get it right to push them back' : msg.final ? '🏁 Final Chase · ' + msg.target + ' steps' : '⛓️ Head to head';
      this.show('<div class="rc-kicker">' + head + '</div><div class="muted">' + esc(msg.cat) + '</div><div class="rc-name" style="font-size:1.15rem;margin:8px 0">' + esc(msg.text) + '</div>' +
        msg.opts.map((o, i) => '<button class="btn big" style="width:100%;margin-top:8px;font-size:1.05rem" onclick="ChasePhone.pick(' + msg.qid + ',' + i + ',this)">' + esc(o) + '</button>').join(''));
      return;
    }
    if (k === 'h2hResult') {
      this.show('<div class="rc-name">' + (msg.right ? '✅' : '❌') + ' ' + esc(msg.name) + ' &nbsp; ' + (msg.chaserRight ? '✅' : '❌') + ' Chaser</div><div class="muted">Answer: ' + esc(msg.answer) + '</div>' +
        '<div style="margin-top:6px">You: step ' + msg.p + ' of ' + msg.steps + ' · Chaser: step ' + msg.c + '</div>');
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
