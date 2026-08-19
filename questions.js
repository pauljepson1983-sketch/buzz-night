/* ======================================================================
   BUZZ NIGHT — written question bank (pilot batch, 19 Aug 2026)

   Kept OUT of index.html deliberately: the game file is already 233KB and
   painful to work in, and questions get added far more often than the
   engine changes.

   A .js file rather than .json so it still loads when index.html is opened
   straight off the hard drive — a local fetch() of a .json file is blocked
   by the browser, a <script src> is not.

   Shape (fixed — changing it after a few hundred questions is a job):
     id    unique, category prefix + number, never reused
     cat   category key
     diff  easy | medium | hard  — for building a round with a curve
     q     the question, as the phone shows it
     a     the correct answer
     w     exactly three wrong options, plausible but definitively wrong

   RULES THESE FOLLOW, so later batches match:
   - Nothing that changes with time. No "currently", no populations, no
     "highest-grossing", no record a new discovery moves. A bank is written
     once and read for years.
   - Nothing contested. "Which actor played Bond the most times" was written
     and binned — Connery has six official films plus one that isn't, so the
     room argues. If a pub could reasonably disagree, it doesn't go in.
   - Wrong options are real things. Café Nervosa is Frasier's coffee shop,
     Nancy Astor really was the first woman MP to take her seat. A made-up
     option is a free point.
   - British living room, mixed ages. Spread across generations on purpose:
     Fawlty Towers for one end of the sofa, MTV's first video for the other.
   ====================================================================== */
