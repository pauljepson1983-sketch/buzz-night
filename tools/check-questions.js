/* ======================================================================
   CHECK THE QUESTION BANK

   Run this after editing questions.js, before pushing:

       node tools/check-questions.js

   It prints what the bank holds and anything wrong with it. "All good"
   means nothing structural is broken. It CANNOT tell you whether a fact is
   true — only a person can do that. What it catches is the mechanical stuff
   a read-through slides straight past:

     - the same question written twice
     - the answer sitting inside its own question
     - a "wrong" option that is really the answer again
     - wording that will be out of date in a year ("currently", "latest")
     - the length tell: if the right answer is visibly the longest option,
       people guessing just pick the long one
     - units that disagree between the bank and the game, which is a real
       bug that shipped once — landmark heights were being asked in metres
       while the game's own buildings round asked in feet, in the same round

   Exits with an error code if anything is wrong, so it can gate a push.
   ====================================================================== */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BANK = path.join(ROOT, 'questions.js');
const GAME = path.join(ROOT, 'index.html');

const problems = [];
const notes = [];
const flag = (where, msg) => problems.push(where + ' — ' + msg);

/* ---- load the bank --------------------------------------------------- */
global.window = {};
try {
  eval(fs.readFileSync(BANK, 'utf8'));
} catch (e) {
  console.log('Could not read questions.js at all:\n  ' + e.message +
              '\n\nThat is usually a missing comma or bracket.');
  process.exit(1);
}
const QUESTIONS = global.window.QUESTIONS || [];
const CLOSEST = global.window.CLOSEST || {};
const ONEOFFS = global.window.CLOSEST_ONEOFFS || [];

const STALE = /\b(currently|nowadays|so far|to date|latest|most recent|this year|last year|at present|richest|highest-grossing|best-selling|biggest-selling)\b/i;
const DIFFS = ['easy', 'medium', 'hard'];
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

/* ---- the multiple choice half ---------------------------------------- */
const byCat = {}, byDiff = {};
const ids = new Set(), asked = new Map();

QUESTIONS.forEach(item => {
  const at = item.id || '(a question with no id)';
  if (!item.id || !item.cat || !item.diff || !item.q || !item.a || !item.w) flag(at, 'missing one of id/cat/diff/q/a/w');
  if (ids.has(item.id)) flag(at, 'this id is used twice');
  ids.add(item.id);
  if (!DIFFS.includes(item.diff)) flag(at, 'difficulty is "' + item.diff + '", should be easy, medium or hard');

  byCat[item.cat] = (byCat[item.cat] || 0) + 1;
  byDiff[item.diff] = (byDiff[item.diff] || 0) + 1;

  const k = norm(item.q);
  if (asked.has(k)) flag(at, 'same question as ' + asked.get(k));
  asked.set(k, item.id);

  if (!Array.isArray(item.w) || item.w.length !== 3) {
    flag(at, 'needs exactly 3 wrong options, has ' + ((item.w || []).length));
    return;
  }
  const opts = [item.a].concat(item.w).map(norm);
  if (new Set(opts).size !== opts.length) flag(at, 'two of the four options are the same');
  if (norm(item.q).includes(norm(item.a)) && norm(item.a).length > 3) flag(at, 'the answer appears in the question');
  if (STALE.test(item.q)) flag(at, 'wording will go out of date: "' + item.q.match(STALE)[0] + '"');

  const wLen = item.w.reduce((n, x) => n + x.length, 0) / item.w.length;
  if (item.a.length > wLen * 1.7 && item.a.length - wLen > 6) {
    flag(at, 'the right answer is much longer than the other three — guessers will just pick it');
  }
});

/* ---- the closest-to half --------------------------------------------- */
let closestCount = 0;
Object.entries(CLOSEST).forEach(([key, cat]) => {
  if (typeof cat.q !== 'function') { flag(key, 'has no question wording (q)'); return; }
  if (typeof cat.vintage !== 'number') flag(key, 'has no vintage');
  if (cat.conv != null && typeof cat.conv !== 'function') flag(key, 'conv is set but is not a function');
  if (!Array.isArray(cat.items)) { flag(key, 'has no items list'); return; }

  closestCount += cat.items.length;
  if (cat.items.length < 10) notes.push(key + ' has only ' + cat.items.length + ' facts — thin, it will repeat');

  const names = new Set();
  cat.items.forEach(([name, value]) => {
    const at = key + ' / ' + name;
    if (typeof value !== 'number' || !isFinite(value)) { flag(at, 'the number is not a number'); return; }
    if (value <= 0) flag(at, 'the number is zero or negative');
    if (names.has(String(name).toLowerCase())) flag(at, 'listed twice');
    names.add(String(name).toLowerCase());
    if (String(name).includes(String(value))) flag(at, 'the name gives away its own answer');
    if (cat.unit === '' && (value < 1000 || value > 2030)) flag(at, value + ' does not look like a year');
  });

  const vals = cat.items.map(i => i[1]);
  if (vals.length && Math.max(...vals) === Math.min(...vals)) flag(key, 'every fact has the same number — nothing to guess between');
});

