/* =====================================================================
   MR & MRS — how well do you two know each other?

   Round 1 "How well do you know me?": one of you answers about yourself in
   secret, the other guesses what they picked. Swap each question.
   Round 2 "Who's more likely to…": both tap a name at once; matching scores.
   Round 3 the finale, double points: guess a number about the other one.

   Scoring: individual points for each right guess (so there's a winner),
   plus a couple sync score — get 70% in sync and you both get a bonus.
   Cheekiness follows adult mode: clean unless cheeky mode is on, then
   flirty and (for the sexy / mix styles) sexy questions join as the night
   heats up. Your own questions, typed on the laptop, are mixed in.
   ===================================================================== */

/* {n} = the person the question is about. `self` is what that person sees.
   t: 0 clean, 1 flirty, 2 sexy (suggestive, never explicit). */
window.MM_Q = {
  me: [
    { t: 0, q: "What's {n}'s perfect takeaway?", self: "What's your perfect takeaway?", o: ['Chinese', 'Indian', 'Pizza', 'Fish & chips'] },
    { t: 0, q: "What would {n} rather do on a free Saturday?", self: "What would you rather do on a free Saturday?", o: ['Lie in all morning', 'Day out somewhere', 'Pub / restaurant', 'Get jobs done'] },
    { t: 0, q: "What's {n}'s biggest pet hate?", self: "What's your biggest pet hate?", o: ['Loud chewing', 'Lateness', 'Mess left about', 'Bad drivers'] },
    { t: 0, q: "Which would {n} save first in a fire (people and pets are safe)?", self: "Which would you save first in a fire (people and pets are safe)?", o: ['Phone', 'Photos', 'Laptop', 'Jewellery / watch'] },
    { t: 0, q: "What's {n}'s go-to drink on a night out?", self: "What's your go-to drink on a night out?", o: ['Wine', 'Beer / lager', 'Gin / spirits', 'Cocktail'] },
    { t: 0, q: "Where would {n} pick for a dream holiday?", self: "Where would you pick for a dream holiday?", o: ['Beach & sun', 'City break', 'Mountains / lakes', 'Road trip'] },
    { t: 0, q: "What does {n} do first when they get home?", self: "What do you do first when you get home?", o: ['Kettle on', 'Change clothes', 'Phone on the sofa', 'Raid the fridge'] },
    { t: 0, q: "What's {n}'s worst habit?", self: "What's your worst habit?", o: ['On the phone too much', 'Leaving things about', 'Being late', 'Snacking'] },
    { t: 0, q: "Which film genre would {n} pick on a night in?", self: "Which film genre would you pick on a night in?", o: ['Comedy', 'Thriller / crime', 'Romance', 'Action'] },
    { t: 0, q: "What's {n}'s favourite season?", self: "What's your favourite season?", o: ['Spring', 'Summer', 'Autumn', 'Winter'] },
    { t: 0, q: "How does {n} take their tea or coffee?", self: "How do you take your tea or coffee?", o: ['Black, nothing in it', 'Milk, no sugar', 'Milk and sugar', "Don't drink either"] },
    { t: 0, q: "What would {n} spend a surprise £1,000 on?", self: "What would you spend a surprise £1,000 on?", o: ['Holiday', 'Clothes / shoes', 'Gadget', 'Save it'] },
    { t: 0, q: "Which chore does {n} hate most?", self: "Which chore do you hate most?", o: ['Ironing', 'Washing up', 'Hoovering', 'Bins / recycling'] },
    { t: 0, q: "What's {n}'s comfort food?", self: "What's your comfort food?", o: ['Chocolate', 'Crisps', 'Cheese on toast', 'Ice cream'] },
    { t: 0, q: "What would {n} be famous for, if they were famous?", self: "What would you be famous for, if you were famous?", o: ['Singing', 'Acting', 'Sport', 'Being on a reality show'] },
    { t: 0, q: "What's {n}'s breakfast of choice?", self: "What's your breakfast of choice?", o: ['Full English', 'Toast', 'Cereal', 'Just a coffee'] },
    { t: 0, q: "When {n} is in a mood, what helps most?", self: "When you're in a mood, what helps most?", o: ['Being left alone', 'A hug', 'Food', 'A good moan'] },
    { t: 0, q: "Which superpower would {n} choose?", self: "Which superpower would you choose?", o: ['Fly', 'Invisible', 'Read minds', 'Time travel'] },
    { t: 0, q: "What's {n}'s karaoke style?", self: "What's your karaoke style?", o: ['Power ballad', 'Cheesy pop', 'Rock anthem', 'Not a chance'] },
    { t: 0, q: "What annoys {n} most about {o}?", self: "What annoys you most about your other half?", o: ['Snoring', 'Phone use', 'Untidiness', 'Never listening'] },
    { t: 0, q: "What's {n}'s dream car?", self: "What's your dream car?", o: ['Sports car', 'Big 4x4', 'Classic car', "Don't care, it's a car"] },
    { t: 0, q: "Which animal is {n} most like?", self: "Which animal are you most like?", o: ['Cat', 'Dog', 'Sloth', 'Meerkat'] },
    { t: 0, q: "What's {n}'s favourite room in the house?", self: "What's your favourite room in the house?", o: ['Living room', 'Kitchen', 'Bedroom', 'Garden'] },
    { t: 0, q: "What would {n} order for dessert?", self: "What would you order for dessert?", o: ['Chocolate anything', 'Cheesecake', 'Sticky toffee pudding', 'Cheeseboard'] },
    { t: 0, q: "How does {n} cope with being ill?", self: "How do you cope with being ill?", o: ['Soldier on', 'Full man-flu mode', 'Sleep it off', 'Google everything'] },
    { t: 0, q: "Which decade would {n} live in if they could?", self: "Which decade would you live in if you could?", o: ['60s', '70s', '80s', '90s'] },
    { t: 0, q: "What's {n}'s favourite way to relax?", self: "What's your favourite way to relax?", o: ['Telly', 'Bath', 'Walk', 'Music'] },
    { t: 0, q: "On a long drive, what does {n} want on?", self: "On a long drive, what do you want on?", o: ['Radio', 'Own playlist', 'Podcast', 'Silence'] },
    { t: 0, q: "Which TV show would {n} binge again?", self: "Which kind of TV show would you binge again?", o: ['Crime drama', 'Comedy', 'Reality', 'Documentary'] },
    { t: 0, q: "What's {n} most likely to be late because of?", self: "What are you most likely to be late because of?", o: ['Getting ready', 'Phone', 'Traffic (honestly)', 'Lost keys'] },
    { t: 0, q: "What's {n}'s idea of a perfect Sunday?", self: "What's your idea of a perfect Sunday?", o: ['Roast dinner', 'Lazy day in', 'Long walk', 'Sunday session at the pub'] },
    { t: 0, q: "What's {n}'s favourite crisp?", self: "What's your favourite crisp?", o: ['Salt & vinegar', 'Cheese & onion', 'Ready salted', 'Prawn cocktail'] },
    { t: 0, q: "If {n} won the lottery, what would they do first?", self: "If you won the lottery, what would you do first?", o: ['Quit work', 'Buy a house', 'Big holiday', 'Tell nobody'] },
    { t: 0, q: "What's {n}'s biggest fear?", self: "What's your biggest fear?", o: ['Spiders', 'Heights', 'Public speaking', 'Deep water'] },
    { t: 0, q: "Which pizza topping would {n} never have?", self: "Which pizza topping would you never have?", o: ['Pineapple', 'Anchovies', 'Olives', 'Mushrooms'] },
    { t: 1, q: "What did {n} first notice about {o}?", self: "What did you first notice about your other half?", o: ['Eyes', 'Smile', 'Bum', 'Laugh'] },
    { t: 1, q: "What's {n}'s idea of a perfect date night?", self: "What's your idea of a perfect date night?", o: ['Fancy restaurant', 'Takeaway & film', 'Drinks & dancing', 'Night away somewhere'] },
    { t: 1, q: "Which outfit does {n} like {o} in most?", self: "Which outfit do you like your other half in most?", o: ['Dressed up', 'Jeans & t-shirt', 'Gym gear', 'Nothing at all'] },
    { t: 1, q: "What's {n}'s favourite way to be kissed?", self: "What's your favourite way to be kissed?", o: ['Neck', 'Long and slow', 'Quick and cheeky', 'Forehead'] },
    { t: 1, q: "Which celebrity would {n} get a free pass with?", self: "Which kind of celebrity would you get a free pass with?", o: ['Actor / actress', 'Singer', 'Sports star', 'TV presenter'] },
    { t: 1, q: "What's the most romantic thing {n} has had done for them?", self: "What's the most romantic thing done for you?", o: ['Surprise trip', 'Flowers / gift', 'Cooked a meal', 'Love letter / note'] },
    { t: 1, q: "Where does {n} like a cuddle most?", self: "Where do you like a cuddle most?", o: ['On the sofa', 'In bed', 'In the kitchen', 'Out in public'] },
    { t: 1, q: "What's {n}'s flirting style?", self: "What's your flirting style?", o: ['Cheeky banter', 'Eye contact', 'Touchy-feely', "Can't flirt to save my life"] },
    { t: 1, q: "What's {n}'s favourite feature on {o}?", self: "What's your favourite feature on your other half?", o: ['Eyes', 'Lips', 'Hands', 'Bum'] },
    { t: 1, q: "What would {n} pick for a romantic weekend away?", self: "What would you pick for a romantic weekend away?", o: ['Spa hotel', 'Cosy cottage', 'European city', 'Sunny beach'] },
    { t: 2, q: "When is {n} most in the mood?", self: "When are you most in the mood?", o: ['Morning', 'Afternoon', 'Late night', 'Any time'] },
    { t: 2, q: "Where would {n} most like a bit of fun outside the bedroom?", self: "Where would you most like a bit of fun outside the bedroom?", o: ['Shower', 'Sofa', 'Kitchen', 'Hotel'] },
    { t: 2, q: "What's {n}'s favourite thing to wear to bed?", self: "What's your favourite thing to wear to bed?", o: ['Pyjamas', 'T-shirt', 'Underwear', 'Nothing'] },
    { t: 2, q: "What turns {n} on most?", self: "What turns you on most?", o: ['Confidence', 'A good smell', 'Being complimented', 'Dressed up'] },
    { t: 2, q: "What's {n}'s favourite kind of massage?", self: "What's your favourite kind of massage?", o: ['Back', 'Feet', 'Shoulders', 'Full body'] },
    { t: 2, q: "Which would {n} rather: lights on or off?", self: "Lights on or off?", o: ['On', 'Off', 'Candles', "Don't mind"] },
    { t: 2, q: "What's {n}'s sexiest piece of music?", self: "What's your sexiest kind of music?", o: ['Slow R&B', 'Soul', 'Rock', 'Silence'] },
    { t: 2, q: "What's {n}'s secret fantasy location?", self: "What's your secret fantasy location?", o: ['Beach', 'Hotel suite', 'Somewhere outdoors', 'Plane / train'] }
  ],
  who: [
    { t: 0, q: "Who's the worse driver?" }, { t: 0, q: "Who's the messiest?" }, { t: 0, q: "Who takes longer to get ready?" },
    { t: 0, q: "Who's the better cook?" }, { t: 0, q: "Who snores the loudest?" }, { t: 0, q: "Who's more likely to cry at a film?" },
    { t: 0, q: "Who's more likely to get lost?" }, { t: 0, q: "Who hogs the duvet?" }, { t: 0, q: "Who's the bigger spender?" },
    { t: 0, q: "Who's always right (in their own head)?" }, { t: 0, q: "Who would survive a zombie apocalypse?" }, { t: 0, q: "Who's worse at taking a compliment?" },
    { t: 0, q: "Who says sorry first after a row?" }, { t: 0, q: "Who's more likely to forget a birthday?" }, { t: 0, q: "Who's the better dancer?" },
    { t: 0, q: "Who's more stubborn?" }, { t: 0, q: "Who checks their phone more?" }, { t: 0, q: "Who's the funniest?" },
    { t: 0, q: "Who's more likely to fall asleep in front of the telly?" }, { t: 0, q: "Who's the bigger kid?" }, { t: 0, q: "Who eats the last biscuit?" },
    { t: 0, q: "Who's more likely to sing in the shower?" }, { t: 0, q: "Who gets hangry first?" }, { t: 0, q: "Who's the bigger worrier?" },
    { t: 0, q: "Who's more competitive?" }, { t: 0, q: "Who's more likely to buy something they don't need?" }, { t: 0, q: "Who controls the remote?" },
    { t: 0, q: "Who would win on a quiz show?" }, { t: 0, q: "Who's more likely to talk to strangers?" }, { t: 0, q: "Who's the better driver in a panic?" },
    { t: 0, q: "Who's more likely to lose their keys?" }, { t: 0, q: "Who's the early bird?" }, { t: 0, q: "Who's the bigger gossip?" },
    { t: 0, q: "Who's more likely to say 'I told you so'?" }, { t: 0, q: "Who would last longer without their phone?" }, { t: 0, q: "Who gives the best presents?" },
    { t: 1, q: "Who made the first move?" }, { t: 1, q: "Who's the better kisser?" }, { t: 1, q: "Who's more romantic?" },
    { t: 1, q: "Who flirts more?" }, { t: 1, q: "Who said 'I love you' first?" }, { t: 1, q: "Who gets jealous quicker?" },
    { t: 1, q: "Who's the bigger show-off?" }, { t: 1, q: "Who's more likely to plan a surprise date?" }, { t: 1, q: "Who's more cuddly?" },
    { t: 1, q: "Who looks better first thing in the morning?" },
    { t: 2, q: "Who's more adventurous in the bedroom?" }, { t: 2, q: "Who usually starts things?" }, { t: 2, q: "Who's louder?" },
    { t: 2, q: "Who's more likely to suggest a cheeky early night?" }, { t: 2, q: "Who's the better tease?" }, { t: 2, q: "Who's more likely to send a cheeky text?" },
    { t: 2, q: "Who has the wilder imagination?" }, { t: 2, q: "Who falls asleep first afterwards?" }
  ],
  num: [
    { t: 0, q: "How many pairs of shoes does {n} own?", self: "How many pairs of shoes do you own?" },
    { t: 0, q: "How many cups of tea or coffee does {n} drink a day?", self: "How many cups of tea or coffee do you drink a day?" },
    { t: 0, q: "How many hours of sleep does {n} need to be human?", self: "How many hours of sleep do you need to be human?" },
    { t: 0, q: "How many minutes does {n} take to get ready for a night out?", self: "How many minutes do you take to get ready for a night out?" },
    { t: 0, q: "How many countries has {n} been to?", self: "How many countries have you been to?" },
    { t: 0, q: "How many times does {n} hit snooze?", self: "How many times do you hit snooze?" },
    { t: 0, q: "Out of 10, how good a singer does {n} think they are?", self: "Out of 10, how good a singer do you think you are?" },
    { t: 0, q: "How many unread messages has {n} got right now?", self: "How many unread messages have you got right now?" },
    { t: 0, q: "Out of 10, how tidy is {n}?", self: "Out of 10, how tidy are you?" },
    { t: 0, q: "How old was {n} when they had their first kiss?", self: "How old were you when you had your first kiss?" },
    { t: 1, q: "Out of 10, how romantic is {n}?", self: "Out of 10, how romantic are you?" },
    { t: 1, q: "How many dates before {n} knew it was serious?", self: "How many dates before you knew it was serious?" },
    { t: 2, q: "Out of 10, how good a kisser does {n} think {o} is?", self: "Out of 10, how good a kisser is your other half?" },
    { t: 2, q: "Out of 10, how cheeky is {n} feeling right now?", self: "Out of 10, how cheeky are you feeling right now?" }
  ]
};