window.QUESTIONS = [

  /* --- GEOGRAPHY ---------------------------------------------------- */
  { id:'geo-001', cat:'geography', diff:'easy',   q:'What is the capital of Australia?', a:'Canberra', w:['Sydney','Melbourne','Perth'] },
  { id:'geo-002', cat:'geography', diff:'medium', q:'What is the longest river in the UK?', a:'The Severn', w:['The Thames','The Trent','The Great Ouse'] },
  { id:'geo-003', cat:'geography', diff:'easy',   q:'Mount Everest sits on the border of Nepal and which other country?', a:'China', w:['India','Bhutan','Pakistan'] },
  { id:'geo-004', cat:'geography', diff:'medium', q:'Which English county is known as the Garden of England?', a:'Kent', w:['Devon','Surrey','Sussex'] },
  { id:'geo-005', cat:'geography', diff:'easy',   q:'Which is the smallest country in the world by area?', a:'Vatican City', w:['Monaco','San Marino','Liechtenstein'] },
  { id:'geo-006', cat:'geography', diff:'medium', q:'Schiphol Airport serves which European city?', a:'Amsterdam', w:['Brussels','Copenhagen','Hamburg'] },
  { id:'geo-007', cat:'geography', diff:'medium', q:'Which UK city uses the postcode letters NE?', a:'Newcastle', w:['Norwich','Nottingham','Northampton'] },
  { id:'geo-008', cat:'geography', diff:'easy',   q:'Which mountain range separates Spain from France?', a:'The Pyrenees', w:['The Alps','The Apennines','The Carpathians'] },
  { id:'geo-009', cat:'geography', diff:'medium', q:'What is the capital of Canada?', a:'Ottawa', w:['Toronto','Vancouver','Montreal'] },
  { id:'geo-010', cat:'geography', diff:'hard',   q:'Which is the largest lake in the UK by surface area?', a:'Lough Neagh', w:['Loch Lomond','Loch Ness','Windermere'] },

  /* --- FILM & TV ---------------------------------------------------- */
  { id:'flm-001', cat:'filmtv', diff:'easy',   q:'Who directed Jaws, E.T. and Jurassic Park?', a:'Steven Spielberg', w:['George Lucas','James Cameron','Ridley Scott'] },
  { id:'flm-002', cat:'filmtv', diff:'medium', q:'In Only Fools and Horses, what is the name of Del Boy and Rodney’s local pub?', a:'The Nag’s Head', w:['The Queen Vic','The Rovers Return','The Winchester'] },
  { id:'flm-003', cat:'filmtv', diff:'easy',   q:'Who was the first actor to play James Bond in a cinema film?', a:'Sean Connery', w:['Roger Moore','George Lazenby','Timothy Dalton'] },
  { id:'flm-004', cat:'filmtv', diff:'easy',   q:'What is the name of the coffee shop in Friends?', a:'Central Perk', w:['The Grind','Java Joe’s','Café Nervosa'] },
  { id:'flm-005', cat:'filmtv', diff:'medium', q:'In The Wizard of Oz, what does the Tin Man ask the Wizard for?', a:'A heart', w:['A brain','Courage','A way home'] },
  { id:'flm-006', cat:'filmtv', diff:'easy',   q:'Which soap opera is set in the town of Weatherfield?', a:'Coronation Street', w:['EastEnders','Brookside','Emmerdale Farm'] },
  { id:'flm-007', cat:'filmtv', diff:'medium', q:'Who played Willy Wonka in the 1971 film?', a:'Gene Wilder', w:['Johnny Depp','Peter Sellers','Dick Van Dyke'] },
  { id:'flm-008', cat:'filmtv', diff:'hard',   q:'Which film features the line “Here’s looking at you, kid”?', a:'Casablanca', w:['Gone with the Wind','Citizen Kane','The Maltese Falcon'] },
  { id:'flm-009', cat:'filmtv', diff:'easy',   q:'In Doctor Who, what everyday object is the TARDIS disguised as?', a:'A police box', w:['A phone box','A wardrobe','A garden shed'] },
  { id:'flm-010', cat:'filmtv', diff:'medium', q:'In Fawlty Towers, what is the name of the Spanish waiter?', a:'Manuel', w:['Miguel','Pedro','Carlos'] },

  /* --- MUSIC -------------------------------------------------------- */
  { id:'mus-001', cat:'music', diff:'easy',   q:'Which band released the album The Dark Side of the Moon?', a:'Pink Floyd', w:['Led Zeppelin','The Who','Genesis'] },
  { id:'mus-002', cat:'music', diff:'medium', q:'Which Beatle was known as “the quiet one”?', a:'George Harrison', w:['Ringo Starr','John Lennon','Paul McCartney'] },
  { id:'mus-003', cat:'music', diff:'easy',   q:'Which singer is known as the Queen of Soul?', a:'Aretha Franklin', w:['Diana Ross','Tina Turner','Etta James'] },
  { id:'mus-004', cat:'music', diff:'easy',   q:'Which instrument has 88 keys?', a:'The piano', w:['The organ','The accordion','The harpsichord'] },
  { id:'mus-005', cat:'music', diff:'easy',   q:'Which city did Oasis come from?', a:'Manchester', w:['Liverpool','Leeds','Sheffield'] },
  { id:'mus-006', cat:'music', diff:'medium', q:'Who wrote and first recorded “I Will Always Love You”, later a huge hit for Whitney Houston?', a:'Dolly Parton', w:['Tina Turner','Carole King','Aretha Franklin'] },
  { id:'mus-007', cat:'music', diff:'medium', q:'Which music festival is held at Worthy Farm in Somerset?', a:'Glastonbury', w:['Reading','Download','Isle of Wight'] },
  { id:'mus-008', cat:'music', diff:'easy',   q:'Which country did ABBA come from?', a:'Sweden', w:['Norway','Denmark','Finland'] },
  { id:'mus-009', cat:'music', diff:'medium', q:'Who composed The Four Seasons?', a:'Vivaldi', w:['Bach','Mozart','Handel'] },
  { id:'mus-010', cat:'music', diff:'hard',   q:'Which song was the very first music video played on MTV?', a:'Video Killed the Radio Star', w:['Bette Davis Eyes','Every Breath You Take','Girls on Film'] },

  /* --- SCIENCE & NATURE --------------------------------------------- */
  { id:'sci-001', cat:'science', diff:'easy',   q:'What is the chemical symbol for gold?', a:'Au', w:['Ag','Gd','Go'] },
  { id:'sci-002', cat:'science', diff:'easy',   q:'Which planet is known as the Red Planet?', a:'Mars', w:['Venus','Jupiter','Mercury'] },
  { id:'sci-003', cat:'science', diff:'easy',   q:'What is the largest animal on Earth?', a:'The blue whale', w:['The African elephant','The giant squid','The sperm whale'] },
  { id:'sci-004', cat:'science', diff:'medium', q:'How many bones are there in the adult human body?', a:'206', w:['186','226','306'] },
  { id:'sci-005', cat:'science', diff:'medium', q:'How many hearts does an octopus have?', a:'Three', w:['One','Two','Eight'] },
  { id:'sci-006', cat:'science', diff:'easy',   q:'What is the hardest natural substance on Earth?', a:'Diamond', w:['Quartz','Granite','Steel'] },
  { id:'sci-007', cat:'science', diff:'medium', q:'Which metal is liquid at room temperature?', a:'Mercury', w:['Lead','Tin','Aluminium'] },
  { id:'sci-008', cat:'science', diff:'medium', q:'What is the fear of confined spaces called?', a:'Claustrophobia', w:['Agoraphobia','Arachnophobia','Acrophobia'] },
  { id:'sci-009', cat:'science', diff:'easy',   q:'Which vitamin do we mainly get from sunlight?', a:'D', w:['C','A','B12'] },
  { id:'sci-010', cat:'science', diff:'hard',   q:'Roughly how long does sunlight take to reach the Earth?', a:'About 8 minutes', w:['About 8 seconds','About 8 hours','It arrives instantly'] },

  /* --- HISTORY ------------------------------------------------------ */
  { id:'his-001', cat:'history', diff:'easy',   q:'Which king was killed at the Battle of Hastings?', a:'King Harold', w:['William the Conqueror','Edward the Confessor','Richard the Lionheart'] },
  { id:'his-002', cat:'history', diff:'easy',   q:'Which English king had six wives?', a:'Henry VIII', w:['Henry VII','George III','Charles II'] },
  { id:'his-003', cat:'history', diff:'easy',   q:'Who was the first person to walk on the Moon?', a:'Neil Armstrong', w:['Buzz Aldrin','Yuri Gagarin','Michael Collins'] },
  { id:'his-004', cat:'history', diff:'easy',   q:'Who was Britain’s first woman Prime Minister?', a:'Margaret Thatcher', w:['Theresa May','Barbara Castle','Nancy Astor'] },
  { id:'his-005', cat:'history', diff:'medium', q:'Which port did the Titanic sail from on her maiden voyage?', a:'Southampton', w:['Liverpool','Belfast','Plymouth'] },
  { id:'his-006', cat:'history', diff:'medium', q:'Where did the Great Fire of London start?', a:'A bakery in Pudding Lane', w:['A brewery on Fleet Street','A candle shop in Cheapside','A tavern on Thames Street'] },
  { id:'his-007', cat:'history', diff:'medium', q:'Which ship carried the Pilgrims to America in 1620?', a:'The Mayflower', w:['The Golden Hind','The Endeavour','The Victory'] },
  { id:'his-008', cat:'history', diff:'medium', q:'Which British monarch reigned for the longest?', a:'Elizabeth II', w:['Queen Victoria','George III','Henry III'] },
  { id:'his-009', cat:'history', diff:'medium', q:'Britain fought which country in the Falklands War of 1982?', a:'Argentina', w:['Chile','Spain','Brazil'] },
  { id:'his-010', cat:'history', diff:'hard',   q:'Who was Prime Minister when Britain entered the Second World War?', a:'Neville Chamberlain', w:['Winston Churchill','Clement Attlee','Stanley Baldwin'] },

  /* ==================================================================
     THE FUN HALF.

     The five categories above are correct but dry — "capital of
     Australia" is a question nobody reacts to. These are written to a
     different bar: the right answer should get a noise out of the room.
     Weird-but-true, myth-busting, and things with a daft name.

     Myth-busters are the best of the lot, because half the room is
     confidently wrong: the hot part of a chilli is the white pith, not
     the seeds; your blood is never blue; SOS doesn't stand for anything.
     ================================================================== */

  /* --- WEIRD BUT TRUE ----------------------------------------------- */
  { id:'wei-001', cat:'weird', diff:'medium', q:'What is a group of flamingos called?', a:'A flamboyance', w:['A flutter','A blush','A dazzle'] },
  { id:'wei-002', cat:'weird', diff:'medium', q:'What is a group of crows called?', a:'A murder', w:['A chatter','A shadow','A gang'] },
  { id:'wei-003', cat:'weird', diff:'medium', q:'What is a group of owls called?', a:'A parliament', w:['A senate','A congress','A council'] },
  { id:'wei-004', cat:'weird', diff:'hard',   q:'How long can a snail sleep for?', a:'Up to three years', w:['Up to three days','Up to three weeks','Up to three months'] },
  { id:'wei-005', cat:'weird', diff:'medium', q:'Which animal produces square poo?', a:'The wombat', w:['The koala','The platypus','The armadillo'] },
  { id:'wei-006', cat:'weird', diff:'medium', q:'What colour is an octopus’s blood?', a:'Blue', w:['Red','Green','Clear'] },
  { id:'wei-007', cat:'weird', diff:'hard',   q:'Botanically speaking, which of these is a true berry?', a:'A banana', w:['A strawberry','A raspberry','A cherry'] },
  { id:'wei-008', cat:'weird', diff:'medium', q:'Which is the only mammal that cannot jump?', a:'The elephant', w:['The hippo','The rhino','The sloth'] },
  { id:'wei-009', cat:'weird', diff:'medium', q:'What is a baby hedgehog called?', a:'A hoglet', w:['A piglet','A kit','A pup'] },
  { id:'wei-010', cat:'weird', diff:'hard',   q:'How many noses does a slug have?', a:'Four', w:['One','Two','None'] },
  { id:'wei-011', cat:'weird', diff:'hard',   q:'Where is a shrimp’s heart?', a:'In its head', w:['In its tail','In its legs','It hasn’t got one'] },
  { id:'wei-012', cat:'weird', diff:'medium', q:'Which food has been found still edible in ancient Egyptian tombs?', a:'Honey', w:['Bread','Cheese','Wine'] },
  { id:'wei-013', cat:'weird', diff:'medium', q:'Which is the loudest land animal?', a:'The howler monkey', w:['The African lion','The African elephant','The hippopotamus'] },
  { id:'wei-014', cat:'weird', diff:'medium', q:'Which animal sleeps the most?', a:'The koala', w:['The sloth','The cat','The lion'] },
  { id:'wei-015', cat:'weird', diff:'hard',   q:'What was Play-Doh originally sold as?', a:'A wallpaper cleaner', w:['A modelling clay for schools','A hand soap','A wood glue'] },
  { id:'wei-016', cat:'weird', diff:'hard',   q:'What was bubble wrap originally invented to be?', a:'Wallpaper', w:['Packaging','Loft insulation','A mattress'] },
  { id:'wei-017', cat:'weird', diff:'hard',   q:'What is the dot over a lower-case “i” called?', a:'A tittle', w:['A jot','A pip','A dotter'] },
  { id:'wei-018', cat:'weird', diff:'hard',   q:'What is the plastic tip on the end of a shoelace called?', a:'An aglet', w:['A ferrule','A tag','A nib'] },
  { id:'wei-019', cat:'weird', diff:'hard',   q:'What is the groove between your nose and top lip called?', a:'The philtrum', w:['The glabella','The frenulum','The columella'] },

  /* --- FOOD & DRINK -------------------------------------------------- */
  { id:'foo-001', cat:'food', diff:'hard',   q:'Which is the hottest part of a chilli?', a:'The white pith', w:['The seeds','The skin','The stalk'] },
  { id:'foo-002', cat:'food', diff:'easy',   q:'Which country does feta cheese come from?', a:'Greece', w:['Italy','Turkey','Cyprus'] },
  { id:'foo-003', cat:'food', diff:'medium', q:'Which nut is marzipan made from?', a:'Almond', w:['Hazelnut','Walnut','Cashew'] },
  { id:'foo-004', cat:'food', diff:'medium', q:'Which beans are used in tinned baked beans?', a:'Haricot', w:['Kidney','Butter','Borlotti'] },
  { id:'foo-005', cat:'food', diff:'hard',   q:'The croissant is associated with France, but which country is it originally from?', a:'Austria', w:['Belgium','Switzerland','Italy'] },
  { id:'foo-006', cat:'food', diff:'medium', q:'What flavour is Cointreau?', a:'Orange', w:['Cherry','Almond','Aniseed'] },
  { id:'foo-007', cat:'food', diff:'easy',   q:'What is tofu made from?', a:'Soya beans', w:['Rice','Wheat','Chickpeas'] },
  { id:'foo-008', cat:'food', diff:'medium', q:'Which spice is the most expensive by weight?', a:'Saffron', w:['Vanilla','Cardamom','Nutmeg'] },
  { id:'foo-009', cat:'food', diff:'medium', q:'Which jam traditionally goes into a Bakewell tart?', a:'Raspberry', w:['Strawberry','Blackcurrant','Apricot'] },
  { id:'foo-010', cat:'food', diff:'hard',   q:'Which of these chocolate bars was sold in Britain first?', a:'Mars bar', w:['Kit Kat','Twix','Wispa'] },
  { id:'foo-011', cat:'food', diff:'medium', q:'What does “al dente” literally mean?', a:'To the tooth', w:['In the mouth','To the taste','On the plate'] },
  { id:'foo-012', cat:'food', diff:'easy',   q:'Which drink is known as “the black stuff”?', a:'Guinness', w:['Newcastle Brown','Coca-Cola','Espresso'] },
  { id:'foo-013', cat:'food', diff:'medium', q:'How many pints are there in a UK gallon?', a:'Eight', w:['Six','Ten','Twelve'] },
  { id:'foo-014', cat:'food', diff:'medium', q:'What gives black pudding its colour?', a:'Blood', w:['Liver','Treacle','Kidney'] },
  { id:'foo-015', cat:'food', diff:'hard',   q:'Which fish is in Worcestershire sauce?', a:'Anchovy', w:['Sardine','Herring','Cod'] },

  /* --- THE HUMAN BODY ------------------------------------------------ */
  { id:'bod-001', cat:'body', diff:'hard',   q:'What colour is the blood inside your veins?', a:'Red', w:['Blue','Green','Clear'] },
  { id:'bod-002', cat:'body', diff:'medium', q:'Roughly how much of the human body is water?', a:'60%', w:['30%','45%','80%'] },
  { id:'bod-003', cat:'body', diff:'medium', q:'Where is the smallest bone in the human body?', a:'In the ear', w:['In the toe','In the nose','In the wrist'] },
  { id:'bod-004', cat:'body', diff:'medium', q:'What are fingernails made of?', a:'Keratin', w:['Collagen','Calcium','Chitin'] },
  { id:'bod-005', cat:'body', diff:'medium', q:'Which organ can grow itself back?', a:'The liver', w:['The kidney','The lung','The spleen'] },
  { id:'bod-006', cat:'body', diff:'hard',   q:'Which is the strongest muscle in the body for its size?', a:'The jaw', w:['The tongue','The heart','The calf'] },

  /* --- WORDS & SAYINGS ----------------------------------------------- */
  { id:'wor-001', cat:'words', diff:'hard',   q:'What does SOS stand for?', a:'Nothing at all', w:['Save Our Souls','Save Our Ship','Send Out Succour'] },
  { id:'wor-002', cat:'words', diff:'hard',   q:'Which is the only common English word ending in “mt”?', a:'Dreamt', w:['Burnt','Learnt','Kempt'] },
  { id:'wor-003', cat:'words', diff:'medium', q:'Which letter appears most often in written English?', a:'E', w:['A','T','S'] },
  { id:'wor-004', cat:'words', diff:'medium', q:'A murmuration is a flock of which bird?', a:'Starlings', w:['Swallows','Sparrows','Swifts'] },
  { id:'wor-005', cat:'words', diff:'medium', q:'What does “quid pro quo” mean?', a:'Something for something', w:['Money for nothing','Here and there','By the way'] },
  { id:'wor-006', cat:'words', diff:'medium', q:'What is a group of larks called?', a:'An exaltation', w:['A rejoicing','An ascension','A chorus'] },

  /* --- HOME PATCH: TYNESIDE & THE NORTH EAST -------------------------
     The category the room will shout loudest at, and the one where a wrong
     answer will be spotted instantly — everyone playing lives here. Kept to
     things that are firmly on the record (opening dates, who made what)
     rather than anything that depends on who you ask down the pub.

     PAUL: check these harder than the rest. You know Gateshead and I don't.
     ------------------------------------------------------------------- */
  { id:'loc-001', cat:'local', diff:'medium', q:'Who created the Angel of the North?', a:'Antony Gormley', w:['Anish Kapoor','Henry Moore','Damien Hirst'] },
  { id:'loc-002', cat:'local', diff:'easy',   q:'Which bridge over the Tyne tilts to let boats through?', a:'The Gateshead Millennium Bridge', w:['The Tyne Bridge','The High Level Bridge','The Redheugh Bridge'] },
  { id:'loc-003', cat:'local', diff:'medium', q:'BALTIC in Gateshead was converted from what?', a:'A flour mill', w:['A shipyard','A power station','A railway shed'] },
  { id:'loc-004', cat:'local', diff:'easy',   q:'Which ground do Newcastle United play at?', a:'St James’ Park', w:['The Stadium of Light','The Riverside','Victoria Park'] },
  { id:'loc-005', cat:'local', diff:'easy',   q:'What is Newcastle United’s nickname?', a:'The Magpies', w:['The Black Cats','The Boro','The Mackems'] },
  { id:'loc-006', cat:'local', diff:'easy',   q:'Which shopping centre sits beside the A1 in Gateshead?', a:'The Metrocentre', w:['Eldon Square','Dalton Park','Silverlink'] },
  { id:'loc-007', cat:'local', diff:'easy',   q:'Which Roman wall runs across the North East?', a:'Hadrian’s Wall', w:['The Antonine Wall','Offa’s Dyke','The Devil’s Dyke'] },
  { id:'loc-008', cat:'local', diff:'hard',   q:'The Tyne Bridge was built by the same firm as which famous bridge?', a:'Sydney Harbour Bridge', w:['The Golden Gate Bridge','The Forth Bridge','Tower Bridge'] },
  { id:'loc-009', cat:'local', diff:'easy',   q:'Which presenting duo come from Newcastle?', a:'Ant and Dec', w:['French and Saunders','Hale and Pace','Mitchell and Webb'] },
  { id:'loc-010', cat:'local', diff:'medium', q:'Which children’s TV drama was set in Newcastle?', a:'Byker Grove', w:['Grange Hill','Press Gang','Hollyoaks'] },
  { id:'loc-011', cat:'local', diff:'medium', q:'Which North East city has a World Heritage cathedral and castle?', a:'Durham', w:['York','Carlisle','Lancaster'] },
  { id:'loc-012', cat:'local', diff:'medium', q:'Which railway pioneer was born in Wylam, Northumberland?', a:'George Stephenson', w:['Isambard Kingdom Brunel','James Watt','Richard Trevithick'] },
  { id:'loc-013', cat:'local', diff:'hard',   q:'Which Sunderland-born inventor demonstrated an early electric light bulb?', a:'Joseph Swan', w:['Thomas Edison','Michael Faraday','Humphry Davy'] },
  { id:'loc-014', cat:'local', diff:'medium', q:'Which seaside town is home to the Spanish City dome?', a:'Whitley Bay', w:['Tynemouth','South Shields','Cullercoats'] },
  { id:'loc-015', cat:'local', diff:'medium', q:'Which city were the Jarrow marchers heading for?', a:'London', w:['Edinburgh','Manchester','Birmingham'] },
  { id:'loc-016', cat:'local', diff:'medium', q:'What is Newcastle’s covered Victorian market called?', a:'The Grainger Market', w:['The Bigg Market','The Quayside Market','Eldon Market'] },
  { id:'loc-017', cat:'local', diff:'medium', q:'The man on top of Grey’s Monument gave his name to what?', a:'A type of tea', w:['A bridge','A biscuit','A breed of dog'] },
  { id:'loc-018', cat:'local', diff:'medium', q:'Someone from Newcastle is a Geordie. What is someone from Sunderland?', a:'A Mackem', w:['A Smoggie','A Sand Dancer','A Monkey Hanger'] },
  { id:'loc-019', cat:'local', diff:'easy',   q:'What is a stottie?', a:'A round flat loaf', w:['A meat pie','A sponge cake','A milky pudding'] },
  { id:'loc-020', cat:'local', diff:'easy',   q:'Which North East club are nicknamed the Black Cats?', a:'Sunderland', w:['Newcastle United','Middlesbrough','Hartlepool United'] },
  { id:'loc-021', cat:'local', diff:'medium', q:'Which band had a hit with “Fog on the Tyne”?', a:'Lindisfarne', w:['The Animals','Dire Straits','Prefab Sprout'] },
  { id:'loc-022', cat:'local', diff:'medium', q:'Which Newcastle band recorded “House of the Rising Sun”?', a:'The Animals', w:['Lindisfarne','The Shadows','The Kinks'] },
  { id:'loc-023', cat:'local', diff:'medium', q:'Where does the Great North Run finish?', a:'South Shields', w:['Newcastle','Sunderland','Tynemouth'] },
  { id:'loc-024', cat:'local', diff:'medium', q:'Which Northumberland castle stood in for Hogwarts on film?', a:'Alnwick Castle', w:['Bamburgh Castle','Warkworth Castle','Dunstanburgh Castle'] },
  { id:'loc-025', cat:'local', diff:'hard',   q:'Whose Northumberland home was the first house lit by hydroelectric power?', a:'Lord Armstrong', w:['Lord Leverhulme','George Hudson','The Duke of Northumberland'] },
  { id:'loc-026', cat:'local', diff:'hard',   q:'Which Roman fort stood at Wallsend?', a:'Segedunum', w:['Arbeia','Vindolanda','Housesteads'] },
  { id:'loc-027', cat:'local', diff:'medium', q:'Which novelist, famous for her North East sagas, was born in South Shields?', a:'Catherine Cookson', w:['Barbara Taylor Bradford','Jilly Cooper','Maeve Binchy'] },
  { id:'loc-028', cat:'local', diff:'easy',   q:'Which river flows through Durham?', a:'The Wear', w:['The Tyne','The Tees','The Coquet'] },
  { id:'loc-029', cat:'local', diff:'easy',   q:'What colour is the Tyne Bridge painted?', a:'Green', w:['Blue','Red','Grey'] },
  { id:'loc-030', cat:'local', diff:'medium', q:'Which Northumberland island is cut off by the tide twice a day?', a:'Holy Island', w:['Coquet Island','The Farne Islands','Brownsman Island'] },
  { id:'loc-031', cat:'local', diff:'easy',   q:'Finish the saying: carrying coals to…', a:'Newcastle', w:['Sunderland','Durham','Middlesbrough'] },
  { id:'loc-032', cat:'local', diff:'hard',   q:'Newcastle Brown Ale is known locally by which nickname?', a:'The Dog', w:['The Cat','The Horse','The Bird'] },
  { id:'loc-033', cat:'local', diff:'hard',   q:'Newcastle is named after a castle built in which century?', a:'The 11th', w:['The 9th','The 13th','The 15th'] },
  { id:'loc-034', cat:'local', diff:'medium', q:'Which sweeping Newcastle street is often voted one of England’s finest?', a:'Grey Street', w:['Northumberland Street','Pilgrim Street','Dean Street'] },
  { id:'loc-035', cat:'local', diff:'hard',   q:'Which creatures appear on Newcastle United’s club crest?', a:'Seahorses', w:['Magpies','Lions','Dragons'] },
  { id:'loc-036', cat:'local', diff:'hard',   q:'Which travelling fair is held on Newcastle’s Town Moor?', a:'The Hoppings', w:['The Goose Fair','St Giles Fair','Barnet Fair'] },

  /* ==================================================================
     BATCH THREE — taking the round from 132 to 250.

     Written to a deliberately narrower rule than the earlier batches,
     because at this volume a wrong answer is likely unless the material
     is chosen to prevent one. Everything here is a SETTLED fact: a
     definition, a fixed historical event, a rule of a sport, a name.

     Ruled out on purpose, however tempting:
       - superlatives that move (biggest, fastest, most capped)
       - anything a governing body or a discovery can change
       - "first ever" claims, which almost always have a rival claimant
       - close calls where two reference books disagree

     The one exception is where a superlative is fixed by geology or
     definition rather than by record-keeping — the Pacific is the
     largest ocean and will be next year.
     ================================================================== */

  /* --- GEOGRAPHY ------------------------------------------------------ */
  { id:'geo-011', cat:'geography', diff:'easy',   q:'Which is the largest ocean?', a:'The Pacific', w:['The Atlantic','The Indian','The Arctic'] },
  { id:'geo-012', cat:'geography', diff:'medium', q:'What is the capital of New Zealand?', a:'Wellington', w:['Auckland','Christchurch','Dunedin'] },
  { id:'geo-013', cat:'geography', diff:'easy',   q:'Which is the largest hot desert in the world?', a:'The Sahara', w:['The Gobi','The Kalahari','The Mojave'] },
  { id:'geo-014', cat:'geography', diff:'easy',   q:'Which river flows through Cairo?', a:'The Nile', w:['The Tigris','The Euphrates','The Jordan'] },
  { id:'geo-015', cat:'geography', diff:'medium', q:'Mount Kilimanjaro is in which country?', a:'Tanzania', w:['Kenya','Uganda','Ethiopia'] },
  { id:'geo-016', cat:'geography', diff:'medium', q:'What is the capital of Brazil?', a:'Brasília', w:['Rio de Janeiro','São Paulo','Salvador'] },
  { id:'geo-017', cat:'geography', diff:'medium', q:'Which strait separates Spain from Morocco?', a:'Gibraltar', w:['The Bosphorus','The Dardanelles','The Kattegat'] },
  { id:'geo-018', cat:'geography', diff:'easy',   q:'How many countries make up the United Kingdom?', a:'Four', w:['Two','Three','Five'] },
  { id:'geo-019', cat:'geography', diff:'medium', q:'Which capital city is split by the Danube into halves called Buda and Pest?', a:'Budapest', w:['Vienna','Bratislava','Belgrade'] },
  { id:'geo-020', cat:'geography', diff:'easy',   q:'What is the currency of Japan?', a:'The yen', w:['The won','The yuan','The rupee'] },
  { id:'geo-021', cat:'geography', diff:'easy',   q:'Which country has a maple leaf on its flag?', a:'Canada', w:['Lebanon','Norway','Austria'] },
  { id:'geo-022', cat:'geography', diff:'medium', q:'Which country is famous for its fjords?', a:'Norway', w:['Sweden','Finland','Denmark'] },
  { id:'geo-023', cat:'geography', diff:'medium', q:'Which sea is so salty that swimmers float in it?', a:'The Dead Sea', w:['The Black Sea','The Red Sea','The Caspian Sea'] },
  { id:'geo-024', cat:'geography', diff:'hard',   q:'Which is the deepest trench in the ocean?', a:'The Mariana Trench', w:['The Java Trench','The Tonga Trench','The Puerto Rico Trench'] },

  /* --- FILM & TV ------------------------------------------------------ */
  { id:'flm-011', cat:'filmtv', diff:'easy',   q:'In Star Wars, who turns out to be Luke Skywalker’s father?', a:'Darth Vader', w:['Obi-Wan Kenobi','Emperor Palpatine','Han Solo'] },
  { id:'flm-012', cat:'filmtv', diff:'medium', q:'Which hobbit carries the ring in The Lord of the Rings?', a:'Frodo', w:['Sam','Pippin','Merry'] },
  { id:'flm-013', cat:'filmtv', diff:'easy',   q:'In Toy Story, what sort of toy is Woody?', a:'A cowboy doll', w:['A spaceman','A dinosaur','A soldier'] },
  { id:'flm-014', cat:'filmtv', diff:'easy',   q:'Who played Jack in Titanic?', a:'Leonardo DiCaprio', w:['Matthew McConaughey','Christian Bale','Matt Damon'] },
  { id:'flm-015', cat:'filmtv', diff:'medium', q:'Which film is set on the moon Pandora?', a:'Avatar', w:['Interstellar','Dune','Prometheus'] },
  { id:'flm-016', cat:'filmtv', diff:'medium', q:'What is the family name in The Godfather?', a:'Corleone', w:['Soprano','Gambino','Barzini'] },
  { id:'flm-017', cat:'filmtv', diff:'medium', q:'Which film features the line “You’re gonna need a bigger boat”?', a:'Jaws', w:['Titanic','The Perfect Storm','Moby Dick'] },
  { id:'flm-018', cat:'filmtv', diff:'easy',   q:'Which animated film features a green ogre and a talking donkey?', a:'Shrek', w:['Madagascar','Monsters, Inc.','Ice Age'] },
  { id:'flm-019', cat:'filmtv', diff:'easy',   q:'Who played Indiana Jones?', a:'Harrison Ford', w:['Kurt Russell','Michael Douglas','Tom Selleck'] },
  { id:'flm-020', cat:'filmtv', diff:'medium', q:'What is the name of the school in Grease?', a:'Rydell High', w:['Ridgemont High','Bayside High','Sunnydale High'] },
  { id:'flm-021', cat:'filmtv', diff:'medium', q:'Which Hitchcock film features a murder in a shower?', a:'Psycho', w:['The Birds','Vertigo','Rear Window'] },
  { id:'flm-022', cat:'filmtv', diff:'medium', q:'In Breaking Bad, what name does Walter White go by?', a:'Heisenberg', w:['Schrödinger','Bohr','Planck'] },
  { id:'flm-023', cat:'filmtv', diff:'easy',   q:'Which TV series features a fight for the Iron Throne?', a:'Game of Thrones', w:['The Witcher','Vikings','The Last Kingdom'] },
  { id:'flm-024', cat:'filmtv', diff:'medium', q:'Who played Mary Poppins in the 1964 film?', a:'Julie Andrews', w:['Audrey Hepburn','Angela Lansbury','Deborah Kerr'] },
  { id:'flm-025', cat:'filmtv', diff:'medium', q:'Which film is set in a hotel called the Overlook?', a:'The Shining', w:['Psycho','The Grand Budapest Hotel','Barton Fink'] },
  { id:'flm-026', cat:'filmtv', diff:'easy',   q:'Which soap opera is set in Albert Square?', a:'EastEnders', w:['Coronation Street','Emmerdale','Doctors'] },
  { id:'flm-027', cat:'filmtv', diff:'medium', q:'Who played Danny in the film Grease?', a:'John Travolta', w:['Patrick Swayze','Richard Gere','Kevin Bacon'] },
  { id:'flm-028', cat:'filmtv', diff:'hard',   q:'In The Simpsons, what is Homer’s middle name?', a:'Jay', w:['John','James','Joseph'] },

  /* --- MUSIC ---------------------------------------------------------- */
  { id:'mus-011', cat:'music', diff:'easy',   q:'Which Beatles album cover shows the band on a zebra crossing?', a:'Abbey Road', w:['Revolver','Let It Be','Rubber Soul'] },
  { id:'mus-012', cat:'music', diff:'easy',   q:'Who is the lead singer of the Rolling Stones?', a:'Mick Jagger', w:['Keith Richards','Ronnie Wood','Charlie Watts'] },
  { id:'mus-013', cat:'music', diff:'easy',   q:'Which instrument was Jimi Hendrix famous for playing?', a:'The guitar', w:['The drums','The saxophone','The piano'] },
  { id:'mus-014', cat:'music', diff:'easy',   q:'Who sang “Like a Prayer”?', a:'Madonna', w:['Cyndi Lauper','Whitney Houston','Kylie Minogue'] },
  { id:'mus-015', cat:'music', diff:'easy',   q:'Freddie Mercury was the lead singer of which band?', a:'Queen', w:['The Who','Deep Purple','Slade'] },
  { id:'mus-016', cat:'music', diff:'hard',   q:'What surname was Elton John born with?', a:'Dwight', w:['Wright','Dight','Wightman'] },
  { id:'mus-017', cat:'music', diff:'medium', q:'Which Motown group did Diana Ross sing with?', a:'The Supremes', w:['The Ronettes','The Shirelles','The Marvelettes'] },
  { id:'mus-018', cat:'music', diff:'medium', q:'Who wrote and sang “Imagine”?', a:'John Lennon', w:['Paul McCartney','George Harrison','Bob Dylan'] },
  { id:'mus-019', cat:'music', diff:'medium', q:'Thom Yorke is the singer of which band?', a:'Radiohead', w:['Coldplay','Muse','Blur'] },
  { id:'mus-020', cat:'music', diff:'easy',   q:'Which country was Bob Marley from?', a:'Jamaica', w:['Trinidad','Barbados','Cuba'] },
  { id:'mus-021', cat:'music', diff:'easy',   q:'Who sang “Rolling in the Deep”?', a:'Adele', w:['Amy Winehouse','Duffy','Jessie J'] },
  { id:'mus-022', cat:'music', diff:'medium', q:'Which 1969 festival did Jimi Hendrix famously close?', a:'Woodstock', w:['Monterey','Altamont','the Isle of Wight'] },
  { id:'mus-023', cat:'music', diff:'medium', q:'Which band sang “Don’t Look Back in Anger”?', a:'Oasis', w:['Blur','Pulp','The Verve'] },
  { id:'mus-024', cat:'music', diff:'easy',   q:'What does DJ stand for?', a:'Disc jockey', w:['Dance jockey','Double jack','Direct jockey'] },
  { id:'mus-025', cat:'music', diff:'medium', q:'Which composer kept writing music after going deaf?', a:'Beethoven', w:['Mozart','Chopin','Schubert'] },
  { id:'mus-026', cat:'music', diff:'easy',   q:'Who is known as the King of Rock and Roll?', a:'Elvis Presley', w:['Chuck Berry','Little Richard','Buddy Holly'] },
  { id:'mus-027', cat:'music', diff:'medium', q:'Which Welsh singer had a hit with “It’s Not Unusual”?', a:'Tom Jones', w:['Shirley Bassey','Harry Secombe','Aled Jones'] },
  { id:'mus-028', cat:'music', diff:'easy',   q:'How many members were there in the Beatles?', a:'Four', w:['Three','Five','Six'] },

  /* --- SCIENCE & NATURE ----------------------------------------------- */
  { id:'sci-011', cat:'science', diff:'easy',   q:'What is H₂O better known as?', a:'Water', w:['Salt','Sugar','Ammonia'] },
  { id:'sci-012', cat:'science', diff:'easy',   q:'How many planets are there in the solar system?', a:'Eight', w:['Seven','Nine','Ten'] },
  { id:'sci-013', cat:'science', diff:'easy',   q:'Which force keeps us on the ground?', a:'Gravity', w:['Friction','Magnetism','Inertia'] },
  { id:'sci-014', cat:'science', diff:'medium', q:'What is the centre of an atom called?', a:'The nucleus', w:['The electron','The proton','The isotope'] },
  { id:'sci-015', cat:'science', diff:'medium', q:'At sea level, what temperature does water boil at in Celsius?', a:'100', w:['90','110','120'] },
  { id:'sci-016', cat:'science', diff:'medium', q:'Which gas makes up most of the air we breathe?', a:'Nitrogen', w:['Oxygen','Carbon dioxide','Hydrogen'] },
  { id:'sci-017', cat:'science', diff:'medium', q:'What is the study of fossils called?', a:'Palaeontology', w:['Archaeology','Geology','Anthropology'] },
  { id:'sci-018', cat:'science', diff:'medium', q:'Who proposed the theory of evolution by natural selection?', a:'Charles Darwin', w:['Gregor Mendel','Carl Linnaeus','Alfred Nobel'] },
  { id:'sci-019', cat:'science', diff:'easy',   q:'Which is the largest planet in the solar system?', a:'Jupiter', w:['Saturn','Neptune','Uranus'] },
  { id:'sci-020', cat:'science', diff:'medium', q:'What does a barometer measure?', a:'Air pressure', w:['Temperature','Humidity','Wind speed'] },
  { id:'sci-021', cat:'science', diff:'medium', q:'What is frozen carbon dioxide known as?', a:'Dry ice', w:['Black ice','Sea ice','Hard water'] },
  { id:'sci-022', cat:'science', diff:'medium', q:'How many chambers does the human heart have?', a:'Four', w:['Two','Three','Six'] },
  { id:'sci-023', cat:'science', diff:'hard',   q:'Which vitamin is also called ascorbic acid?', a:'Vitamin C', w:['Vitamin A','Vitamin D','Vitamin K'] },
  { id:'sci-024', cat:'science', diff:'medium', q:'Which ship did Charles Darwin make his famous voyage on?', a:'HMS Beagle', w:['HMS Victory','HMS Endeavour','HMS Discovery'] },

  /* --- HISTORY -------------------------------------------------------- */
  { id:'his-011', cat:'history', diff:'medium', q:'Who was the first Roman emperor?', a:'Augustus', w:['Julius Caesar','Nero','Tiberius'] },
  { id:'his-012', cat:'history', diff:'medium', q:'Which civilisation built Machu Picchu?', a:'The Inca', w:['The Aztecs','The Maya','The Olmecs'] },
  { id:'his-013', cat:'history', diff:'easy',   q:'Which US President was assassinated in Dallas in 1963?', a:'John F Kennedy', w:['Abraham Lincoln','Franklin Roosevelt','Lyndon Johnson'] },
  { id:'his-014', cat:'history', diff:'medium', q:'Who led the Soviet Union during the Second World War?', a:'Stalin', w:['Lenin','Trotsky','Khrushchev'] },
  { id:'his-015', cat:'history', diff:'medium', q:'The Boer War was fought in which country?', a:'South Africa', w:['Afghanistan','Mesopotamia','Egypt'] },
  { id:'his-016', cat:'history', diff:'easy',   q:'Who was the first President of the United States?', a:'George Washington', w:['Thomas Jefferson','John Adams','Benjamin Franklin'] },
  { id:'his-017', cat:'history', diff:'medium', q:'Which queen was known as the Virgin Queen?', a:'Elizabeth I', w:['Mary I','Anne','Victoria'] },
  { id:'his-018', cat:'history', diff:'medium', q:'Who wrote the wartime diary published as The Diary of a Young Girl?', a:'Anne Frank', w:['Vera Brittain','Sophie Scholl','Etty Hillesum'] },
  { id:'his-019', cat:'history', diff:'hard',   q:'Which empire was ruled from Constantinople?', a:'The Byzantine Empire', w:['The Persian Empire','The Holy Roman Empire','The Mughal Empire'] },
  { id:'his-020', cat:'history', diff:'medium', q:'Who is credited with discovering penicillin?', a:'Alexander Fleming', w:['Edward Jenner','Louis Pasteur','Joseph Lister'] },
  { id:'his-021', cat:'history', diff:'medium', q:'Which Egyptian queen died in 30 BC?', a:'Cleopatra', w:['Nefertiti','Hatshepsut','Berenice'] },
  { id:'his-022', cat:'history', diff:'easy',   q:'Which country was ruled by Tsars?', a:'Russia', w:['Germany','Austria','Poland'] },
  { id:'his-023', cat:'history', diff:'medium', q:'Which wall was built across northern England by the Romans?', a:'Hadrian’s Wall', w:['The Antonine Wall','Offa’s Dyke','The Great Wall'] },
  { id:'his-024', cat:'history', diff:'hard',   q:'Which country did Britain hand Hong Kong back to in 1997?', a:'China', w:['Japan','Taiwan','Singapore'] },

  /* --- THE HUMAN BODY -------------------------------------------------- */
  { id:'bod-007', cat:'body', diff:'medium', q:'How many teeth does an adult usually have?', a:'32', w:['28','30','36'] },
  { id:'bod-008', cat:'body', diff:'medium', q:'Which is the largest organ of the human body?', a:'The skin', w:['The liver','The lungs','The brain'] },
  { id:'bod-009', cat:'body', diff:'medium', q:'Which part of the eye controls the size of the pupil?', a:'The iris', w:['The cornea','The retina','The lens'] },
  { id:'bod-010', cat:'body', diff:'medium', q:'What is the medical name for the kneecap?', a:'The patella', w:['The tibia','The fibula','The femur'] },
  { id:'bod-011', cat:'body', diff:'hard',   q:'How many pairs of ribs does a person usually have?', a:'12', w:['10','14','16'] },
  { id:'bod-012', cat:'body', diff:'medium', q:'What connects muscle to bone?', a:'A tendon', w:['A ligament','A cartilage','A nerve'] },
  { id:'bod-013', cat:'body', diff:'medium', q:'Which blood cells fight infection?', a:'White blood cells', w:['Red blood cells','Platelets','Plasma cells'] },
  { id:'bod-014', cat:'body', diff:'hard',   q:'What is the medical term for the voice box?', a:'The larynx', w:['The pharynx','The trachea','The oesophagus'] },

  /* --- WORDS & SAYINGS -------------------------------------------------- */
  { id:'wor-007', cat:'words', diff:'medium', q:'What is a group of geese on the ground called?', a:'A gaggle', w:['A skein','A flock','A clutch'] },
  { id:'wor-008', cat:'words', diff:'medium', q:'What is a word that reads the same backwards called?', a:'A palindrome', w:['An anagram','A homonym','An acronym'] },
  { id:'wor-009', cat:'words', diff:'easy',   q:'How many letters are there in the English alphabet?', a:'26', w:['24','25','28'] },
  { id:'wor-010', cat:'words', diff:'medium', q:'What is a baby swan called?', a:'A cygnet', w:['A gosling','A duckling','A poult'] },
  { id:'wor-011', cat:'words', diff:'medium', q:'What does “carpe diem” mean?', a:'Seize the day', w:['Time flies','To the stars','Let it be'] },
  { id:'wor-012', cat:'words', diff:'hard',   q:'What is the word for a sound-alike word such as “buzz” or “splash”?', a:'Onomatopoeia', w:['Alliteration','Assonance','Hyperbole'] },
  { id:'wor-013', cat:'words', diff:'easy',   q:'What is a group of lions called?', a:'A pride', w:['A pack','A herd','A troop'] },
  { id:'wor-014', cat:'words', diff:'medium', q:'What is a female fox called?', a:'A vixen', w:['A doe','A jill','A sow'] },

  /* --- FOOD & DRINK ----------------------------------------------------- */
  { id:'foo-016', cat:'food', diff:'easy',   q:'Which country does sushi come from?', a:'Japan', w:['China','Korea','Thailand'] },
  { id:'foo-017', cat:'food', diff:'medium', q:'What is the main ingredient of hummus?', a:'Chickpeas', w:['Butter beans','Lentils','Split peas'] },
  { id:'foo-018', cat:'food', diff:'easy',   q:'What are dried grapes called?', a:'Raisins', w:['Prunes','Dates','Figs'] },
  { id:'foo-019', cat:'food', diff:'medium', q:'Which herb is the main flavour in pesto?', a:'Basil', w:['Coriander','Parsley','Oregano'] },
  { id:'foo-020', cat:'food', diff:'hard',   q:'Which pastry are profiteroles made from?', a:'Choux', w:['Filo','Puff','Shortcrust'] },
  { id:'foo-021', cat:'food', diff:'medium', q:'Which fruit carries its seeds on the outside?', a:'The strawberry', w:['The raspberry','The blackberry','The gooseberry'] },
  { id:'foo-022', cat:'food', diff:'hard',   q:'Which scale measures the heat of a chilli?', a:'The Scoville scale', w:['The Richter scale','The Mohs scale','The Beaufort scale'] },
  { id:'foo-023', cat:'food', diff:'medium', q:'What is Japanese horseradish called?', a:'Wasabi', w:['Miso','Mirin','Ponzu'] },

  /* --- WEIRD BUT TRUE ---------------------------------------------------- */
  { id:'wei-020', cat:'weird', diff:'hard',   q:'Which planet spins the opposite way to most of the others?', a:'Venus', w:['Mars','Mercury','Neptune'] },
  { id:'wei-021', cat:'weird', diff:'medium', q:'Which animal cannot stick its tongue out?', a:'The crocodile', w:['The tortoise','The frog','The snake'] },
  /* "A bloom" was one of the wrong options here until it was checked: bloom
     is a genuine collective noun for jellyfish, as is swarm, so the question
     had two right answers. Distractors are now collective nouns that belong
     firmly to something else. */
  { id:'wei-022', cat:'weird', diff:'hard',   q:'What is a group of jellyfish called?', a:'A smack', w:['A pod','A shoal','A flock'] },
  { id:'wei-023', cat:'weird', diff:'medium', q:'Which bird can fly backwards?', a:'The hummingbird', w:['The swift','The kingfisher','The wren'] },
  { id:'wei-024', cat:'weird', diff:'medium', q:'Which country has a dragon on its flag?', a:'Wales', w:['Scotland','Bhutan','Malta'] },
  { id:'wei-025', cat:'weird', diff:'hard',   q:'Which animal has fingerprints almost identical to a human’s?', a:'The koala', w:['The chimpanzee','The gorilla','The raccoon'] },
  { id:'wei-026', cat:'weird', diff:'medium', q:'What colour is a polar bear’s skin under its fur?', a:'Black', w:['White','Pink','Grey'] },
  { id:'wei-027', cat:'weird', diff:'hard',   q:'What is a group of ravens called?', a:'An unkindness', w:['A malice','A shadow','A gloom'] },

  /* --- SPORT ------------------------------------------------------------- */
  { id:'spo-001', cat:'sport', diff:'easy',   q:'How many players from one football team are on the pitch?', a:'11', w:['9','10','12'] },
  { id:'spo-002', cat:'sport', diff:'medium', q:'In which sport is the Ryder Cup contested?', a:'Golf', w:['Tennis','Sailing','Rowing'] },
  { id:'spo-003', cat:'sport', diff:'easy',   q:'How many holes are there in a full round of golf?', a:'18', w:['9','12','21'] },
  { id:'spo-004', cat:'sport', diff:'easy',   q:'In which sport would you hit a shuttlecock?', a:'Badminton', w:['Squash','Tennis','Table tennis'] },
  { id:'spo-005', cat:'sport', diff:'hard',   q:'How many points is a try worth in rugby union?', a:'Five', w:['Three','Four','Six'] },
  { id:'spo-006', cat:'sport', diff:'medium', q:'How many players are there in a netball team?', a:'Seven', w:['Five','Six','Nine'] },
  { id:'spo-007', cat:'sport', diff:'medium', q:'What colour jersey does the Tour de France leader wear?', a:'Yellow', w:['Green','Red','White'] },
  { id:'spo-008', cat:'sport', diff:'medium', q:'In darts, what is the highest score from three darts?', a:'180', w:['150','170','200'] },
  { id:'spo-009', cat:'sport', diff:'medium', q:'Which country did judo originate in?', a:'Japan', w:['China','Korea','Brazil'] },
  { id:'spo-010', cat:'sport', diff:'easy',   q:'How many rings are there on the Olympic flag?', a:'Five', w:['Four','Six','Seven'] },
  { id:'spo-011', cat:'sport', diff:'medium', q:'How many balls are bowled in a cricket over?', a:'Six', w:['Four','Five','Eight'] },
  { id:'spo-012', cat:'sport', diff:'easy',   q:'Which sport is played with a puck?', a:'Ice hockey', w:['Lacrosse','Hurling','Polo'] },
  { id:'spo-013', cat:'sport', diff:'medium', q:'How many players are there in a rugby league team?', a:'13', w:['11','15','17'] },
  { id:'spo-014', cat:'sport', diff:'medium', q:'Which famous horse race is run at Aintree?', a:'The Grand National', w:['The Derby','The Gold Cup','The St Leger'] },
  { id:'spo-015', cat:'sport', diff:'medium', q:'In snooker, which ball is worth seven points?', a:'The black', w:['The pink','The blue','The brown'] },
  { id:'spo-016', cat:'sport', diff:'hard',   q:'How many miles is a marathon, to the nearest tenth?', a:'26.2', w:['24.8','25.5','27.4'] }

];