const oneOffAsked = new Set();
ONEOFFS.forEach(item => {
  const at = 'one-off / ' + String(item.q).slice(0, 40);
  if (typeof item.a !== 'number' || !isFinite(item.a)) flag(at, 'the number is not a number');
  if (oneOffAsked.has(norm(item.q))) flag(at, 'asked twice');
  oneOffAsked.add(norm(item.q));
  if (String(item.q).includes(String(item.a))) flag(at, 'the question gives away its own answer');
  if (STALE.test(item.q)) flag(at, 'wording will go out of date');
});

/* ---- do the bank and the game agree about units? ---------------------
   The real bug this exists for: landmark heights were written asking "in
   metres" while the game's own buildings round asks "in feet", so a single
   round put both on screen. Compare the question wording either side of the
   item name and flag any two that open the same way but end in a different
   unit. */
const opening = q => String(q).split('«X»')[0].trim().toLowerCase().replace(/[^a-z ]/g, '');
const shapes = {};
const addShape = (q, unit, source) => {
  const key = opening(q);
  if (!key) return;
  (shapes[key] = shapes[key] || []).push({ unit: String(unit || '').trim(), source });
};

Object.entries(CLOSEST).forEach(([key, cat]) => {
  if (typeof cat.q === 'function') addShape(cat.q('«X»'), cat.unit, 'questions.js: ' + key);
});

if (fs.existsSync(GAME)) {
  const html = fs.readFileSync(GAME, 'utf8');
  const start = html.indexOf('GUESS_KINDS: [');
  if (start === -1) {
    notes.push('could not find GUESS_KINDS in index.html, so the bank was not cross-checked against the game');
  } else {
    const body = html.slice(start + 'GUESS_KINDS: ['.length);
    const end = body.indexOf('\n  ],');
    try {
      const kinds = eval('[' + body.slice(0, end) + ']');
      kinds.forEach(k => { if (k && typeof k.q === 'function') addShape(k.q('«X»'), k.unit, 'index.html: ' + k.key); });
    } catch (e) {
      notes.push('could not read GUESS_KINDS out of index.html (' + e.message + '), so units were not cross-checked');
    }
  }
} else {
  notes.push('index.html not found next to the bank, so units were not cross-checked against the game');
}

Object.entries(shapes).forEach(([shape, uses]) => {
  const units = [...new Set(uses.map(u => u.unit))];
  if (units.length > 1) {
    flag('units', '"' + shape + '…" is asked in ' + units.map(u => u || '(no unit)').join(' and ') +
                  ' — ' + uses.map(u => u.source + ' uses "' + (u.unit || 'none') + '"').join(', '));
  }
});

/* ---- does one round give away another? -------------------------------
   Found by playing rather than reading: Fastest finger asked "which shopping
   centre opened in Gateshead in 1986?" while closest-wins asked "what year
   did the Metrocentre open?". Two rounds in the same night, and the first
   hands over the second. The history categories overlapped the same way.

   Flags an overlap when a multiple-choice question shares its subject with a
   closest-to fact AND the same number appears in either its answer or its
   wording. Both conditions have to hold, so it stays quiet on coincidence. */
const STOP = new Set(['the','a','an','of','in','on','at','did','does','what','which','was','were','year','open','opened','first','and','for','from','how','many','much','is','are','to','it','that','this','with','set','off','go','went','form','become']);
// crude stemming, so "the sinking of the Titanic" matches "did the Titanic sink"
const stem = w => w.replace(/(ings|ing|ed|es|s)$/, '');
const words = s => norm(s).split(' ').filter(w => w.length > 3 && !STOP.has(w)).map(stem);

const numberFacts = [];
Object.entries(CLOSEST).forEach(([key, cat]) => {
  (cat.items || []).forEach(([name, value]) => numberFacts.push({ where: key, name, value }));
});
ONEOFFS.forEach(o => numberFacts.push({ where: 'one-off', name: o.q, value: o.a }));