const MrMrs = {
  active: false,
  timeScale: 1,
  KEY: 'mrmrs_custom',
  ME_Q: 6, WHO_Q: 6, NUM_Q: 2,
  PTS_ME: 10, PTS_WHO: 5, PTS_NUM: 20, SYNC_BONUS: 20, SYNC_AT: 0.7,

  sleep(ms) {
    const until = Date.now() + ms * this.timeScale;
    return new Promise(async r => { while (this.active && Date.now() < until) await new Promise(x => setTimeout(x, 50)); r(); });
  },
  speak(text) {
    if (!text) return Promise.resolve();
    const est = 900 + text.length * 70;
    if (!Sound.enabled || typeof speechSynthesis === 'undefined') return this.sleep(Math.min(est, 5000));
    return new Promise(resolve => {
      let done = false; const fin = () => { if (!done) { done = true; resolve(); } };
      try {
        const u = new SpeechSynthesisUtterance(text);
        const st = Sound.STYLES[store.get('buzz_style') || 'normal'] || Sound.STYLES.normal;
        u.rate = Math.min(st[1], 1.05); u.pitch = st[2];
        const want = store.get('buzz_voice'); const v = want && Sound.voices().find(x => x.voiceURI === want);
        if (v) { u.voice = v; u.lang = v.lang; }
        u.onend = fin; u.onerror = fin;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) { fin(); }
      setTimeout(fin, est * 2 + 2000);
    });
  },
  nameOf(id) { return (Host.players[id] || {}).name || 'Someone'; },
  fill(s, id) {
    const other = this.pair ? this.pair.find(x => x !== id) : null;
    return s.replace(/\{n\}/g, this.nameOf(id)).replace(/\{o\}/g, other ? this.nameOf(other) : 'the other one');
  },

  /* ---- your own questions ---- */
  custom() { try { return JSON.parse(store.get(this.KEY) || '[]') || []; } catch (e) { return []; } },
  saveCustom(list) { store.set(this.KEY, JSON.stringify(list)); this.renderCustom(); },
  addCustom() {
    const type = $('mmType').value, text = ($('mmText').value || '').trim();
    const opts = ($('mmOpts').value || '').split(',').map(x => x.trim()).filter(Boolean);
    const tier = +$('mmTier').value || 0;
    const note = $('mmNote');
    if (!text) { note.textContent = 'Type the question first.'; return; }
    if (type === 'me' && (opts.length < 2 || opts.length > 6)) { note.textContent = 'Give 2 to 6 answers, separated by commas.'; return; }
    const q = { t: tier, own: true, id: 'c' + Date.now() };
    if (type === 'who') q.q = /\?$/.test(text) ? text : text + '?';
    else {
      // write it about the other person; "{n}" is swapped for their name
      q.q = text.includes('{n}') ? text : text;
      q.self = text.replace(/\{n\}'s/g, 'your').replace(/\{n\}/g, 'you');
      if (type === 'me') q.o = opts;
    }
    const list = this.custom(); list.push({ type, ...q }); this.saveCustom(list);
    $('mmText').value = ''; $('mmOpts').value = ''; note.textContent = '✅ Added — it will be mixed into the next Mr & Mrs.';
  },
  removeCustom(id) { this.saveCustom(this.custom().filter(q => q.id !== id)); },
  renderCustom() {
    const el = $('mmList'); if (!el) return;
    const list = this.custom();
    el.innerHTML = list.length ? list.map(q => '<div class="row" style="gap:6px;align-items:center;margin:3px 0"><span class="grow" style="font-size:.9rem">' +
      ({ me: '🙋', who: '👉', num: '🔢' }[q.type] || '') + ' ' + esc(q.q) + (q.o ? ' <span class="muted">(' + esc(q.o.join(', ')) + ')</span>' : '') +
      (q.t ? ' ' + (q.t === 2 ? '🔥' : '😘') : '') + '</span><button class="btn ghost small" onclick="MrMrs.removeCustom(\'' + q.id + '\')">✕</button></div>').join('')
      : '<div class="muted" style="font-size:.85rem">None yet.</div>';
  },

  /* how cheeky tonight: follows the adult-mode style and the night's heat */
  maxTier() {
    if (!Forfeit.active()) return 0;
    const lv = Forfeit.level;
    const cap = (lv === 'sexy' || lv === 'mix') ? 2 : (lv === 'flirty' || lv === 'cheeky') ? 1 : 0;
    const heat = Forfeit.tierFor((Night.idx || 0) + 1);
    return Math.min(cap, Math.max(heat, cap ? 1 : 0));
  },
  pick(type, n) {
    const tier = this.maxTier();
    const own = this.custom().filter(q => q.type === type && (q.t || 0) <= tier);
    const bank = (MM_Q[type] || []).map((q, i) => ({ ...q, id: type + i })).filter(q => q.t <= tier);
    // cheekier questions favoured once the heat is up; your own always get a look in
    const seen = Seen.load()['mrmrs'] || {};
    const fresh = q => !seen[('mm:' + q.id).toLowerCase()];
    const order = Quiz.shuffle(bank).sort((a, b) => (fresh(b) - fresh(a)) || (b.t - a.t) * (tier ? 1 : 0));
    // with the heat up, about 60% cheeky and the rest everyday, so it never loses the fun stuff
    const mine = Quiz.shuffle(own).slice(0, Math.ceil(n / 2));
    const left = n - mine.length;
    const hot = order.filter(q => q.t > 0), clean = order.filter(q => !q.t);
    const nHot = tier ? Math.min(hot.length, Math.round(left * 0.6)) : 0;
    const out = mine.concat(hot.slice(0, nHot), clean.slice(0, left - nHot));
    return Quiz.shuffle(out.concat(order.filter(q => !out.includes(q))).slice(0, n));
  },

  /* ---- phones ---- */
  send(id, m) { this.lastTo[id] = m; Host.sendTo(id, Object.assign({ type: 'mm' }, m)); },
  resend(id) { if (this.lastTo && this.lastTo[id]) Host.sendTo(id, Object.assign({ type: 'mm' }, this.lastTo[id])); },
  ask(views, secs) {
    const qid = this.qn = (this.qn || 0) + 1;
    this.cur = { qid, ans: {}, who: Object.keys(views) };
    Object.entries(views).forEach(([id, v]) => this.send(id, Object.assign({ k: 'q', qid, secs }, v)));
    return new Promise(resolve => {
      this.cur.done = resolve;
      this.cur.timer = setTimeout(() => this.settle(), secs * 1000 * this.timeScale);
    });
  },
  answer(id, msg) {
    const c = this.cur;
    if (!this.active || !c || !c.done || msg.qid !== c.qid || !c.who.includes(id) || c.ans[id] != null) return;
    c.ans[id] = msg.v;
    this.send(id, { k: 'wait', text: '🔒 Locked in — waiting for the other one…' });
    if (c.who.every(x => c.ans[x] != null)) this.settle();
  },
  settle() { const c = this.cur; if (!c || !c.done) return; clearTimeout(c.timer); const d = c.done; c.done = null; d(c.ans); },

  /* ---- laptop ---- */
  view(html) {
    const el = $('mmHost'); if (!el) return;
    el.classList.remove('hidden');
    el.innerHTML = '<div class="mm-wrap">' + html + '</div>';
  },
  scoreBar() {
    const [a, b] = this.pair;
    return '<div class="mm-score"><span>' + esc(this.nameOf(a)) + ' <b>' + this.pts[a] + '</b></span><span class="mm-sync">💞 ' +
      (this.total ? Math.round(this.sync / this.total * 100) : 0) + '% in sync</span><span><b>' + this.pts[b] + '</b> ' + esc(this.nameOf(b)) + '</span></div>';
  },
  card(title, body) { return '<div class="mm-title">💍 Mr &amp; Mrs — ' + esc(title) + '</div>' + this.scoreBar() + body; },
  reveal(qText, left, right) {
    return '<div class="mm-q">' + esc(qText) + '</div><div class="mm-rev">' +
      '<div class="mm-ans"><div class="muted">' + esc(left[0]) + '</div><div class="mm-big">' + esc(left[1]) + '</div></div>' +
      '<div class="mm-ans"><div class="muted">' + esc(right[0]) + '</div><div class="mm-big">' + esc(right[1]) + '</div></div></div>';
  },

  /* ================= THE ROUND ================= */
  async run(cfg) {
    this.active = true; this.lastTo = {}; this.qn = 0; this.used = [];
    const here = Object.keys(Host.players).filter(id => Host.isPresent(Host.players[id]));
    if (here.length < 2) {
      $('nightStatus').textContent = '💍 Mr & Mrs needs two people in the room.';
      this.active = false; return false;
    }
    this.pair = here.slice(0, 2);
    const [A, B] = this.pair;
    this.pts = { [A]: 0, [B]: 0 }; this.sync = 0; this.total = 0;
    Quiz.roundGains = {};
    const tier = this.maxTier();
    $('nightStatus').textContent = '💍 Mr & Mrs — ' + this.nameOf(A) + ' and ' + this.nameOf(B) + (tier ? (tier === 2 ? ' · 🔥 sexy questions on' : ' · 😘 flirty questions on') : '') + '.';
    this.view(this.card('how well do you know each other?', '<p style="font-size:1.1rem">Round 1: answer about yourself, guess the other one.<br>Round 2: who\'s more likely to…<br>Round 3: the finale, for double points.</p>'));
    Object.keys(Host.players).forEach(id => this.send(id, { k: 'wait', text: '💍 Mr & Mrs is starting…' }));
    await this.speak('It\'s Mr and Mrs! ' + this.nameOf(A) + ' and ' + this.nameOf(B) + ', let\'s find out how well you really know each other.' + (tier === 2 ? ' And tonight, things might get a little steamy.' : ''));
    await this.sleep(1500);

    // ---- Round 1: how well do you know me?
    const me = this.pick('me', this.ME_Q);
    await this.speak('Round one. One of you answers about yourself, the other guesses what they said.');
    for (let i = 0; i < me.length && this.active; i++) {
      const q = me[i], subj = i % 2 ? B : A, guess = subj === A ? B : A;
      this.used.push(q);
      const qText = this.fill(q.q, subj);
      this.view(this.card('round 1, question ' + (i + 1), '<div class="mm-q">' + esc(qText) + '</div><div class="mm-wait">' +
        esc(this.nameOf(subj)) + ' is answering about themselves · ' + esc(this.nameOf(guess)) + ' is guessing…</div>'));
      const p = this.ask({
        [subj]: { mode: 'self', text: q.self, opts: q.o, kicker: 'About YOU — answer honestly' },
        [guess]: { mode: 'guess', text: qText, opts: q.o, kicker: 'What did ' + this.nameOf(subj) + ' say?' }
      }, 45);
      await this.speak(qText);
      const ans = await p;
      if (!this.active) break;
      const s = ans[subj], g = ans[guess];
      const match = s != null && s === g;
      this.total++; if (match) { this.sync++; this.pts[guess] += this.PTS_ME; }
      this.view(this.card('round 1, question ' + (i + 1), this.reveal(qText, [this.nameOf(guess) + ' guessed', g == null ? '—' : q.o[g]], [this.nameOf(subj) + ' said', '…'])));
      await this.speak(this.nameOf(guess) + ' guessed ' + (g == null ? 'nothing' : q.o[g]) + '. And ' + this.nameOf(subj) + ' said...');
      await this.sleep(900);
      this.view(this.card('round 1, question ' + (i + 1), this.reveal(qText, [this.nameOf(guess) + ' guessed', g == null ? '—' : q.o[g]], [this.nameOf(subj) + ' said', s == null ? '—' : q.o[s]]) +
        '<div class="mm-verdict ' + (match ? 'yes' : 'no') + '">' + (match ? '💞 MATCH! +' + this.PTS_ME + ' to ' + esc(this.nameOf(guess)) : '💔 No match') + '</div>'));
      this.pair.forEach(id => this.send(id, { k: 'res', match, text: (match ? '💞 Match!' : '💔 No match') + ' — ' + this.nameOf(subj) + ' said: ' + (s == null ? 'nothing' : q.o[s]), pts: this.pts[id] }));
      if (match) Sound.correct && Sound.correct();
      await this.speak((s == null ? 'nothing' : q.o[s]) + '! ' + (match ? 'It\'s a match!' : 'Oh dear.'));
      await this.sleep(1800);
    }

    // ---- Round 2: who's more likely to…
    if (this.active) {
      const who = this.pick('who', this.WHO_Q);
      this.view(this.card('round 2', '<div class="mm-q">Who\'s more likely to…</div><div class="mm-wait">Both tap a name at the same time. Matching answers score.</div>'));
      await this.speak('Round two. Who\'s more likely? You both tap a name. If you agree, you both score.');
      await this.sleep(800);
      for (let i = 0; i < who.length && this.active; i++) {
        const q = who[i]; this.used.push(q);
        const names = [this.nameOf(A), this.nameOf(B)];
        this.view(this.card('round 2, ' + (i + 1) + ' of ' + who.length, '<div class="mm-q">' + esc(q.q) + '</div><div class="mm-wait">Both tapping…</div>'));
        const p = this.ask({ [A]: { mode: 'who', text: q.q, opts: names, kicker: "Who's more likely?" }, [B]: { mode: 'who', text: q.q, opts: names, kicker: "Who's more likely?" } }, 20);
        await this.speak(q.q);
        const ans = await p;
        if (!this.active) break;
        const a = ans[A], b = ans[B], match = a != null && a === b;
        this.total++; if (match) { this.sync++; this.pts[A] += this.PTS_WHO; this.pts[B] += this.PTS_WHO; }
        this.view(this.card('round 2, ' + (i + 1) + ' of ' + who.length, this.reveal(q.q, [names[0] + ' says', a == null ? '—' : names[a]], [names[1] + ' says', b == null ? '—' : names[b]]) +
          '<div class="mm-verdict ' + (match ? 'yes' : 'no') + '">' + (match ? '💞 You agree! +' + this.PTS_WHO + ' each' : '😬 You don\'t agree!') + '</div>'));
        this.pair.forEach(id => this.send(id, { k: 'res', match, text: match ? '💞 You agree — ' + names[a] + '!' : '😬 You disagree!', pts: this.pts[id] }));
        await this.speak(match ? 'You both said ' + names[a] + '!' : names[0] + ' said ' + (a == null ? 'nobody' : names[a]) + ', but ' + names[1] + ' said ' + (b == null ? 'nobody' : names[b]) + '!');
        await this.sleep(1600);
      }
    }

    // ---- Round 3: the finale — numbers, double points
    if (this.active) {
      const nums = this.pick('num', this.NUM_Q);
      this.view(this.card('the finale', '<div class="mm-q">Double points!</div><div class="mm-wait">Guess a number about the other one. Spot on or within 10% scores ' + this.PTS_NUM + ', within 25% scores ' + (this.PTS_NUM / 2) + '.</div>'));
      await this.speak('The finale, for double points! Guess a number about each other.');
      await this.sleep(800);
      for (let i = 0; i < nums.length && this.active; i++) {
        const q = nums[i], subj = i % 2 ? B : A, guess = subj === A ? B : A;
        this.used.push(q);
        const qText = this.fill(q.q, subj);
        this.view(this.card('finale ' + (i + 1), '<div class="mm-q">' + esc(qText) + '</div><div class="mm-wait">' + esc(this.nameOf(subj)) + ' answers · ' + esc(this.nameOf(guess)) + ' guesses…</div>'));
        const p = this.ask({ [subj]: { mode: 'num', text: q.self, kicker: 'About YOU — be honest' }, [guess]: { mode: 'num', text: qText, kicker: 'Guess ' + this.nameOf(subj) + '\'s number' } }, 45);
        await this.speak(qText);
        const ans = await p;
        if (!this.active) break;
        const s = Number(ans[subj]), g = Number(ans[guess]);
        let pts = 0;
        if (ans[subj] != null && ans[guess] != null && isFinite(s) && isFinite(g)) {
          const diff = Math.abs(s - g), base = Math.max(1, Math.abs(s));
          pts = (diff <= Math.max(1, base * 0.10)) ? this.PTS_NUM : (diff <= base * 0.25) ? this.PTS_NUM / 2 : 0;
        }
        this.total++; if (pts === this.PTS_NUM) this.sync++;
        this.pts[guess] += pts;
        this.view(this.card('finale ' + (i + 1), this.reveal(qText, [this.nameOf(guess) + ' guessed', ans[guess] == null ? '—' : String(g)], [this.nameOf(subj) + ' said', ans[subj] == null ? '—' : String(s)]) +
          '<div class="mm-verdict ' + (pts ? 'yes' : 'no') + '">' + (pts === this.PTS_NUM ? '🎯 Spot on! +' + pts : pts ? '👌 Close! +' + pts : '💔 Way off') + '</div>'));
        this.pair.forEach(id => this.send(id, { k: 'res', match: pts > 0, text: (pts ? '🎯 +' + pts + ' — ' : '💔 ') + this.nameOf(subj) + ' said ' + (ans[subj] == null ? 'nothing' : s), pts: this.pts[id] }));
        await this.speak(this.nameOf(guess) + ' guessed ' + (ans[guess] == null ? 'nothing' : g) + '. ' + this.nameOf(subj) + ' said ' + (ans[subj] == null ? 'nothing' : s) + '. ' + (pts ? 'Points!' : 'Way off!'));
        await this.sleep(1800);
      }
    }
    return this.finish();
  },

  async finish() {
    const was = this.active;
    this.active = false;
    if (this.cur) this.settle();
    if (!this.pair) return false;
    const [A, B] = this.pair;
    const pct = this.total ? this.sync / this.total : 0;
    const bonus = was && pct >= this.SYNC_AT ? this.SYNC_BONUS : 0;
    [A, B].forEach(id => {
      const p = Host.players[id]; if (!p) return;
      const g = this.pts[id] + bonus;
      p.score += g; Quiz.roundGains[id] = g;
    });
    const winner = this.pts[A] === this.pts[B] ? null : (this.pts[A] > this.pts[B] ? A : B);
    const head = winner ? '🏆 ' + esc(this.nameOf(winner)) + ' knows ' + esc(this.nameOf(winner === A ? B : A)) + ' best!' : '🤝 You know each other equally well!';
    this.view(this.card('the result', '<div class="mm-big" style="margin:10px 0">' + head + '</div><div class="mm-q">💞 ' + Math.round(pct * 100) + '% in sync' +
      (bonus ? ' — perfect couple bonus, +' + bonus + ' each!' : ' (70% wins a +' + this.SYNC_BONUS + ' bonus each)') + '</div>'));
    this.pair.forEach(id => this.send(id, { k: 'end', text: (winner ? (winner === id ? '🏆 You know them best!' : '🙈 ' + this.nameOf(winner) + ' knows you better!') : '🤝 Dead heat!') +
      ' 💞 ' + Math.round(pct * 100) + '% in sync' + (bonus ? ' · +' + bonus + ' bonus each' : '') }));
    if (was) await this.speak((winner ? this.nameOf(winner) + ' knows ' + this.nameOf(winner === A ? B : A) + ' best!' : 'It\'s a dead heat!') +
      ' You were ' + Math.round(pct * 100) + ' percent in sync.' + (bonus ? ' That\'s the perfect couple bonus!' : ''));
    if (this.used.length) Seen.mark('mrmrs', this.used.map(q => ({ seenKey: 'mm:' + q.id })));
    Host.renderScores(); Host.snapshotRound('Mr & Mrs'); Host.pushBoard(); Host.saveGame();
    setTimeout(() => { const el = $('mmHost'); if (el && !this.active) el.classList.add('hidden'); }, 12000);
    return true;
  },
  stop() { this.active = false; try { speechSynthesis.cancel(); } catch (e) {} if (this.cur) this.settle(); }
};

/* ================= phone side ================= */
const MrMrsPhone = {
  box() { return $('mmBox'); },
  show(html) { const b = this.box(); b.innerHTML = '<div class="card" style="text-align:center">' + html + '</div>'; b.classList.remove('hidden'); },
  on(msg) {
    ['roundCard', 'revealBox', 'raceBox'].forEach(x => { const e = $(x); if (e) e.classList.add('hidden'); });
    if (msg.k === 'wait') { this.show('<div class="rc-name" style="font-size:1.15rem">' + esc(msg.text) + '</div>'); return; }
    if (msg.k === 'res') { this.show('<div class="rc-name" style="font-size:1.4rem">' + esc(msg.text) + '</div><div class="muted">Your points this round: ' + (msg.pts || 0) + '</div>'); Player.vibe && Player.vibe(msg.match ? [60, 40, 60] : 120); return; }
    if (msg.k === 'end') { this.show('<div class="rc-name" style="font-size:1.4rem">' + esc(msg.text) + '</div>'); return; }
    if (msg.k !== 'q') return;
    this.qid = msg.qid;
    const tint = msg.mode === 'self' ? '#ff7ab8' : msg.mode === 'guess' ? '#7fdcff' : '#ffd257';
    let body;
    if (msg.mode === 'num') {
      body = '<input id="mmNum" type="number" inputmode="numeric" style="font-size:2rem;width:100%;text-align:center;padding:10px;border-radius:12px;border:2px solid ' + tint + ';background:rgba(0,0,0,.3);color:#fff">' +
        '<button class="btn big green mt" style="width:100%" onclick="MrMrsPhone.num()">Lock it in</button>';
    } else {
      body = msg.opts.map((o, i) => '<button class="btn big" style="width:100%;margin-top:8px" onclick="MrMrsPhone.pick(' + i + ')">' + esc(o) + '</button>').join('');
    }
    this.show('<div class="rc-kicker" style="color:' + tint + '">' + esc(msg.kicker || '') + '</div><div class="rc-name" style="font-size:1.2rem;margin:8px 0">' + esc(msg.text) + '</div>' + body);
    Player.vibe && Player.vibe(40);
  },
  pick(i) { if (this.qid == null) return; const q = this.qid; this.qid = null; this.send({ type: 'mmAns', qid: q, v: i }); },
  num() {
    const v = parseFloat(($('mmNum') || {}).value);
    if (!isFinite(v)) return;
    const q = this.qid; this.qid = null; this.send({ type: 'mmAns', qid: q, v });
  },
  send(m) { try { Player.conn.send(m); } catch (e) {} }
};