/* ======================================================================
   CLOSEST-TO — number facts for the "closest wins" round.

   This is the round Paul actually wants, and it is far more forgiving than
   the multiple choice above: if a cheetah's real top speed is 70 or 72, the
   person who guessed 65 still wins. Small inaccuracies cost nothing here,
   where a wrong multiple-choice answer is simply wrong. So this bank can be
   written at volume with much less risk.

   Merges into the existing FACTS + GUESS_KINDS tables in index.html — same
   [name, value] pairs — but each category carries its own question wording
   and unit here, so one category is one self-contained block to read.

     q        how the question is worded, given the item name
     unit     shown after the number on the phone ('' for a year)
     vintage  0 = deep history, 1 = the last few years, 0.5 = belongs to
              everyone. Matches GUESS_VINTAGE in index.html.
     items    [name, number]

   WHAT MAKES A GOOD ONE (the bar for later batches):
   - Everybody must be able to form a rough instinct. "How many people live
     in Nanning" is not a guess, it's a shrug. "How tall is the Angel of the
     North" gets an answer out of everyone in the room.
   - The number should surprise. That "it's WHAT?" moment is the round.
   - One number, and one only. Anything where two sources reasonably differ
     by a factor is out.
   ====================================================================== */
window.CLOSEST = {

  /* --- WHAT YEAR DID IT HAPPEN -------------------------------------- */
  histyear: {
    q: n => 'What year did ' + n + ' happen?',
    unit: '', vintage: 0.5,
    items: [
      ['the Battle of Hastings', 1066],
      ['the signing of Magna Carta', 1215],
      ['the defeat of the Spanish Armada', 1588],
      ['the Gunpowder Plot', 1605],
      ['the execution of Charles I', 1649],
      ['the Great Plague of London', 1665],
      ['the Great Fire of London', 1666],
      ['the union of England and Scotland', 1707],
      ['the Battle of Trafalgar', 1805],
      ['the abolition of the slave trade in the British Empire', 1807],
      ['the Battle of Waterloo', 1815],
      ['the opening of the first London Underground line', 1863],
      ['the first modern Olympic Games', 1896],
      ['the death of Queen Victoria', 1901],
      ['the Wright brothers’ first flight', 1903],
      ['the sinking of the Titanic', 1912],
      ['the start of the First World War', 1914],
      ['the first British women winning the vote', 1918],
      ['the end of the Second World War', 1945],
      ['the founding of the NHS', 1948],
      ['the first climb of Everest', 1953],
      ['England winning the World Cup', 1966],
      ['the first Moon landing', 1969],
      ['decimalisation in Britain', 1971],
      ['the Chernobyl disaster', 1986],
      ['the fall of the Berlin Wall', 1989],
      ['the opening of the Channel Tunnel', 1994]
    ]
  },

  /* --- HOW LONG DID IT LAST ----------------------------------------- */
  /* Deliberately not more years-of-events: three of the six categories ask
     "what year", and a round of nothing but four-digit guesses goes flat.
     These are durations, which feel like a different question even when the
     subject is the same. */
  histlong: {
    q: n => 'How many years did ' + n + ' last?',
    unit: 'years', vintage: 0.5,
    items: [
      ['the First World War', 4],
      ['the American Civil War', 4],
      ['the Second World War', 6],
      ['the Napoleonic Wars', 12],
      ['the Vietnam War', 20],
      ['the Berlin Wall standing', 28],
      ['the Wars of the Roses', 32],
      ['the Cold War', 44],
      ['the reign of Queen Victoria', 63],
      ['the reign of Elizabeth II', 70],
      ['the Hundred Years’ War', 116],
      ['the Ming dynasty', 276],
      ['the Roman occupation of Britain', 366]
    ]
  },

  /* --- WHAT YEAR DID IT FIRST AIR ----------------------------------- */
  /* Spans 1958 to 2011 on purpose. Left at neutral vintage rather than
     leaning modern: the list itself does the age-spreading, and tagging the
     whole category "old" would point Bake Off at the wrong end of the sofa. */
  tvfirst: {
    q: n => 'What year did ' + n + ' first appear on TV?',
    unit: '', vintage: 0.5,
    items: [
      ['Blue Peter', 1958],
      ['Coronation Street', 1960],
      ['Doctor Who', 1963],
      ['Match of the Day', 1964],
      ['Sesame Street', 1969],
      ['Fawlty Towers', 1975],
      ['Top Gear', 1977],
      ['Grange Hill', 1978],
      ['Only Fools and Horses', 1981],
      ['Countdown', 1982],
      ['EastEnders', 1985],
      ['Neighbours', 1985],
      ['Casualty', 1986],
      ['Home and Away', 1988],
      ['The Simpsons', 1989],
      ['Have I Got News for You', 1990],
      ['Friends', 1994],
      ['Never Mind the Buzzcocks', 1996],
      ['Big Brother in the UK', 2000],
      ['Pop Idol', 2001],
      ['I’m a Celebrity', 2002],
      ['Strictly Come Dancing', 2004],
      ['The X Factor', 2004],
      ['Gavin & Stacey', 2007],
      ['The Great British Bake Off', 2010],
      ['Game of Thrones', 2011]
    ]
  },

  /* --- HOW FAST ----------------------------------------------------- */
  /* mph, not km/h — nobody in a British living room guesses in km/h. */
  animalspeed: {
    q: n => 'How fast can ' + n + ' go, in miles per hour?',
    unit: 'mph', vintage: 0.5,
    items: [
      ['a housefly', 5],
      ['a chicken', 9],
      ['a squirrel', 12],
      ['a hippo', 19],
      ['an elephant', 25],
      ['a great white shark', 25],
      ['the fastest human ever recorded', 27],
      ['a domestic cat', 30],
      ['a rabbit', 30],
      ['a grizzly bear', 35],
      ['a racehorse', 40],
      ['an ostrich', 43],
      ['a kangaroo', 44],
      ['a greyhound', 45],
      ['a cheetah', 70],
      ['a peregrine falcon in a dive', 200]
    ]
  },

  /* --- HOW LONG DOES IT LIVE ---------------------------------------- */
  animallife: {
    q: n => 'How many years does ' + n + ' usually live?',
    unit: 'years', vintage: 0.5,
    items: [
      ['a mouse', 2],
      ['a hamster', 2],
      ['a budgie', 8],
      ['a rabbit', 9],
      ['a goldfish', 10],
      ['a dog', 12],
      ['a lion', 14],
      ['a cat', 15],
      ['a tiger', 15],
      ['a cow', 20],
      ['a horse', 28],
      ['a chimpanzee', 40],
      ['an African grey parrot', 50],
      ['an African elephant', 65],
      ['a blue whale', 80],
      ['a giant tortoise', 100]
    ]
  },

  /* --- WHAT YEAR WAS IT INVENTED ------------------------------------ */
  inventions: {
    q: n => 'What year was ' + n + ' invented?',
    unit: '', vintage: 0.5,
    items: [
      ['the printing press', 1440],
      ['photography', 1826],
      ['the postage stamp', 1840],
      ['the telephone', 1876],
      ['the light bulb', 1879],
      ['the motor car', 1886],
      ['radio', 1895],
      ['the vacuum cleaner', 1901],
      ['the aeroplane', 1903],
      ['television', 1926],
      ['penicillin', 1928],
      ['the jet engine', 1930],
      ['the ballpoint pen', 1938],
      ['the hovercraft', 1959],
      ['the cash machine', 1967],
      ['the internet', 1969],
      ['the mobile phone', 1973],
      ['the World Wide Web', 1989]
    ]
  },

  /* --- HOW TALL ------------------------------------------------------ */
  /* Deliberately NOT skyscrapers — that category already exists in the game
     and this would just repeat it. These are the things people have stood
     next to.

     Heights are stored in METRES but asked in FEET, via conv below. The
     game's existing `buildings` category does exactly the same, and a round
     that asked one height in feet and the next in metres would be a mess.
     Storing the metric source keeps the numbers checkable. */
  landmarks: {
    q: n => 'How tall is ' + n + ', in feet?',
    unit: 'feet', vintage: 0.5,
    conv: v => Math.round(v * 3.28084),
    items: [
      ['the Angel of the North', 20],
      ['the Christ the Redeemer statue', 30],
      ['the Gateshead Millennium Bridge', 50],
      ['Niagara Falls', 51],
      ['Nelson’s Column', 52],
      ['the Leaning Tower of Pisa', 57],
      ['Tower Bridge', 65],
      ['the Statue of Liberty, including its base', 93],
      ['the Big Ben clock tower', 96],
      ['the London Eye', 135],
      ['the Great Pyramid of Giza', 139],
      ['Blackpool Tower', 158],
      ['the Spinnaker Tower', 170],
      ['the towers of the Golden Gate Bridge', 227],
      ['the Shard', 310],
      ['the Eiffel Tower', 330]
    ]
  },

  /* --- HOME PATCH: WHAT YEAR ----------------------------------------
     Local dates are the best closest-to material there is, because the room
     genuinely half-knows them. Everyone remembers the Angel going up and
     nobody remembers exactly when, which is precisely the guess this round
     wants. Items are worded to follow "What year did…", so they read as
     "What year did the Tyne Bridge open?".

     PAUL: check these harder than the rest. ------------------------- */
  localyear: {
    q: n => 'What year did ' + n + '?',
    unit: '', vintage: 0.5,
    items: [
      ['Newcastle’s Theatre Royal open on Grey Street', 1837],
      ['Grey’s Monument go up', 1838],
      ['the High Level Bridge open', 1849],
      ['Newcastle Central Station open', 1850],
      ['the Swing Bridge open', 1876],
      ['the Hoppings first come to the Town Moor', 1882],
      ['Newcastle United form', 1892],
      ['the Tyne Bridge open', 1928],
      ['the Jarrow March set off', 1936],
      ['Newcastle University split from Durham', 1963],
      ['the Tyne Tunnel open to cars', 1967],
      ['the Tyne and Wear Metro open', 1980],
      ['the Great North Run first take place', 1981],
      ['the Queen Elizabeth II Metro Bridge open', 1981],
      ['the current Redheugh Bridge open', 1983],
      ['the Metrocentre open', 1986],
      ['Durham Cathedral become a World Heritage Site', 1986],
      ['Byker Grove first air', 1989],
      ['Gateshead hold the National Garden Festival', 1990],
      ['the Stadium of Light open', 1997],
      ['the Angel of the North go up', 1998],
      ['the Gateshead Millennium Bridge open', 2001],
      ['BALTIC open as an art gallery', 2002],
      ['the Sage Gateshead, now the Glasshouse, open', 2004]
    ]
  }

};


