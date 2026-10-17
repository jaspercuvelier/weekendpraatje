// Inhoud van "Mijn weekend". Alles wat hier staat, verschijnt in de app.
// Dit bestand is gewone JSON na "window.INHOUD =" zodat ook de Python-scripts het kunnen lezen.
//
// Opbouw: kleur (categorieen) -> groep (groepen) -> activiteit (activiteiten) -> met wie -> waar -> wanneer -> hoe
//   woord   = wat op het kaartje staat
//   spreek  = de volzin die wordt voorgelezen bij een tik (audio/<stem>/<id>.mp3, kleuren: cat-<id>.mp3)
//   hww + rest = stukjes van de controlezin: "Jij <hww> <wanneer> <met wie> <waar> <rest>, en dat vond je ...?"
//   zin     = volledige controlezin (groepen/activiteiten zonder lagen) of stukje (met wie/waar/wanneer/hoe)
//   waar=false   = de vraag WAAR? wordt overgeslagen (de plaats zit al in de activiteit, bv. naar de zoo)
//   lagen=false  = geen vragen met wie/waar/wanneer/hoe
//   typ=true     = na de tik verschijnt een typvak; ietsAnders=true = de groep krijgt een kaartje "iets anders"
//   beeld   = naam van een bestaande prent in beelden/ (anders: beelden/<id>.jpg)
//   scene   = beschrijving (Engels) voor genereer_afbeeldingen.py; titel = titel op de prent (standaard het woord)
//   emoji   = confetti bij een tik (leeg = geen confetti)
window.INHOUD = {
  "titel": "Mijn weekend …",
  "start": [
    {"id": "start-zelf", "woord": "zelf vertellen", "modus": "zelf", "emoji": "💬", "scene": "a child and a teacher sitting together at a table, looking at picture cards and talking", "mensen": true, "titel": "ZELF VERTELLEN"},
    {"id": "start-voorlezen", "woord": "voorlezen", "modus": "voorlezen", "emoji": "🔊", "scene": "a tablet standing on a table with sound waves coming out of its speaker", "titel": "VOORLEZEN"}
  ],
  "stemmen": [
    {"id": "stem-vrouw", "woord": "vrouwenstem", "stem": "vrouw", "spreek": "Hallo!", "emoji": "👩 🔊", "scene": "a smiling woman talking, with small sound waves near her mouth", "mensen": true, "titel": "VROUWENSTEM"},
    {"id": "stem-man", "woord": "mannenstem", "stem": "man", "spreek": "Hallo!", "emoji": "👨 🔊", "scene": "a smiling man talking, with small sound waves near his mouth", "mensen": true, "titel": "MANNENSTEM"}
  ],
  "categorieen": [
    {
      "id": "actief",
      "kleur": "#ff8a45",
      "woord": "actief",
      "spreek": "Mijn weekend was actief.",
      "emoji": "🏃 ⚽ 🚲",
      "scene": "a sports field next to a playground and a path towards a forest: a football goal, a bicycle leaning against a fence, a ball on the grass and a signpost",
      "groepen": [
        {
          "id": "sporten",
          "woord": "sporten",
          "spreek": "Ik heb gesport.",
          "emoji": "🤸 ⚽",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "basketbal", "woord": "basket", "spreek": "Ik heb gebasket.", "hww": "hebt", "rest": "gebasket", "emoji": "🏀"},
            {"id": "muurklimmen", "woord": "muurklimmen", "spreek": "Ik ben gaan muurklimmen.", "hww": "bent", "rest": "gaan muurklimmen", "emoji": "🧗"},
            {"id": "zwemmen", "woord": "zwemmen", "spreek": "Ik ben gaan zwemmen.", "hww": "bent", "rest": "gaan zwemmen", "emoji": "🏊 💦"},
            {"id": "fietsen", "woord": "fietsen", "spreek": "Ik heb gefietst.", "hww": "hebt", "rest": "gefietst", "emoji": "🚲"},
            {"id": "voetballen", "woord": "voetballen", "spreek": "Ik heb gevoetbald.", "hww": "hebt", "rest": "gevoetbald", "emoji": "⚽"},
            {"id": "dansen", "woord": "dansen", "spreek": "Ik heb gedanst.", "hww": "hebt", "rest": "gedanst", "emoji": "💃 🎶"},
            {"id": "hockey", "woord": "hockey", "spreek": "Ik heb hockey gespeeld.", "hww": "hebt", "rest": "hockey gespeeld", "emoji": "🏑", "scene": "a hockey field with a goal, two hockey sticks lying on the grass and a small ball"},
            {"id": "judo", "woord": "judo", "spreek": "Ik heb aan judo gedaan.", "hww": "hebt", "rest": "aan judo gedaan", "emoji": "🥋", "scene": "a judo hall with soft mats on the floor and a white judo suit with a belt folded on a bench"},
            {"id": "vissen", "woord": "vissen", "spreek": "Ik ben gaan vissen.", "hww": "bent", "rest": "gaan vissen", "emoji": "🎣 🐟", "scene": "a quiet pond with reeds, a fishing rod on a stand, a bucket and a small folding chair"}
          ]
        },
        {
          "id": "spelen-actief",
          "woord": "spelen",
          "spreek": "Ik heb gespeeld.",
          "emoji": "🤸 ⚽",
          "beeld": "g-spelen-actief",
          "scene": "a garden with a trampoline, a small slide and a ball on the grass",
          "ietsAnders": true,
          "titel": "SPELEN",
          "activiteiten": [
            {"id": "trampoline", "woord": "trampoline", "spreek": "Ik heb op de trampoline gesprongen.", "hww": "hebt", "rest": "op de trampoline gesprongen", "emoji": "🤸 ⭐"},
            {"id": "speeltuin", "woord": "speeltuin", "spreek": "Ik heb in de speeltuin gespeeld.", "hww": "hebt", "rest": "in de speeltuin gespeeld", "emoji": "🎠 🌳", "waar": false},
            {"id": "jeugdbeweging", "woord": "jeugdbeweging", "spreek": "Ik ben naar de jeugdbeweging geweest.", "hww": "bent", "rest": "naar de jeugdbeweging geweest", "emoji": "⛺ 🌲", "waar": false, "scene": "a youth movement camp in the woods: a tent, a flag on a wooden pole, a circle of logs around a campfire place"},
            {"id": "in-de-tuin", "woord": "in de tuin", "spreek": "Ik heb in de tuin gespeeld.", "hww": "hebt", "rest": "in de tuin gespeeld", "emoji": "🌼 ⚽", "waar": false, "scene": "a garden with grass, flowers, a ball, a small football goal and a garden bench"}
          ]
        },
        {
          "id": "uitstap",
          "woord": "uitstap",
          "spreek": "Ik heb een uitstap gemaakt.",
          "emoji": "🎒 🚌",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "pretpark", "woord": "pretpark", "spreek": "Ik ben naar het pretpark geweest.", "hww": "bent", "rest": "naar het pretpark geweest", "emoji": "🎢 🎡", "waar": false},
            {"id": "naar-de-speeltuin", "woord": "speeltuin", "spreek": "Ik ben naar de speeltuin geweest.", "hww": "bent", "rest": "naar de speeltuin geweest", "emoji": "🎠 🌳", "waar": false},
            {"id": "winkelen", "woord": "winkelen", "spreek": "Ik ben gaan winkelen.", "hww": "bent", "rest": "gaan winkelen", "emoji": "🛍️", "waar": false},
            {"id": "markt", "woord": "naar de markt", "spreek": "Ik ben naar de markt geweest.", "hww": "bent", "rest": "naar de markt geweest", "emoji": "🍎 🥕 🧀", "waar": false},
            {"id": "dierentuin", "woord": "naar de zoo", "spreek": "Ik ben naar de zoo geweest.", "hww": "bent", "rest": "naar de zoo geweest", "emoji": "🦁 🐘 🦒", "waar": false},
            {"id": "bos", "woord": "naar het bos", "spreek": "Ik ben naar het bos geweest.", "hww": "bent", "rest": "naar het bos geweest", "emoji": "🌲 🍄 🍂", "waar": false},
            {"id": "stad", "woord": "naar de stad", "spreek": "Ik ben naar de stad geweest.", "hww": "bent", "rest": "naar de stad geweest", "emoji": "🏙️ 🚌", "waar": false},
            {"id": "bibliotheek", "woord": "naar de bibliotheek", "spreek": "Ik ben naar de bibliotheek geweest.", "hww": "bent", "rest": "naar de bibliotheek geweest", "emoji": "📚", "waar": false, "scene": "a library with tall bookshelves, a reading table with a few books and a comfortable chair"},
            {"id": "cinema", "woord": "naar de cinema", "spreek": "Ik ben naar de cinema geweest.", "hww": "bent", "rest": "naar de cinema geweest", "emoji": "🎬 🍿", "waar": false, "scene": "a cinema hall with rows of seats, a big screen and a bucket of popcorn on a seat"},
            {"id": "optreden", "woord": "optreden of toneel", "spreek": "Ik ben naar een optreden of toneel geweest.", "hww": "bent", "rest": "naar een optreden of toneel geweest", "emoji": "🎭 🎤", "waar": false, "scene": "a theatre stage with open curtains, a microphone on a stand, spotlights and rows of chairs", "titel": "OPTREDEN / TONEEL"},
            {"id": "rijden", "woord": "ergens naartoe rijden", "spreek": "Ik ben ergens naartoe gereden.", "hww": "bent", "rest": "ergens naartoe gereden", "emoji": "🚗 🛣️", "waar": false}
          ]
        }
      ]
    },
    {
      "id": "gezellig",
      "kleur": "#f7d54e",
      "woord": "gezellig bezig",
      "spreek": "Ik was gezellig bezig.",
      "emoji": "🥰 🎈 🎨",
      "scene": "a cosy table with a board game, crayons and paper, a cake and cups, and a few balloons in the corner",
      "groepen": [
        {
          "id": "creatief",
          "woord": "creatief",
          "spreek": "Ik was creatief bezig.",
          "emoji": "🎨 ✂️",
          "beeld": "g-creatief",
          "scene": "a craft table with paint pots, brushes, crayons, scissors and a half-finished drawing",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "knutselen", "woord": "knutselen", "spreek": "Ik heb geknutseld.", "hww": "hebt", "rest": "geknutseld", "emoji": "✂️ 🎨"},
            {"id": "tekenen", "woord": "tekenen", "spreek": "Ik heb getekend.", "hww": "hebt", "rest": "getekend", "emoji": "✏️ 🖍️"},
            {"id": "schilderen", "woord": "schilderen", "spreek": "Ik heb geschilderd.", "hww": "hebt", "rest": "geschilderd", "emoji": "🖌️ 🎨", "scene": "an easel with a half-finished painting of a tree, a palette with paint and brushes in a cup"},
            {"id": "puzzelen", "woord": "puzzelen", "spreek": "Ik heb gepuzzeld.", "hww": "hebt", "rest": "gepuzzeld", "emoji": "🧩"}
          ]
        },
        {
          "id": "spelen-samen",
          "woord": "spelen",
          "spreek": "Ik heb een spelletje gespeeld.",
          "emoji": "🎲 🧸",
          "beeld": "g-spelen-samen",
          "scene": "a table with a board game, two dice and some cards, and a box of building blocks on the floor",
          "ietsAnders": true,
          "titel": "SPELEN",
          "activiteiten": [
            {"id": "gezelschapsspel", "woord": "gezelschapsspel", "spreek": "Ik heb een gezelschapsspel gespeeld.", "hww": "hebt", "rest": "een gezelschapsspel gespeeld", "emoji": "🎲"},
            {"id": "samen-spelen", "woord": "samen spelen", "spreek": "Ik heb samen gespeeld.", "hww": "hebt", "rest": "samen gespeeld", "emoji": "🧸 🧱"}
          ]
        },
        {
          "id": "g-feestje",
          "woord": "feestje",
          "spreek": "Ik was op een feestje.",
          "emoji": "🎉 🎈",
          "beeld": "feestje",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "feestje", "woord": "feestje", "spreek": "Ik ben naar een feestje geweest.", "hww": "bent", "rest": "naar een feestje geweest", "emoji": "🎉 🎈"},
            {"id": "verjaardag", "woord": "verjaardag", "spreek": "Ik heb een verjaardag gevierd.", "hww": "hebt", "rest": "een verjaardag gevierd", "emoji": "🎂 🎁 🎈"}
          ]
        },
        {
          "id": "apero-eten",
          "woord": "apero en eten",
          "spreek": "Ik heb lekker gegeten en gedronken.",
          "emoji": "🍽️ 🥤",
          "beeld": "g-apero-eten",
          "scene": "a table with plates of food, small snacks in bowls and glasses of juice",
          "ietsAnders": true,
          "titel": "APERO EN ETEN",
          "activiteiten": [
            {"id": "koken", "woord": "koken", "spreek": "Ik heb gekookt.", "hww": "hebt", "rest": "gekookt", "emoji": "🍳 🥕", "beeld": "bakken-koken"},
            {"id": "aperitieven", "woord": "aperitieven", "spreek": "Ik heb een aperitiefje gedronken.", "hww": "hebt", "rest": "een aperitiefje gedronken", "emoji": "🥤 🥨", "scene": "a small low table with glasses of juice, a bowl of crisps and a plate of small snacks"},
            {"id": "gaan-eten", "woord": "gaan eten", "spreek": "Ik ben gaan eten.", "hww": "bent", "rest": "gaan eten", "emoji": "🍽️ 🍟", "scene": "a restaurant table set with plates, cutlery and glasses, and a menu card"},
            {"id": "thuis-eten", "woord": "thuis eten", "spreek": "Ik heb thuis gegeten.", "hww": "hebt", "rest": "thuis gegeten", "emoji": "🍝 🏠", "waar": false, "scene": "a kitchen table at home set for the family with plates, a pan of pasta and a bread basket"}
          ]
        },
        {
          "id": "bezoek",
          "woord": "bezoek",
          "spreek": "Ik had bezoek, of ik ging op bezoek.",
          "emoji": "🚪 👋",
          "beeld": "g-bezoek",
          "scene": "the open front door of a cosy house with a doormat, a coat rack with coats and a table with cups",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "bezoek-krijgen", "woord": "bezoek krijgen", "spreek": "Ik heb bezoek gekregen.", "hww": "hebt", "rest": "bezoek gekregen", "emoji": "🚪 👋", "waar": false},
            {"id": "familie-bezoeken", "woord": "familie bezoeken", "spreek": "Ik ben op bezoek geweest bij familie.", "hww": "bent", "rest": "op bezoek geweest bij familie", "emoji": "👵 👴 🏠", "waar": false},
            {"id": "vrienden-bezoeken", "woord": "vrienden bezoeken", "spreek": "Ik ben op bezoek geweest bij vrienden.", "hww": "bent", "rest": "op bezoek geweest bij vrienden", "emoji": "🧒 🤝", "waar": false, "scene": "the front door of a house with two children's bicycles parked outside and a doormat"}
          ]
        }
      ]
    },
    {
      "id": "chill",
      "kleur": "#8fb6d3",
      "woord": "chill",
      "spreek": "Mijn weekend was rustig en ontspannen.",
      "emoji": "🛋️ 📺 😎",
      "scene": "a cosy living room with a big soft sofa with cushions and a blanket, a television, a tablet and headphones",
      "groepen": [
        {
          "id": "schermtijd",
          "woord": "schermtijd",
          "spreek": "Ik heb naar een scherm gekeken.",
          "emoji": "📺 🎮",
          "beeld": "g-schermtijd",
          "scene": "a low table with a tablet and a game controller in front of a television",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "tv-film", "woord": "tv of film", "spreek": "Ik heb tv of een film gekeken.", "hww": "hebt", "rest": "tv of een film gekeken", "emoji": "📺 🍿"},
            {"id": "tablet", "woord": "tablet", "spreek": "Ik heb op de tablet gespeeld.", "hww": "hebt", "rest": "op de tablet gespeeld", "emoji": "📱"},
            {"id": "gamen", "woord": "gamen", "spreek": "Ik heb computerspelletjes gespeeld.", "hww": "hebt", "rest": "computerspelletjes gespeeld", "emoji": "🎮"}
          ]
        },
        {
          "id": "rusten",
          "woord": "rusten",
          "spreek": "Ik heb gerust.",
          "emoji": "😌 ☁️",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "muziek", "woord": "muziek beluisteren", "spreek": "Ik heb naar muziek geluisterd.", "hww": "hebt", "rest": "naar muziek geluisterd", "emoji": "🎵 🎧"},
            {"id": "boek", "woord": "een boek bekijken", "spreek": "Ik heb een boek bekeken.", "hww": "hebt", "rest": "een boek bekeken", "emoji": "📖"},
            {"id": "zetel", "woord": "in de zetel zitten", "spreek": "Ik heb in de zetel gezeten.", "hww": "hebt", "rest": "in de zetel gezeten", "emoji": "🛋️"},
            {"id": "uitslapen", "woord": "uitslapen", "spreek": "Ik heb uitgeslapen.", "hww": "hebt", "rest": "uitgeslapen", "emoji": "😴 🛏️"}
          ]
        },
        {
          "id": "verzorging",
          "woord": "verzorging",
          "spreek": "Ik heb mij verzorgd of thuis geholpen.",
          "emoji": "🛁 🧼",
          "beeld": "g-verzorging",
          "scene": "a bathroom with a sink, a toothbrush in a cup, a towel and a hairbrush",
          "ietsAnders": true,
          "activiteiten": [
            {"id": "douchen-bad", "woord": "douchen of bad", "spreek": "Ik heb gedoucht of in bad gezeten.", "hww": "hebt", "rest": "gedoucht of in bad gezeten", "emoji": "🛁 🧼"},
            {"id": "kapper", "woord": "naar de kapper", "spreek": "Ik ben naar de kapper geweest.", "hww": "bent", "rest": "naar de kapper geweest", "emoji": "💇 ✂️", "waar": false},
            {"id": "helpen-thuis", "woord": "helpen thuis", "spreek": "Ik heb thuis geholpen.", "hww": "hebt", "rest": "thuis geholpen", "emoji": "🍽️ 🤝", "waar": false}
          ]
        }
      ]
    },
    {
      "id": "anders",
      "kleur": "#ffffff",
      "woord": "nog iets anders",
      "spreek": "Ik deed nog iets anders.",
      "emoji": "🤔 ❓",
      "vraag": "vraag-groep-anders",
      "scene": "a friendly signpost in a park with arrows pointing in different directions; one sign shows a big question mark",
      "groepen": [
        {"id": "weet-niet-meer", "woord": "ik weet het niet meer", "spreek": "Ik weet het niet meer.", "emoji": "🤔", "beeld": "g-weet-niet-meer", "scene": "an empty notebook lying open on a table, with a big question mark drawn on the empty page", "zin": "Jij weet het niet meer?", "lagen": false},
        {"id": "echt-iets-anders", "woord": "echt nog iets anders", "spreek": "Ik deed echt nog iets anders.", "emoji": "💬", "beeld": "anders", "typ": true},
        {
          "id": "wil-niet-vertellen",
          "woord": "ik wil het niet vertellen",
          "spreek": "Ik wil het niet vertellen.",
          "emoji": "",
          "beeld": "g-wil-niet-vertellen",
          "scene": "a quiet, calm room with a closed door and a soft cushion on a chair",
          "lagen": false,
          "einde": "einde-rustig",
          "activiteiten": [
            {"id": "niet-goed", "woord": "ik voel me niet goed", "spreek": "Ik voel me niet goed.", "emoji": "", "zin": "Jij voelt je niet goed?"},
            {"id": "geen-zin", "woord": "ik heb geen zin om te praten", "spreek": "Ik heb geen zin om te praten.", "emoji": "", "zin": "Jij hebt geen zin om te praten?"},
            {"id": "hoeft-niet", "woord": "je hoeft het niet te weten", "spreek": "Je hoeft het niet te weten.", "emoji": "", "zin": "Jij wil het liever niet vertellen?"}
          ]
        }
      ]
    }
  ],
  "ietsAnders": {"id": "iets-anders", "woord": "iets anders", "spreek": "Ik deed iets anders.", "hww": "hebt", "rest": "iets anders gedaan", "emoji": "💬", "beeld": "anders", "typ": true},
  "lagen": [
    {
      "id": "wie",
      "vraag": "Met wie?",
      "opties": [
        {"id": "wie-alleen", "woord": "alleen", "spreek": "Ik was alleen.", "zin": "alleen", "emoji": "🙂"},
        {"id": "wie-mama", "woord": "mama", "spreek": "Ik was met mama.", "zin": "met mama", "emoji": "👩"},
        {"id": "wie-papa", "woord": "papa", "spreek": "Ik was met papa.", "zin": "met papa", "emoji": "👨"},
        {"id": "wie-broer-zus", "woord": "broer of zus", "spreek": "Ik was met mijn broer of zus.", "zin": "met je broer of zus", "emoji": "👦 👧"},
        {"id": "wie-familie", "woord": "familie", "spreek": "Ik was met familie.", "zin": "met familie", "emoji": "👨‍👩‍👧‍👦"},
        {"id": "wie-vriend", "woord": "vriend(in)", "spreek": "Ik was met een vriend of vriendin.", "zin": "met een vriend of vriendin", "emoji": "🤝 🧒"},
        {"id": "wie-groep", "woord": "groep", "spreek": "Ik was met een groep.", "zin": "met een groep", "emoji": "👥"}
      ]
    },
    {
      "id": "waar",
      "vraag": "Waar?",
      "opties": [
        {"id": "waar-thuis", "woord": "thuis", "spreek": "Ik was thuis.", "zin": "thuis", "emoji": "🏠"},
        {"id": "waar-buiten", "woord": "buiten", "spreek": "Ik was buiten.", "zin": "buiten", "emoji": "🌳 ☀️"},
        {"id": "waar-familie", "woord": "bij familie", "spreek": "Ik was bij familie.", "zin": "bij familie", "emoji": "🏡 ❤️"},
        {"id": "waar-winkel", "woord": "winkel", "spreek": "Ik was in de winkel.", "zin": "in de winkel", "emoji": "🛒"},
        {"id": "waar-restaurant", "woord": "restaurant", "spreek": "Ik was op restaurant.", "zin": "op restaurant", "emoji": "🍽️"},
        {"id": "waar-frituur", "woord": "frituur", "spreek": "Ik was in de frituur.", "zin": "in de frituur", "emoji": "🍟", "scene": "a Belgian chip shop: a counter with a fryer behind it, a paper cone of fries on the counter and a few bar stools"},
        {"id": "waar-sportclub", "woord": "sportclub", "spreek": "Ik was in de sportclub.", "zin": "in de sportclub", "emoji": "🏟️ ⚽"},
        {"id": "waar-cafe", "woord": "café", "spreek": "Ik was op café.", "zin": "op café", "emoji": "☕", "scene": "a café terrace with small round tables, chairs and a sun umbrella", "titel": "CAFÉ"},
        {"id": "waar-anders", "woord": "ergens anders", "spreek": "Ik was ergens anders.", "zin": "ergens anders", "emoji": "📍", "anders": true}
      ]
    },
    {
      "id": "wanneer",
      "vraag": "Wanneer?",
      "opties": [
        {"id": "wann-vrijdagavond", "woord": "vrijdagavond", "spreek": "Het was vrijdagavond.", "zin": "vrijdagavond", "emoji": "🌙 ⭐"},
        {"id": "wann-zaterdag", "woord": "zaterdag", "spreek": "Het was zaterdag.", "zin": "zaterdag", "emoji": "☀️"},
        {"id": "wann-zondag", "woord": "zondag", "spreek": "Het was zondag.", "zin": "zondag", "emoji": "☀️"},
        {"id": "wann-weekend", "woord": "het hele weekend", "spreek": "Het was het hele weekend.", "zin": "het hele weekend", "emoji": "🌙 ☀️ ☀️", "scene": "a big wall calendar with three days circled: friday with a small moon, saturday and sunday with a small sun", "titel": "HET HELE WEEKEND"},
        {"id": "wann-weet", "woord": "ik weet het niet", "spreek": "Ik weet niet meer wanneer.", "zin": "", "emoji": "❓"}
      ]
    },
    {
      "id": "hoe",
      "vraag": "Hoe vond je het?",
      "opties": [
        {"id": "hoe-super", "woord": "super", "spreek": "Ik vond het super!", "zin": "en dat vond je super leuk?", "emoji": "👍 🌟 🎉"},
        {"id": "hoe-leuk", "woord": "leuk", "spreek": "Ik vond het leuk.", "zin": "en dat vond je leuk?", "emoji": "👍 🙂"},
        {"id": "hoe-gewoon", "woord": "gewoon", "spreek": "Ik vond het gewoon.", "zin": "en dat vond je gewoon oké?", "emoji": "🙂"},
        {"id": "hoe-niet", "woord": "niet leuk", "spreek": "Ik vond het niet leuk.", "zin": "en dat vond je niet leuk?", "emoji": ""}
      ]
    }
  ],
  "waarweet": [
    {"id": "waarweet-ja", "woord": "ja", "spreek": "Ja, ik weet waar het was.", "zin": "", "emoji": "✅"},
    {"id": "waarweet-nee", "woord": "nee", "spreek": "Nee, dat weet ik niet.", "zin": "", "emoji": ""}
  ],
  "blok": [
    {"id": "blok-ja", "woord": "ja", "spreek": "Ja, dat klopt."},
    {"id": "blok-nee", "woord": "nee", "spreek": "Nee, dat klopt niet."},
    {"id": "blok-weet", "woord": "weet ik niet", "spreek": "Dat weet ik niet."},
    {"id": "blok-nogeens", "woord": "nog eens", "spreek": "Wil je het nog eens zeggen?"}
  ],
  "zinnen": {"vraag-cat": "Hoe was jouw weekend? Kies een kleur.", "vraag-groep": "Wat deed je?", "vraag-groep-anders": "Wat bedoel je?", "vraag-act": "Wat deed je precies?", "vraag-act-wil-niet-vertellen": "Wat wil je zeggen?", "vraag-typ": "Typ wat je deed.", "vraag-wie": "Met wie was je?", "vraag-waar": "Waar was je?", "vraag-waarweet": "Weet je waar het was?", "vraag-waartyp": "Typ waar het was.", "vraag-wanneer": "Wanneer was het?", "vraag-hoe": "Hoe vond je het?", "typ-act": "Ik deed iets anders:", "typ-waar": "Ik was", "corrigeer": "Wat klopt er niet? Tik op het prentje.", "einde": "Fijn! Dankjewel om dit te vertellen.", "einde-rustig": "Dat is oké. Dankjewel dat je het zei.", "c-hebt": "Jij hebt", "c-bent": "Jij bent", "c-iets-anders": "iets anders gedaan:"},
  "confetti-einde": "🎉 ⭐ 🌈 🥳"
};