const overlaps = [];
QUESTIONS.forEach(item => {
  const haystack = norm(item.q + ' ' + item.a);
  // the answer counts as revealed too — "which centre opened in 1986? The
  // Metrocentre" names its subject only in the answer
  const qWords = new Set(words(item.q + ' ' + item.a));
  numberFacts.forEach(f => {
    const shared = words(f.name).filter(w => qWords.has(w));
    // two ordinary words, or one distinctive one — "Metrocentre" is the whole
    // subject on its own, so a flat two-word rule missed it
    if (!shared.length || (shared.length < 2 && !shared.some(w => w.length >= 6))) return;
    if (!haystack.includes(String(f.value))) return;     // number not present either side
    overlaps.push(item.id + ' gives away "' + String(f.name).slice(0, 48) + '" (' + f.where + ', ' + f.value + ')');
  });
});
overlaps.forEach(o => flag('overlap', o));

/* ---- say what happened ------------------------------------------------ */
const line = (n, label) => String(n).padStart(5) + '  ' + label;
console.log('\nWhat the bank holds');
console.log(line(QUESTIONS.length, 'multiple choice questions'));
Object.keys(byCat).sort().forEach(c => console.log(line(byCat[c], '   ' + c)));
console.log(line(DIFFS.map(d => byDiff[d] || 0).join(' / '), 'easy / medium / hard'));
console.log(line(closestCount, 'closest-to facts in ' + Object.keys(CLOSEST).length + ' categories'));
console.log(line(ONEOFFS.length, 'one-off numbers'));
console.log(line(closestCount + ONEOFFS.length + QUESTIONS.length, 'questions in total'));

/* ---- the map round ----------------------------------------------------
   A place whose coordinates fall outside its own map cannot be answered —
   the pin it is asking for is off the picture. buildPlaces drops those
   silently at build time, so a whole round can quietly come up short
   without anyone knowing why. Caught here instead. */
const MAPS = window.MAPS || {}, PLACES = window.PLACES || [];
PLACES.forEach(p => {
  const m = MAPS[p.map];
  if (!m) { problems.push(p.name + ' — no map called "' + p.map + '"'); return; }
  if (typeof p.lat !== 'number' || typeof p.lon !== 'number') {
    problems.push(p.name + ' — missing or non-numeric coordinates'); return;
  }
  if (m.proj && m.proj !== 'flat') return;   // curved maps need the real formula
  const x = (p.lon - m.w) / (m.e - m.w) * 100;
  const y = (m.n - p.lat) / (m.n - m.s) * 100;
  if (x < 0 || x > 100 || y < 0 || y > 100) {
    problems.push(p.name + ' — falls outside ' + p.map + ' (x ' + x.toFixed(1) + ', y ' + y.toFixed(1) + ')');
  } else if (x < 2 || x > 98 || y < 2 || y > 98) {
    notes.push(p.name + ' sits right on the edge of ' + p.map + ' — hard to pin');
  }
});
/* The same place on two different maps is deliberate — Cardiff is worth
   asking on a map of the UK and again on a map of Wales, and they are
   different questions. The same place twice on the SAME map is not. */
const dupPlace = {};
PLACES.forEach(p => {
  const k = p.name.toLowerCase() + '|' + p.map;
  if (dupPlace[k]) problems.push(p.name + ' — listed twice on the ' + p.map + ' map');
  dupPlace[k] = true;
});
const scales = {};
PLACES.forEach(p => { const k = p.name.toLowerCase(); (scales[k] = scales[k] || []).push(p.map); });
Object.keys(scales).filter(k => scales[k].length > 1).forEach(k => {
  notes.push(PLACES.find(p => p.name.toLowerCase() === k).name +
    ' is asked at two scales (' + scales[k].join(', ') + ')');
});
console.log(line(PLACES.length, 'places across ' + Object.keys(MAPS).length + ' maps'));

if (notes.length) {
  console.log('\nWorth knowing');
  notes.forEach(n => console.log('  · ' + n));
}

if (!problems.length) {
  console.log('\nAll good — nothing structurally wrong.');
  console.log('(It cannot check whether a fact is TRUE. That is still a person\'s job.)\n');
} else {
  console.log('\n' + problems.length + ' problem' + (problems.length === 1 ? '' : 's') + ' to fix');
  problems.forEach(p => console.log('  ✗ ' + p));
  console.log('');
  process.exit(1);
}