/* ======================================================================
   ONE-OFF NUMBERS — the "it's WHAT?" facts.

   Different shape from CLOSEST above, and it has to be. Every category up
   there shares one question template and one unit; these don't. A giraffe's
   neck bones are a count, a whale's tongue is kilograms, the shortest war
   is minutes. Forcing them into a shared template would either mangle the
   wording or split them into a dozen categories of three.

   So each one carries its own question and unit:  { q, a, unit }

   These are the best questions in the whole bank for this round. The giraffe
   one in particular — seven neck bones, exactly the same as a human — is the
   kind of answer that gets an argument going, which is the point.
   ====================================================================== */
window.CLOSEST_ONEOFFS = [
  { q: 'How many bones are in a giraffe’s neck?', a: 7, unit: '' },
  { q: 'How many people have walked on the Moon?', a: 12, unit: '' },
  { q: 'How many bones are there in the human foot?', a: 26, unit: '' },
  { q: 'How many minutes did the shortest war in history last?', a: 38, unit: 'minutes' },
  { q: 'How many millimetres does a fingernail grow in a month?', a: 3, unit: 'mm' },
  { q: 'How many bones is a baby born with?', a: 300, unit: '' },
  { q: 'How many eggs does a hen lay in a year?', a: 300, unit: '' },
  { q: 'How many stations are there on the London Underground?', a: 272, unit: '' },
  { q: 'How many baked beans are in a standard tin?', a: 465, unit: 'beans' },
  { q: 'How many litres of spit does a person make in a year?', a: 500, unit: 'litres' },
  { q: 'How many islands make up the Maldives?', a: 1192, unit: '' },
  { q: 'How many hummingbird heartbeats are there in a minute?', a: 1200, unit: '' },
  { q: 'How many steps are there to the top of the Eiffel Tower?', a: 1665, unit: 'steps' },
  { q: 'How many kilograms does a blue whale’s tongue weigh?', a: 2700, unit: 'kg' },
  { q: 'How many taste buds does the average person have?', a: 10000, unit: '' },
  { q: 'How many times does the average person blink in a day?', a: 20000, unit: '' },
  { q: 'How many sheep are there in New Zealand, in millions?', a: 25, unit: 'million' },
  { q: 'How many hairs are on the average human head?', a: 100000, unit: '' },
  { q: 'How many muscles are there in an elephant’s trunk?', a: 40000, unit: '' },

  /* two on the doorstep — the wingspan one always surprises people, because
     the Angel is far wider than it is tall */
  { q: 'How many bridges cross the Tyne between Newcastle and Gateshead?', a: 7, unit: '' },
  { q: 'How wide is the Angel of the North from wingtip to wingtip, in feet?', a: 177, unit: 'feet' },
  { q: 'How many steps are inside Grey’s Monument?', a: 164, unit: 'steps' },
  { q: 'Roughly how many miles is the Great North Run?', a: 13, unit: 'miles' }
];


