/* The Chase — the computer Chasers.
   None of them "knows" anything: each question is a dice roll against the
   hit rate for that category (0–100). Speed = answers per minute in the
   final chase. Nerves = how much accuracy drops under pressure (0–10).
   All five are original characters. */
window.CHASE_CATS = {
  arts_and_literature: 'Art & books', film_and_tv: 'Film & TV', food_and_drink: 'Food & drink',
  general_knowledge: 'General knowledge', geography: 'Geography', history: 'History',
  music: 'Music', science: 'Science', society_and_culture: 'People & culture', sport_and_leisure: 'Sport'
};

window.CHASERS = [
  {
    id: 'professor', name: 'Professor Hugo Ashdown', nick: 'The Professor', emoji: '🎓',
    age: 61, gender: 'Male', from: 'Born in Edinburgh, lives in Oxford',
    job: 'Retired physics lecturer. Spent 30 years teaching first-years why toast lands butter-side down.',
    bio: 'Has read every encyclopaedia twice and every tabloid never. Owns 4,000 books and no television. Thinks "Strictly" is an adverb.',
    likes: 'Crosswords in pen, black coffee, being right', hates: 'Pop music, reality TV, being told he\'s wrong',
    quirk: 'Taps his glasses before every answer.',
    colour: '#3b6fd8',
    skill: { science: 92, history: 88, geography: 78, arts_and_literature: 74, general_knowledge: 72,
             society_and_culture: 62, food_and_drink: 60, sport_and_leisure: 52, film_and_tv: 46, music: 40 },
    speed: 11.2, nerves: 2,
    lines: {
      intro: 'Good evening. I do hope you\'ve revised.',
      catch: 'Caught. Do try to read more widely.',
      lose: 'Hmm. An outlier. Statistically insignificant.',
      wrong: 'A rounding error, nothing more.'
    }
  },
  {
    id: 'diva', name: 'Roxanne "Roxy" Vale', nick: 'The Diva', emoji: '🎤',
    age: 38, gender: 'Female', from: 'Manchester',
    job: 'Former session singer and cruise-ship quiz host. Has sung backing vocals on records you definitely own.',
    bio: 'Knows every Number One since 1952 and who wore what at every awards night. Geography ends at the M60.',
    likes: 'Karaoke, sequins, the final of anything', hates: 'Maths, maps, beige',
    quirk: 'Sings the first line of her answer when it\'s a music question.',
    colour: '#d83b8e',
    skill: { music: 94, film_and_tv: 90, society_and_culture: 80, food_and_drink: 70, general_knowledge: 66,
             arts_and_literature: 62, sport_and_leisure: 55, history: 54, geography: 46, science: 42 },
    speed: 11.4, nerves: 7,
    lines: {
      intro: 'Darling, this is MY stage.',
      catch: 'And that\'s a wrap, sweetie!',
      lose: 'I\'d like to speak to the producer.',
      wrong: 'I knew that. I was being generous.'
    }
  },
  {
    id: 'landlord', name: 'Tommy Robson', nick: 'The Landlord', emoji: '🍺',
    age: 52, gender: 'Male', from: 'Gateshead',
    job: 'Runs the pub quiz at his own boozer on Tyneside every Thursday for 22 years — and has never lost it.',
    bio: 'Encyclopaedic on football, darts, snooker and anything you can eat or drink. Thinks the Tate is a sugar company.',
    likes: 'A proper pint, Saturday 3pm, pork scratchings', hates: 'Opera, poetry, warm lager',
    quirk: 'Slams an imaginary bar when he gets one right.',
    colour: '#d88a1f',
    skill: { sport_and_leisure: 93, food_and_drink: 90, general_knowledge: 78, geography: 70, society_and_culture: 66,
             film_and_tv: 64, music: 62, history: 60, science: 50, arts_and_literature: 42 },
    speed: 11.3, nerves: 4,
    lines: {
      intro: 'Right then, pet. Let\'s have you.',
      catch: 'Last orders! You\'re barred.',
      lose: 'Fair play. Next round\'s on me.',
      wrong: 'Ah, give over, that\'s a southern question.'
    }
  },
  {
    id: 'librarian', name: 'Dr Imogen Hale', nick: 'The Librarian', emoji: '📚',
    age: 44, gender: 'Female', from: 'Born in Norwich, lives in York',
    job: 'Head of rare books at a university library. Can date a manuscript by smell.',
    bio: 'Has visited 61 countries and read the national novel of each one. Has never watched a football match on purpose.',
    likes: 'First editions, train journeys, silence', hates: 'Football, loud chewing, dog-eared pages',
    quirk: 'Says "Shh" when you answer before her.',
    colour: '#2f9e6e',
    skill: { arts_and_literature: 95, geography: 88, history: 82, society_and_culture: 74, general_knowledge: 70,
             science: 66, food_and_drink: 58, film_and_tv: 54, music: 50, sport_and_leisure: 38 },
    speed: 11, nerves: 3,
    lines: {
      intro: 'Please keep your voices down. And your hopes.',
      catch: 'Overdue. Your fine is everything.',
      lose: 'Well. That\'s a plot twist.',
      wrong: 'A misprint in my memory. Most irregular.'
    }
  },
  {
    id: 'boss', name: 'Victor Crane', nick: 'The Boss', emoji: '💀',
    age: null, gender: 'Male', from: 'Nobody knows',
    job: 'Unknown. Turns up in a black suit, never takes his sunglasses off.',
    bio: 'No weak spots, only slightly-less-strong spots. Only appears once you have beaten all four of the others.',
    likes: 'Winning', hates: 'Losing (it has happened twice)',
    quirk: 'Answers before the question has finished.',
    colour: '#2b2b33', locked: true,
    skill: { general_knowledge: 86, history: 84, science: 83, geography: 83, music: 82, film_and_tv: 82,
             sport_and_leisure: 81, arts_and_literature: 80, food_and_drink: 80, society_and_culture: 80 },
    speed: 12.2, nerves: 1,
    lines: {
      intro: 'You made it this far. That ends now.',
      catch: 'As expected.',
      lose: '...Again. Noted.',
      wrong: '.'
    }
  }
];

