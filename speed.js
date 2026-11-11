/* Speed rounds — fastest finger first, nothing needs Spotify.

   Every one is an ordinary four-option quiz question underneath, so they ride
   the existing round engine (timer, scoring, first-in bonus, leaderboard).
   What differs is how the question is shown, carried on three fields:
     flashMs     how long the picture is up before the answers appear
     fx          'keep' leaves the picture up with the answers; 'zoom' keeps it
                 and slowly pulls back from a close-up
     promptLate  hold the question back until the answers appear (so a memory
                 grid isn't solved by knowing what to count)
   Pictures for colour, memory and reaction are drawn here as SVG, so there is
   nothing to download and nothing to fail. */
(function () {
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const svg = (w, h, body, bg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">' +
    '<rect width="100%" height="100%" rx="18" fill="' + (bg || '#1b1036') + '"/>' + body + '</svg>');
  const four = (right, pool) => {   // right answer + three different wrong ones, shuffled
    const wrong = shuffle(pool.filter(x => String(x) !== String(right))).slice(0, 3);
    const options = shuffle([right].concat(wrong)).map(String);
    return { options, correct: options.indexOf(String(right)), answer: String(right) };
  };
  const rank = (mode, items) => (window.Seen && Seen.rank) ? Seen.rank(mode, items) : shuffle(items);

  /* ---------- 🏳️ flags ---------- */
  const FLAGS = [['gb','United Kingdom'],['ie','Ireland'],['fr','France'],['de','Germany'],['es','Spain'],['pt','Portugal'],['it','Italy'],['nl','Netherlands'],
    ['be','Belgium'],['ch','Switzerland'],['at','Austria'],['dk','Denmark'],['se','Sweden'],['no','Norway'],['fi','Finland'],['is','Iceland'],['pl','Poland'],
    ['cz','Czechia'],['gr','Greece'],['tr','Turkey'],['hr','Croatia'],['hu','Hungary'],['ro','Romania'],['ua','Ukraine'],['ru','Russia'],['us','USA'],
    ['ca','Canada'],['mx','Mexico'],['br','Brazil'],['ar','Argentina'],['cl','Chile'],['co','Colombia'],['pe','Peru'],['jm','Jamaica'],['cu','Cuba'],
    ['au','Australia'],['nz','New Zealand'],['jp','Japan'],['cn','China'],['kr','South Korea'],['in','India'],['pk','Pakistan'],['th','Thailand'],
    ['vn','Vietnam'],['id','Indonesia'],['ph','Philippines'],['my','Malaysia'],['sg','Singapore'],['za','South Africa'],['ng','Nigeria'],['ke','Kenya'],
    ['eg','Egypt'],['ma','Morocco'],['gh','Ghana'],['et','Ethiopia'],['sa','Saudi Arabia'],['ae','UAE'],['il','Israel'],['ir','Iran'],['iq','Iraq'],
    ['gb-sct','Scotland'],['gb-wls','Wales'],['gb-eng','England'],['lu','Luxembourg'],['mt','Malta'],['cy','Cyprus'],['ee','Estonia'],['lv','Latvia'],
    ['lt','Lithuania'],['sk','Slovakia'],['si','Slovenia'],['rs','Serbia'],['bg','Bulgaria'],['al','Albania'],['np','Nepal'],['bd','Bangladesh'],
    ['lk','Sri Lanka'],['qa','Qatar'],['ve','Venezuela'],['uy','Uruguay'],['bo','Bolivia'],['ec','Ecuador'],['tn','Tunisia'],['dz','Algeria'],
    ['sn','Senegal'],['cm','Cameroon'],['tz','Tanzania'],['ug','Uganda'],['zw','Zimbabwe'],['mn','Mongolia'],['kz','Kazakhstan'],['ge','Georgia']];
  function flags(count) {
    return rank('flags', FLAGS.map(([c, n]) => ({ c, n, seenKey: 'flag:' + c }))).slice(0, count).map(f => ({
      kind: 'speed', seenKey: f.seenKey, label: f.n, prompt: 'Which flag was that?',
      img: 'https://flagcdn.com/w640/' + f.c + '.png', flashMs: 1200,
      ...four(f.n, FLAGS.map(x => x[1]))
    }));
  }

  /* ---------- 🎨 colour clash ---------- */
  const COLS = [['RED','#ff3b3b'],['BLUE','#3b82ff'],['GREEN','#22c55e'],['YELLOW','#ffd400'],['PURPLE','#a855f7'],['ORANGE','#ff8a00'],['PINK','#ff4fb8']];
  function colour(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const word = pick(COLS);
      const ink = pick(COLS.filter(c => c[0] !== word[0]));
      const fs = word[0].length > 5 ? 96 : 120;
      const img = svg(600, 600, '<text x="300" y="' + (300 + fs * 0.35) + '" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="' + fs + '" text-anchor="middle" fill="' + ink[1] + '">' + word[0] + '</text>', '#f4f1ff');
      const opts = shuffle([ink[0], word[0]].concat(shuffle(COLS.map(c => c[0]).filter(c => c !== ink[0] && c !== word[0])).slice(0, 2)));
      out.push({ kind: 'speed', seenKey: 'clash' + Date.now() + i, label: 'Colour clash', prompt: 'Tap the colour of the INK — not the word!',
        img, fx: 'keep', flashMs: 0, options: opts, correct: opts.indexOf(ink[0]), answer: ink[0] });
    }
    return out;
  }

  /* ---------- 🟢 wait for green ---------- */
  function green(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const img = svg(600, 600, '<text x="300" y="285" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="84" text-anchor="middle" fill="#fff">WAIT</text><text x="300" y="380" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="84" text-anchor="middle" fill="#fff">FOR IT…</text>', '#d62839');
      out.push({ kind: 'speed', seenKey: 'green' + Date.now() + i, label: 'Wait for green', prompt: 'Tap the moment it says GO!',
        img, flashMs: 1800 + Math.round(Math.random() * 4500),
        options: ['🟢 GO!'], correct: 0, answer: 'the fastest tap' });
    }
    return out;
  }

  /* ---------- ➗ quick maths ---------- */
  function maths(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = pick(['x', 'x', '+', '-', '+']);
      let a, b, r, s;
      if (t === 'x') { a = 2 + Math.floor(Math.random() * 11); b = 2 + Math.floor(Math.random() * 11); r = a * b; s = a + ' × ' + b; }
      else if (t === '+') { a = 12 + Math.floor(Math.random() * 80); b = 12 + Math.floor(Math.random() * 80); r = a + b; s = a + ' + ' + b; }
      else { a = 40 + Math.floor(Math.random() * 60); b = 5 + Math.floor(Math.random() * 35); r = a - b; s = a + ' − ' + b; }
      // near misses, so it can't be done by eye
      const near = shuffle([r + 1, r - 1, r + 2, r - 2, r + 10, r - 10, r + (t === 'x' ? a : 3), r - (t === 'x' ? b : 3)].filter(x => x > 0 && x !== r));
      const opts = shuffle([r].concat(near.slice(0, 3))).map(String);
      out.push({ kind: 'speed', seenKey: 'maths' + Date.now() + i, label: s, prompt: s + ' = ?', flashMs: 0,
        options: opts, correct: opts.indexOf(String(r)), answer: String(r) });
    }
    return out;
  }

  /* ---------- 🧠 memory grid ---------- */
  const EMO = ['🍕','🐶','⚽','🚗','🍌','⭐','🎸','🐸','🍩','🎈','🦆','🍓'];
  function memory(count) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const pool = shuffle(EMO).slice(0, 4);
      const target = pool[0];
      const n = 2 + Math.floor(Math.random() * 4);                  // 2–5 of the target
      const cells = shuffle(Array(n).fill(target).concat(Array.from({ length: 9 - n }, () => pick(pool.slice(1)))));
      const body = cells.map((e, k) => '<text x="' + (100 + (k % 3) * 200) + '" y="' + (135 + Math.floor(k / 3) * 190) + '" font-size="120" text-anchor="middle">' + e + '</text>').join('');
      const opts = shuffle([n, n - 1, n + 1, n + 2].filter(x => x >= 1)).slice(0, 4).map(String);
      if (!opts.includes(String(n))) opts[0] = String(n);
      out.push({ kind: 'speed', seenKey: 'grid' + Date.now() + i, label: 'Memory grid', prompt: 'How many ' + target + ' were there?', promptLate: true,
        img: svg(600, 600, body, '#f4f1ff'), flashMs: 3000, options: shuffle(opts), answer: String(n) });
      const q = out[out.length - 1]; q.correct = q.options.indexOf(String(n));
    }
    return out;
  }

  /* ---------- 🎬 emoji films ---------- */
  const FILMS = [['🦁👑','The Lion King'],['❄️👸','Frozen'],['🕷️🧑','Spider-Man'],['🦈🌊','Jaws'],['🚢🧊💔','Titanic'],['🧙‍♂️💍🌋','The Lord of the Rings'],
    ['⚡👓🧙','Harry Potter'],['🦖🏝️','Jurassic Park'],['👻🚫🔫','Ghostbusters'],['🏠🎄😱','Home Alone'],['🐠🔍','Finding Nemo'],['🧸🤠🚀','Toy Story'],
    ['👽📞🏠','E.T.'],['🥊🐯🎵','Rocky'],['🚗⏰🔙','Back to the Future'],['👠🐟🧜‍♀️','The Little Mermaid'],['🐼🥋','Kung Fu Panda'],['🌹👹','Beauty and the Beast'],
    ['🍫🏭🎩','Charlie and the Chocolate Factory'],['🦇🃏','The Dark Knight'],['💍🔥👸⚔️','Shrek'],['🏴‍☠️🌊⚓','Pirates of the Caribbean'],['🧞🪔🐒','Aladdin'],
    ['🐒👑🏙️','King Kong'],['🦍🏝️💥','Kong: Skull Island'],['👩‍🚀🌌⏳','Interstellar'],['🔴💊🔵🕶️','The Matrix'],['🕵️‍♂️🍸🔫','James Bond'],
    ['🧑‍🚀🌕🚀','Apollo 13'],['🎈🏠👴','Up'],['🤖🌱❤️','WALL-E'],['🐭👨‍🍳🍲','Ratatouille'],['🐝🎬','Bee Movie'],['👰🏃‍♀️','Runaway Bride'],
    ['🧟‍♂️🌍💥','World War Z'],['👑💃🇬🇧','The Crown'],['🦸‍♂️🛡️🇺🇸','Captain America'],['🔨⚡👱','Thor'],['🟢😡💪','The Hulk'],['🤖🚗🔁','Transformers'],
    ['🐉🔥🧑','How to Train Your Dragon'],['🎤👑🐎','Bohemian Rhapsody'],['🍷🧀🐀','Ratatouille'],['🏝️🏐','Cast Away'],['🎓🏫🍀','Grease'],
    ['💃🕺🪩','Saturday Night Fever'],['🐧💃','Happy Feet'],['🚂🧙‍♂️🏰','Harry Potter'],['🐟🔵🧠','Finding Dory'],['🦸‍♀️⚔️🏝️','Wonder Woman'],
    ['🐘👂🎪','Dumbo'],['🐕🐕💯','101 Dalmatians'],['🧑‍🍳🐀','Ratatouille'],['👨‍👦🐟','Finding Nemo'],['☂️👩‍🍼🎩','Mary Poppins'],['🔍🎩🇬🇧','Sherlock Holmes'],
    ['🧊❄️⛄🎶','Frozen'],['🌪️👠🦁','The Wizard of Oz'],['🍑🌍🐛','James and the Giant Peach'],['🎂👶👴','The Curious Case of Benjamin Button'],
    ['🕰️🐊🏴‍☠️','Peter Pan'],['🐻🍯🎈','Winnie the Pooh'],['🐻🧥🍊','Paddington'],['👴🏠🎈🐕','Up'],['🎅🧝🏻‍♂️','Elf'],['🥶🏔️🛷','Cool Runnings'],
    ['🏏🦍','Planet of the Apes'],['🧠😡😢😄','Inside Out'],['💀🎸🌼','Coco'],['🏎️⚡','Cars'],['🦸‍♂️👨‍👩‍👧‍👦','The Incredibles'],['🐀👨‍🍳','Ratatouille'],
    ['🔫🍿🎰','Ocean\'s Eleven'],['💰🏦🔫','The Italian Job'],['⚽🇬🇧👩','Bend It Like Beckham'],['👞👠💃🎄','Love Actually'],['🧔🏻‍♂️🛁💍','Four Weddings and a Funeral'],
    ['🩳🕺🏭','The Full Monty'],['🐑🔪👨‍⚕️','The Silence of the Lambs'],['🏨🔪🚿','Psycho'],['👦🏻🎈🤡','It']];
  function films(count) {
    const seen = new Set();
    const uniq = FILMS.filter(([e, t]) => { if (seen.has(t)) return false; seen.add(t); return true; });
    return rank('emojifilms', uniq.map(([e, t]) => ({ e, t, seenKey: 'ef:' + t }))).slice(0, count).map(f => ({
      kind: 'speed', seenKey: f.seenKey, label: f.t, prompt: 'Which film?', fx: 'keep', flashMs: 0,
      img: svg(600, 600, '<text x="300" y="350" font-size="' + ([...f.e].length > 4 ? 120 : 150) + '" text-anchor="middle">' + f.e + '</text>', '#f4f1ff'),
      ...four(f.t, uniq.map(x => x[1]))
    }));
  }

  /* ---------- ⚡ flash logo & 🔍 zoom out: the existing logo list ---------- */
  async function logos(count, how) {
    const qs = await Quiz.buildLogos(count);
    return qs.map(q => Object.assign(q, {
      kind: 'speed', img: q.url, prompt: how === 'zoom' ? 'Whose logo? It\'s zooming out…' : 'Which logo was that?',
      fx: how === 'zoom' ? 'zoom' : null, flashMs: how === 'zoom' ? 0 : 1000, words: false
    }));
  }

  window.Speed = {
    MODES: {
      zoomout:   { label: '🔍 Zoom out', title: '🔍 Zoom out', noun: 'Picture', secs: 12, build: n => logos(n, 'zoom'),
                   howto: 'A logo starts zoomed right in and pulls back. Answer the moment you know it — the sooner, the more points.' },
      flashlogo: { label: '⚡ Flash logo', title: '⚡ Flash logo', noun: 'Logo', secs: 8, build: n => logos(n, 'flash'),
                   howto: 'A logo flashes up for one second, then it is gone. Which one was it?' },
      flags:     { label: '🏳️ Flag flash', title: '🏳️ Flag flash', noun: 'Flag', secs: 8, build: flags,
                   howto: 'A flag flashes up for a second. Name the country — fastest wins.' },
      memgrid:   { label: '🧠 Memory grid', title: '🧠 Memory grid', noun: 'Grid', secs: 8, build: memory,
                   howto: 'Nine pictures for three seconds. Then one question about them — count fast!' },
      clash:     { label: '🎨 Colour clash', title: '🎨 Colour clash', noun: 'Word', secs: 6, build: colour,
                   howto: 'Tap the colour the word is PRINTED in, not what it says. Harder than it sounds.' },
      green:     { label: '🟢 Wait for green', title: '🟢 Wait for green', noun: 'Go', secs: 4, build: green,
                   howto: 'Red screen… wait… the GO button appears at a random moment. Fastest tap wins.' },
      maths:     { label: '➗ Quick maths', title: '➗ Quick maths', noun: 'Sum', secs: 8, build: maths,
                   howto: 'A sum, four answers, all close. Fastest right answer wins.' },
      emojifilms:{ label: '🎬 Emoji films', title: '🎬 Emoji films', noun: 'Film', secs: 10, build: films,
                   howto: 'Work out the film from the emojis. Fastest right answer wins.' }
    },
    has(mode) { return !!this.MODES[mode]; },
    async build(mode, count) {
      const qs = await this.MODES[mode].build(count);
      if (window.Quiz) Quiz.available = qs.length;
      return qs;
    }
  };
})();

/* fold the speed rounds into the game's lists once everything has loaded */
window.addEventListener('load', () => {
  try {
    Object.entries(Speed.MODES).forEach(([k, m]) => {
      Quiz.TITLES[k] = m.title; Quiz.NOUNS[k] = m.noun; Quiz.HOWTO[k] = m.howto;
      Night.LABELS[k] = m.label;
      if (!Night.NO_DECADE.includes(k)) Night.NO_DECADE.push(k);
    });
  } catch (e) { console.warn('speed rounds: could not register', e); }
});