/* ======================================================================
   LOGOS — for the logo round.

   The same trap the album covers round has: most logos have the brand
   name written into them, so a Coca-Cola or FedEx logo hands over the
   answer before anyone has thought. Album art is fixed by redacting the
   text on a canvas, but a wordmark IS the logo — blank it and there is
   nothing left. So the list below is curated to SYMBOL marks only: the
   swoosh, the arches, the crocodile, the prancing horse.

   Four ways of sourcing these automatically were tested and rejected:
     - Clearbit's logo API is dead, every request 404s
     - Wikipedia's lead article image is often a PHOTOGRAPH. Nike returns
       a picture of its campus, Shell an office block, Starbucks a
       building
     - filtering Wikipedia's file list for names containing "logo" hit
       11 brands out of 30, and half of those were wordmarks anyway
     - favicons load for every brand but the sizes are all over the place:
       McDonald's comes back 48px and BMW 16px, which is useless blown up
       on a phone

   So the brands are hand-picked and the icon is fetched at a requested
   256px, with buildLogos() MEASURING each one and dropping anything too
   small to look right. A blurry logo never reaches a phone.

     name    what the phones show as the answer
     domain  where the icon comes from

   PAUL: these were picked without being able to see them. If any turns
   out to be the brand's NAME written out rather than its symbol, it is a
   free point — tell me and it comes out.
   ====================================================================== */