/* Illustrated portrait for each Chaser — drawn, not a photo. The prop in
   each one is their speciality. */
window.chaserPortrait = function (id, size) {
  size = size || 160;
  const skin = { professor: '#f1c9a5', diva: '#c98d63', landlord: '#e8b48f', librarian: '#f3d2b8', boss: '#d9b08c' }[id];
  const c = (window.CHASERS.find(x => x.id === id) || {}).colour || '#555';
  const parts = {
    professor:
      // grey swept hair, beard, round glasses, mortarboard, flask
      '<path d="M48 70 Q50 38 80 36 Q110 38 112 70 Q104 52 80 52 Q56 52 48 70Z" fill="#cfd3d8"/>' +
      '<path d="M58 96 Q80 128 102 96 Q100 116 80 120 Q60 116 58 96Z" fill="#cfd3d8"/>' +
      '<circle cx="68" cy="78" r="9" fill="none" stroke="#222" stroke-width="3"/><circle cx="92" cy="78" r="9" fill="none" stroke="#222" stroke-width="3"/><line x1="77" y1="78" x2="83" y2="78" stroke="#222" stroke-width="3"/><circle cx="68" cy="78" r="3" fill="#222"/><circle cx="92" cy="78" r="3" fill="#222"/>' +
      '<polygon points="40,34 80,18 120,34 80,50" fill="#222"/><rect x="66" y="38" width="28" height="10" fill="#222"/><line x1="112" y1="36" x2="116" y2="54" stroke="#ffd257" stroke-width="3"/>' +
      '<g transform="translate(118 112)"><path d="M6 0 h10 v10 l10 22 q2 6 -4 6 h-22 q-6 0 -4 -6 l10 -22z" fill="#e8f4ff" stroke="#222" stroke-width="2"/><path d="M4 26 h22 l4 8 q1 4 -3 4 h-24 q-4 0 -3 -4z" fill="#5fd68b"/></g>',
    diva:
      // big curly hair, hoop earrings, microphone, sparkle
      '<circle cx="54" cy="66" r="22" fill="#5a2a1a"/><circle cx="106" cy="66" r="22" fill="#5a2a1a"/><circle cx="80" cy="46" r="28" fill="#5a2a1a"/><circle cx="50" cy="96" r="16" fill="#5a2a1a"/><circle cx="110" cy="96" r="16" fill="#5a2a1a"/>' +
      '<circle cx="58" cy="94" r="6" fill="none" stroke="#ffd257" stroke-width="3"/><circle cx="102" cy="94" r="6" fill="none" stroke="#ffd257" stroke-width="3"/>' +
      '<ellipse cx="70" cy="78" rx="3.5" ry="4" fill="#222"/><ellipse cx="90" cy="78" rx="3.5" ry="4" fill="#222"/><path d="M64 70 l8 -3 M96 70 l-8 -3" stroke="#222" stroke-width="2"/>' +
      '<path d="M70 98 Q80 104 90 98" stroke="#b0204a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(112 104) rotate(20)"><rect x="0" y="14" width="8" height="34" rx="3" fill="#333"/><circle cx="4" cy="10" r="11" fill="#aaa"/><circle cx="4" cy="10" r="11" fill="url(#mesh)" opacity=".5"/></g>' +
      '<text x="26" y="40" font-size="18">✨</text><text x="120" y="34" font-size="14">🎵</text>',
    landlord:
      // bald with sides, big moustache, pint
      '<path d="M50 72 Q48 58 54 54 L56 76Z M110 72 Q112 58 106 54 L104 76Z" fill="#7a5a3a"/>' +
      '<path d="M62 94 Q72 86 80 92 Q88 86 98 94 Q90 100 80 96 Q70 100 62 94Z" fill="#7a5a3a"/>' +
      '<circle cx="70" cy="78" r="3.5" fill="#222"/><circle cx="90" cy="78" r="3.5" fill="#222"/>' +
      '<g transform="translate(112 100)"><rect x="0" y="6" width="26" height="40" rx="4" fill="#e09b2d" stroke="#222" stroke-width="2"/><rect x="0" y="0" width="26" height="10" rx="4" fill="#fffbe8" stroke="#222" stroke-width="2"/><path d="M26 14 q12 0 12 12 q0 12 -12 12" fill="none" stroke="#222" stroke-width="3"/></g>' +
      '<text x="22" y="40" font-size="18">⚽</text>',
    librarian:
      // neat bun, pencil, cat-eye glasses, open book
      '<circle cx="80" cy="34" r="14" fill="#8a3b2a"/><path d="M50 74 Q52 44 80 44 Q108 44 110 74 Q100 56 80 56 Q60 56 50 74Z" fill="#8a3b2a"/>' +
      '<line x1="66" y1="22" x2="94" y2="40" stroke="#ffd257" stroke-width="3"/>' +
      '<path d="M58 72 q10 -6 20 4 q-10 10 -20 2z M102 72 q-10 -6 -20 4 q10 10 20 2z" fill="none" stroke="#222" stroke-width="3"/>' +
      '<path d="M72 100 Q80 104 88 100" stroke="#a03a3a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<g transform="translate(104 112)"><path d="M0 4 Q14 0 24 6 Q34 0 48 4 V36 Q34 32 24 38 Q14 32 0 36Z" fill="#fff" stroke="#222" stroke-width="2"/><line x1="24" y1="6" x2="24" y2="38" stroke="#222" stroke-width="2"/></g>' +
      '<text x="22" y="40" font-size="18">🌍</text>',
    boss:
      // slicked hair, sunglasses, black suit
      '<path d="M50 70 Q50 40 80 38 Q112 40 110 70 Q104 50 80 52 Q60 50 50 70Z" fill="#111"/>' +
      '<rect x="56" y="70" width="20" height="12" rx="3" fill="#111"/><rect x="84" y="70" width="20" height="12" rx="3" fill="#111"/><line x1="76" y1="74" x2="84" y2="74" stroke="#111" stroke-width="3"/>' +
      '<path d="M70 100 L90 100" stroke="#5a3a2a" stroke-width="3" stroke-linecap="round"/>' +
      '<text x="120" y="40" font-size="18">👑</text>'
  };
  const body = id === 'boss'
    ? '<path d="M24 160 Q30 118 80 116 Q130 118 136 160Z" fill="#111"/><path d="M72 118 L80 140 L88 118Z" fill="#fff"/><path d="M78 122 L80 146 L82 122Z" fill="#b01020"/>'
    : '<path d="M24 160 Q30 118 80 116 Q130 118 136 160Z" fill="' + c + '"/>';
  return '<svg viewBox="0 0 160 160" width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Portrait of ' + id + '">' +
    '<defs><pattern id="mesh" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0L4 4M4 0L0 4" stroke="#222" stroke-width=".6"/></pattern></defs>' +
    '<rect width="160" height="160" rx="20" fill="' + c + '" opacity=".22"/>' + body +
    '<rect x="70" y="100" width="20" height="18" fill="' + skin + '"/>' +
    '<ellipse cx="80" cy="80" rx="28" ry="32" fill="' + skin + '"/>' +
    (id === 'professor' || id === 'boss' ? '' : '') + parts[id] +
    (['professor', 'boss', 'librarian'].includes(id) ? '' : '') +
    '</svg>';
};