window.LOGOS = [
  { name: 'Nike',            domain: 'nike.com' },
  { name: 'Apple',           domain: 'apple.com' },
  { name: 'Shell',           domain: 'shell.com' },
  { name: 'Audi',            domain: 'audi.com' },
  { name: 'Starbucks',       domain: 'starbucks.com' },
  { name: 'Ferrari',         domain: 'ferrari.com' },
  { name: 'Lamborghini',     domain: 'lamborghini.com' },
  { name: 'Puma',            domain: 'puma.com' },
  { name: 'Lacoste',         domain: 'lacoste.com' },
  { name: 'Chanel',          domain: 'chanel.com' },
  { name: 'Gucci',           domain: 'gucci.com' },
  { name: 'Ralph Lauren',    domain: 'ralphlauren.com' },
  { name: 'Volkswagen',      domain: 'volkswagen.com' },
  { name: 'Honda',           domain: 'honda.com' },
  { name: 'PlayStation',     domain: 'playstation.com' },
  { name: 'Xbox',            domain: 'xbox.com' },
  { name: 'Firefox',         domain: 'firefox.com' },
  { name: 'Google Chrome',   domain: 'chrome.com' },
  { name: 'YouTube',         domain: 'youtube.com' },
  { name: 'Instagram',       domain: 'instagram.com' },
  { name: 'Snapchat',        domain: 'snapchat.com' },
  { name: 'Pinterest',       domain: 'pinterest.com' },
  { name: 'Reddit',          domain: 'reddit.com' },
  { name: 'Airbnb',          domain: 'airbnb.com' },
  { name: 'Mastercard',      domain: 'mastercard.com' },
  { name: 'PayPal',          domain: 'paypal.com' },
  { name: 'Target',          domain: 'target.com' },
  { name: 'Penguin Books',   domain: 'penguin.co.uk' },
  { name: 'Vimeo',           domain: 'vimeo.com' },
  { name: 'Deliveroo',       domain: 'deliveroo.co.uk' },
  { name: 'Just Eat',        domain: 'just-eat.co.uk' },
  { name: 'Monzo',           domain: 'monzo.com' },
  { name: 'Nationwide',      domain: 'nationwide.co.uk' },
  { name: 'John Lewis',      domain: 'johnlewis.com' },
  { name: 'Waitrose',        domain: 'waitrose.com' },
  { name: 'Greggs',          domain: 'greggs.co.uk' },
  { name: 'Boots',           domain: 'boots.com' },
  { name: 'Aldi',            domain: 'aldi.co.uk' }
];
