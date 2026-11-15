// NIEUWE indeling van "Mijn weekend" (feedback van de collega's, 2026). Aan/uit via het tandwiel rechtsboven.
// Staat de schakelaar uit, dan gebruikt de app enkel inhoud.js (de huidige versie).
// Staat ze aan, dan vervangt dit bestand "categorieen" en "lagen" van inhoud.js en komen deze "zinnen" erbij;
// al de rest (start, stemmen, ietsAnders, blok, waarweet, ...) komt uit inhoud.js.
//
// Opbouw: waar was je? (thuis / leefgroep / niet thuis / niks vertellen) -> zoveel lagen "kinderen" als nodig
//         -> met wie -> waar -> wanneer -> hoe.
//   Een kaartje met "kinderen" opent een nieuwe keuze; een kaartje zonder is de activiteit (het blad).
//   vraag      = id uit "zinnen" voor de vraag bij de kinderen (anders "Wat deed je?" / "Wat deed je precies?")
//   waar=false = de vraag WAAR? overslaan (kan ook op een kleur of groep, dan geldt het voor alles eronder)
//   Verder dezelfde velden als in inhoud.js (woord, spreek, hww, rest, zin, lagen, typ, ietsAnders, einde, beeld, emoji).
//   Zelfde id = zelfde voorleesbestand en zelfde picto: een id met een andere zin moet een nieuwe id krijgen.
window.INHOUD_NIEUW = {
  "vraagCat": "vraag-waar-weekend",
  "categorieen": [
    {
      "id": "thuis",
      "kleur": "#ff8a45",
      "woord": "thuis",
      "spreek": "Ik was thuis.",
      "emoji": "🏠 ❤️",
      "vraag": "vraag-binnen-buiten",
      "kinderen": [
        {
          "id": "buiten",
          "woord": "buiten",
          "spreek": "Ik was buiten.",
          "emoji": "🌳 ☀️",
          "ietsAnders": true,
          "kinderen": [
            {"id": "in-de-tuin", "woord": "in de tuin spelen", "spreek": "Ik heb in de tuin gespeeld.", "hww": "hebt", "rest": "in de tuin gespeeld", "emoji": "🌼 ⚽", "waar": false},
            {"id": "trampoline", "woord": "op de trampoline spelen", "spreek": "Ik heb op de trampoline gesprongen.", "hww": "hebt", "rest": "op de trampoline gesprongen", "emoji": "🤸 ⭐"},
            {"id": "bal", "woord": "met de bal spelen", "spreek": "Ik heb met de bal gespeeld.", "hww": "hebt", "rest": "met de bal gespeeld", "emoji": "⚽ 🏀"}
          ]
        },
        {
          "id": "binnen",
          "woord": "binnen",
          "spreek": "Ik was binnen.",
          "emoji": "🏠",
          "ietsAnders": true,
          "kinderen": [
            {
              "id": "creatief",
              "woord": "creatief bezig",
              "spreek": "Ik was creatief bezig.",
              "emoji": "🎨 ✂️",
              "beeld": "g-creatief",
              "ietsAnders": true,
              "kinderen": [
                {"id": "knutselen", "woord": "knutselen", "spreek": "Ik heb geknutseld.", "hww": "hebt", "rest": "geknutseld", "emoji": "✂️ 🎨"},
                {"id": "tekenen", "woord": "tekenen", "spreek": "Ik heb getekend.", "hww": "hebt", "rest": "getekend", "emoji": "✏️ 🖍️"},
                {"id": "schilderen", "woord": "schilderen", "spreek": "Ik heb geschilderd.", "hww": "hebt", "rest": "geschilderd", "emoji": "🖌️ 🎨"},
                {"id": "puzzelen", "woord": "puzzelen", "spreek": "Ik heb gepuzzeld.", "hww": "hebt", "rest": "gepuzzeld", "emoji": "🧩"}
              ]
            },
            {
              "id": "spelen-samen",
              "woord": "spelen",
              "spreek": "Ik heb een spelletje gespeeld.",
              "emoji": "🎲 🧸",
              "beeld": "g-spelen-samen",
              "ietsAnders": true,
              "kinderen": [
                {"id": "gezelschapsspel", "woord": "gezelschapsspel", "spreek": "Ik heb een gezelschapsspel gespeeld.", "hww": "hebt", "rest": "een gezelschapsspel gespeeld", "emoji": "🎲"},
                {"id": "samen-spelen", "woord": "samen spelen", "spreek": "Ik heb samen gespeeld.", "hww": "hebt", "rest": "samen gespeeld", "emoji": "🧸 🧱"}
              ]
            },
            {
              "id": "feest-vieren",
              "woord": "feest vieren",
              "spreek": "Ik heb feest gevierd.",
              "emoji": "🎉 🎈",
              "beeld": "feestje",
              "ietsAnders": true,
              "kinderen": [
                {"id": "feestje-thuis", "woord": "feestje", "spreek": "Ik heb een feestje gevierd.", "hww": "hebt", "rest": "een feestje gevierd", "emoji": "🎉 🎈", "beeld": "feestje"},
                {"id": "verjaardag", "woord": "verjaardag", "spreek": "Ik heb een verjaardag gevierd.", "hww": "hebt", "rest": "een verjaardag gevierd", "emoji": "🎂 🎁 🎈"}
              ]
            },
            {
              "id": "apero-eten",
              "woord": "apero en eten",
              "spreek": "Ik heb lekker gegeten en gedronken.",
              "emoji": "🍽️ 🥤",
              "beeld": "g-apero-eten",
              "ietsAnders": true,
              "kinderen": [
                {"id": "koken", "woord": "koken", "spreek": "Ik heb gekookt.", "hww": "hebt", "rest": "gekookt", "emoji": "🍳 🥕", "beeld": "bakken-koken"},
                {"id": "aperitieven", "woord": "aperitieven", "spreek": "Ik heb een aperitiefje gedronken.", "hww": "hebt", "rest": "een aperitiefje gedronken", "emoji": "🥤 🥨"},
                {"id": "thuis-eten", "woord": "thuis eten", "spreek": "Ik heb thuis gegeten.", "hww": "hebt", "rest": "thuis gegeten", "emoji": "🍝 🏠", "waar": false}
              ]
            },
            {
              "id": "bezoek-thuis",
              "woord": "bezoek",
              "spreek": "Ik heb bezoek gekregen.",
              "emoji": "🚪 👋",
              "beeld": "bezoek-krijgen",
              "ietsAnders": true,
              "kinderen": [
                {"id": "bezoek-krijgen", "woord": "bezoek krijgen", "spreek": "Ik heb bezoek gekregen.", "hww": "hebt", "rest": "bezoek gekregen", "emoji": "🚪 👋", "waar": false}
              ]
            },
            {
              "id": "chill-binnen",
              "woord": "chill",
              "spreek": "Ik heb rustig gedaan.",
              "emoji": "🛋️ 📺 😎",
              "beeld": "cat-chill",
              "ietsAnders": true,
              "kinderen": [
                {
                  "id": "schermtijd",
                  "woord": "schermtijd",
                  "spreek": "Ik heb naar een scherm gekeken.",
                  "emoji": "📺 🎮",
                  "beeld": "g-schermtijd",
                  "ietsAnders": true,
                  "kinderen": [
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
                  "kinderen": [
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
                  "ietsAnders": true,
                  "kinderen": [
                    {"id": "douchen-bad", "woord": "douchen of bad", "spreek": "Ik heb gedoucht of in bad gezeten.", "hww": "hebt", "rest": "gedoucht of in bad gezeten", "emoji": "🛁 🧼"},
                    {"id": "helpen-thuis", "woord": "helpen thuis", "spreek": "Ik heb thuis geholpen.", "hww": "hebt", "rest": "thuis geholpen", "emoji": "🍽️ 🤝", "waar": false}
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "leefgroep",
      "kleur": "#8fb6d3",
      "woord": "in de leefgroep",
      "spreek": "Ik was in de leefgroep.",
      "emoji": "👥 🏠",
      "vraag": "vraag-binnen-buiten",
      "kinderen": [
        {
          "id": "buiten",
          "woord": "buiten",
          "spreek": "Ik was buiten.",
          "emoji": "🌳 ☀️",
          "ietsAnders": true,
          "kinderen": [
            {"id": "in-de-tuin", "woord": "in de tuin spelen", "spreek": "Ik heb in de tuin gespeeld.", "hww": "hebt", "rest": "in de tuin gespeeld", "emoji": "🌼 ⚽", "waar": false},
            {"id": "trampoline", "woord": "op de trampoline spelen", "spreek": "Ik heb op de trampoline gesprongen.", "hww": "hebt", "rest": "op de trampoline gesprongen", "emoji": "🤸 ⭐"},
            {"id": "bal", "woord": "met de bal spelen", "spreek": "Ik heb met de bal gespeeld.", "hww": "hebt", "rest": "met de bal gespeeld", "emoji": "⚽ 🏀"}
          ]
        },
        {
          "id": "binnen",
          "woord": "binnen",
          "spreek": "Ik was binnen.",
          "emoji": "🏠",
          "ietsAnders": true,
          "kinderen": [
            {
              "id": "creatief",
              "woord": "creatief bezig",
              "spreek": "Ik was creatief bezig.",
              "emoji": "🎨 ✂️",
              "beeld": "g-creatief",
              "ietsAnders": true,
              "kinderen": [
                {"id": "knutselen", "woord": "knutselen", "spreek": "Ik heb geknutseld.", "hww": "hebt", "rest": "geknutseld", "emoji": "✂️ 🎨"},
                {"id": "tekenen", "woord": "tekenen", "spreek": "Ik heb getekend.", "hww": "hebt", "rest": "getekend", "emoji": "✏️ 🖍️"},
                {"id": "schilderen", "woord": "schilderen", "spreek": "Ik heb geschilderd.", "hww": "hebt", "rest": "geschilderd", "emoji": "🖌️ 🎨"},
                {"id": "puzzelen", "woord": "puzzelen", "spreek": "Ik heb gepuzzeld.", "hww": "hebt", "rest": "gepuzzeld", "emoji": "🧩"}
              ]
            },
            {
              "id": "spelen-samen",
              "woord": "spelen",
              "spreek": "Ik heb een spelletje gespeeld.",
              "emoji": "🎲 🧸",
              "beeld": "g-spelen-samen",
              "ietsAnders": true,
              "kinderen": [
                {"id": "gezelschapsspel", "woord": "gezelschapsspel", "spreek": "Ik heb een gezelschapsspel gespeeld.", "hww": "hebt", "rest": "een gezelschapsspel gespeeld", "emoji": "🎲"},
                {"id": "samen-spelen", "woord": "samen spelen", "spreek": "Ik heb samen gespeeld.", "hww": "hebt", "rest": "samen gespeeld", "emoji": "🧸 🧱"}
              ]
            },
            {
              "id": "feest-vieren",
              "woord": "feest vieren",
              "spreek": "Ik heb feest gevierd.",
              "emoji": "🎉 🎈",
              "beeld": "feestje",
              "ietsAnders": true,
              "kinderen": [
                {"id": "feestje-thuis", "woord": "feestje", "spreek": "Ik heb een feestje gevierd.", "hww": "hebt", "rest": "een feestje gevierd", "emoji": "🎉 🎈", "beeld": "feestje"},
                {"id": "verjaardag", "woord": "verjaardag", "spreek": "Ik heb een verjaardag gevierd.", "hww": "hebt", "rest": "een verjaardag gevierd", "emoji": "🎂 🎁 🎈"}
              ]
            },
            {
              "id": "apero-eten",
              "woord": "apero en eten",
              "spreek": "Ik heb lekker gegeten en gedronken.",
              "emoji": "🍽️ 🥤",
              "beeld": "g-apero-eten",
              "ietsAnders": true,
              "kinderen": [
                {"id": "koken", "woord": "koken", "spreek": "Ik heb gekookt.", "hww": "hebt", "rest": "gekookt", "emoji": "🍳 🥕", "beeld": "bakken-koken"},
                {"id": "aperitieven", "woord": "aperitieven", "spreek": "Ik heb een aperitiefje gedronken.", "hww": "hebt", "rest": "een aperitiefje gedronken", "emoji": "🥤 🥨"},
                {"id": "eten-leefgroep", "woord": "eten in de leefgroep", "spreek": "Ik heb in de leefgroep gegeten.", "hww": "hebt", "rest": "in de leefgroep gegeten", "emoji": "🍝", "waar": false}
              ]
            },
            {
              "id": "bezoek-thuis",
              "woord": "bezoek",
              "spreek": "Ik heb bezoek gekregen.",
              "emoji": "🚪 👋",
              "beeld": "bezoek-krijgen",
              "ietsAnders": true,
              "kinderen": [
                {"id": "bezoek-krijgen", "woord": "bezoek krijgen", "spreek": "Ik heb bezoek gekregen.", "hww": "hebt", "rest": "bezoek gekregen", "emoji": "🚪 👋", "waar": false}
              ]
            },
            {
              "id": "chill-binnen",
              "woord": "chill",
              "spreek": "Ik heb rustig gedaan.",
              "emoji": "🛋️ 📺 😎",
              "beeld": "cat-chill",
              "ietsAnders": true,
              "kinderen": [
                {
                  "id": "schermtijd",
                  "woord": "schermtijd",
                  "spreek": "Ik heb naar een scherm gekeken.",
                  "emoji": "📺 🎮",
                  "beeld": "g-schermtijd",
                  "ietsAnders": true,
                  "kinderen": [
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
                  "kinderen": [
                    {"id": "muziek", "woord": "muziek beluisteren", "spreek": "Ik heb naar muziek geluisterd.", "hww": "hebt", "rest": "naar muziek geluisterd", "emoji": "🎵 🎧"},
                    {"id": "boek", "woord": "een boek bekijken", "spreek": "Ik heb een boek bekeken.", "hww": "hebt", "rest": "een boek bekeken", "emoji": "📖"},
                    {"id": "zetel", "woord": "in de zetel zitten", "spreek": "Ik heb in de zetel gezeten.", "hww": "hebt", "rest": "in de zetel gezeten", "emoji": "🛋️"},
                    {"id": "uitslapen", "woord": "uitslapen", "spreek": "Ik heb uitgeslapen.", "hww": "hebt", "rest": "uitgeslapen", "emoji": "😴 🛏️"}
                  ]
                },
                {
                  "id": "verzorging-lg",
                  "woord": "verzorging",
                  "spreek": "Ik heb mij verzorgd of geholpen.",
                  "emoji": "🛁 🧼",
                  "beeld": "g-verzorging",
                  "ietsAnders": true,
                  "kinderen": [
                    {"id": "douchen-bad", "woord": "douchen of bad", "spreek": "Ik heb gedoucht of in bad gezeten.", "hww": "hebt", "rest": "gedoucht of in bad gezeten", "emoji": "🛁 🧼"},
                    {"id": "helpen-opvoeders", "woord": "helpen met de opvoeders", "spreek": "Ik heb geholpen met de opvoeders.", "hww": "hebt", "rest": "in de leefgroep geholpen", "emoji": "🍽️ 🤝", "waar": false}
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "niet-thuis",
      "kleur": "#f7d54e",
      "woord": "niet thuis",
      "spreek": "Ik was niet thuis.",
      "emoji": "🚗 🌍",
      "kinderen": [
        {
          "id": "sporten",
          "woord": "sporten",
          "spreek": "Ik heb gesport.",
          "emoji": "🤸 ⚽",
          "ietsAnders": true,
          "kinderen": [
            {"id": "basketbal", "woord": "basket", "spreek": "Ik heb gebasket.", "hww": "hebt", "rest": "gebasket", "emoji": "🏀"},
            {"id": "muurklimmen", "woord": "muurklimmen", "spreek": "Ik ben gaan muurklimmen.", "hww": "bent", "rest": "gaan muurklimmen", "emoji": "🧗"},
            {"id": "zwemmen", "woord": "zwemmen", "spreek": "Ik ben gaan zwemmen.", "hww": "bent", "rest": "gaan zwemmen", "emoji": "🏊 💦"},
            {"id": "fietsen", "woord": "fietsen", "spreek": "Ik heb gefietst.", "hww": "hebt", "rest": "gefietst", "emoji": "🚲"},
            {"id": "voetballen", "woord": "voetballen", "spreek": "Ik heb gevoetbald.", "hww": "hebt", "rest": "gevoetbald", "emoji": "⚽"},
            {"id": "dansen", "woord": "dansen", "spreek": "Ik heb gedanst.", "hww": "hebt", "rest": "gedanst", "emoji": "💃 🎶"},
            {"id": "hockey", "woord": "hockey", "spreek": "Ik heb hockey gespeeld.", "hww": "hebt", "rest": "hockey gespeeld", "emoji": "🏑"},
            {"id": "judo", "woord": "judo", "spreek": "Ik heb aan judo gedaan.", "hww": "hebt", "rest": "aan judo gedaan", "emoji": "🥋"},
            {"id": "vissen", "woord": "vissen", "spreek": "Ik ben gaan vissen.", "hww": "bent", "rest": "gaan vissen", "emoji": "🎣 🐟"}
          ]
        },
        {
          "id": "spelen-actief",
          "woord": "spelen",
          "spreek": "Ik heb gespeeld.",
          "emoji": "🤸 ⚽",
          "beeld": "g-spelen-actief",
          "ietsAnders": true,
          "kinderen": [
            {"id": "trampoline", "woord": "trampoline", "spreek": "Ik heb op de trampoline gesprongen.", "hww": "hebt", "rest": "op de trampoline gesprongen", "emoji": "🤸 ⭐"},
            {"id": "speeltuin", "woord": "speeltuin", "spreek": "Ik heb in de speeltuin gespeeld.", "hww": "hebt", "rest": "in de speeltuin gespeeld", "emoji": "🎠 🌳", "waar": false},
            {"id": "jeugdbeweging", "woord": "jeugdbeweging", "spreek": "Ik ben naar de jeugdbeweging geweest.", "hww": "bent", "rest": "naar de jeugdbeweging geweest", "emoji": "⛺ 🌲", "waar": false}
          ]
        },
        {
          "id": "uitstap",
          "woord": "uitstap",
          "spreek": "Ik heb een uitstap gemaakt.",
          "emoji": "🎒 🚌",
          "ietsAnders": true,
          "kinderen": [
            {"id": "pretpark", "woord": "pretpark", "spreek": "Ik ben naar het pretpark geweest.", "hww": "bent", "rest": "naar het pretpark geweest", "emoji": "🎢 🎡", "waar": false},
            {"id": "naar-de-speeltuin", "woord": "speeltuin", "spreek": "Ik ben naar de speeltuin geweest.", "hww": "bent", "rest": "naar de speeltuin geweest", "emoji": "🎠 🌳", "waar": false},
            {"id": "winkelen", "woord": "winkelen", "spreek": "Ik ben gaan winkelen.", "hww": "bent", "rest": "gaan winkelen", "emoji": "🛍️", "waar": false},
            {"id": "markt", "woord": "naar de markt", "spreek": "Ik ben naar de markt geweest.", "hww": "bent", "rest": "naar de markt geweest", "emoji": "🍎 🥕 🧀", "waar": false},
            {"id": "dierentuin", "woord": "naar de zoo", "spreek": "Ik ben naar de zoo geweest.", "hww": "bent", "rest": "naar de zoo geweest", "emoji": "🦁 🐘 🦒", "waar": false},
            {"id": "bos", "woord": "naar het bos", "spreek": "Ik ben naar het bos geweest.", "hww": "bent", "rest": "naar het bos geweest", "emoji": "🌲 🍄 🍂", "waar": false},
            {"id": "stad", "woord": "naar de stad", "spreek": "Ik ben naar de stad geweest.", "hww": "bent", "rest": "naar de stad geweest", "emoji": "🏙️ 🚌", "waar": false},
            {"id": "bibliotheek", "woord": "naar de bibliotheek", "spreek": "Ik ben naar de bibliotheek geweest.", "hww": "bent", "rest": "naar de bibliotheek geweest", "emoji": "📚", "waar": false},
            {"id": "cinema", "woord": "naar de cinema", "spreek": "Ik ben naar de cinema geweest.", "hww": "bent", "rest": "naar de cinema geweest", "emoji": "🎬 🍿", "waar": false},
            {"id": "optreden", "woord": "optreden of toneel", "spreek": "Ik ben naar een optreden of toneel geweest.", "hww": "bent", "rest": "naar een optreden of toneel geweest", "emoji": "🎭 🎤", "waar": false},
            {"id": "rijden", "woord": "ergens naartoe rijden", "spreek": "Ik ben ergens naartoe gereden.", "hww": "bent", "rest": "ergens naartoe gereden", "emoji": "🚗 🛣️", "waar": false},
            {"id": "ziekenhuis", "woord": "naar het ziekenhuis", "spreek": "Ik ben naar het ziekenhuis geweest.", "hww": "bent", "rest": "naar het ziekenhuis geweest", "emoji": "🏥", "waar": false},
            {"id": "dokter", "woord": "naar de dokter", "spreek": "Ik ben naar de dokter geweest.", "hww": "bent", "rest": "naar de dokter geweest", "emoji": "🩺", "waar": false},
            {"id": "tandarts", "woord": "naar de tandarts", "spreek": "Ik ben naar de tandarts geweest.", "hww": "bent", "rest": "naar de tandarts geweest", "emoji": "🦷", "waar": false}
          ]
        },
        {
          "id": "gezellig",
          "woord": "gezellig bezig",
          "spreek": "Ik was gezellig bezig.",
          "emoji": "🥰 🎈 🎨",
          "beeld": "cat-gezellig",
          "ietsAnders": true,
          "kinderen": [
            {
              "id": "creatief",
              "woord": "creatief",
              "spreek": "Ik was creatief bezig.",
              "emoji": "🎨 ✂️",
              "beeld": "g-creatief",
              "ietsAnders": true,
              "kinderen": [
                {"id": "knutselen", "woord": "knutselen", "spreek": "Ik heb geknutseld.", "hww": "hebt", "rest": "geknutseld", "emoji": "✂️ 🎨"},
                {"id": "tekenen", "woord": "tekenen", "spreek": "Ik heb getekend.", "hww": "hebt", "rest": "getekend", "emoji": "✏️ 🖍️"},
                {"id": "schilderen", "woord": "schilderen", "spreek": "Ik heb geschilderd.", "hww": "hebt", "rest": "geschilderd", "emoji": "🖌️ 🎨"},
                {"id": "puzzelen", "woord": "puzzelen", "spreek": "Ik heb gepuzzeld.", "hww": "hebt", "rest": "gepuzzeld", "emoji": "🧩"}
              ]
            },
            {
              "id": "spelen-samen",
              "woord": "spelen",
              "spreek": "Ik heb een spelletje gespeeld.",
              "emoji": "🎲 🧸",
              "beeld": "g-spelen-samen",
              "ietsAnders": true,
              "kinderen": [
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
              "kinderen": [
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
              "ietsAnders": true,
              "kinderen": [
                {"id": "koken", "woord": "koken", "spreek": "Ik heb gekookt.", "hww": "hebt", "rest": "gekookt", "emoji": "🍳 🥕", "beeld": "bakken-koken"},
                {"id": "aperitieven", "woord": "aperitieven", "spreek": "Ik heb een aperitiefje gedronken.", "hww": "hebt", "rest": "een aperitiefje gedronken", "emoji": "🥤 🥨"},
                {"id": "gaan-eten", "woord": "gaan eten", "spreek": "Ik ben gaan eten.", "hww": "bent", "rest": "gaan eten", "emoji": "🍽️ 🍟"}
              ]
            },
            {
              "id": "bezoek-weg",
              "woord": "bezoek",
              "spreek": "Ik ben op bezoek geweest.",
              "emoji": "🚪 👋",
              "beeld": "g-bezoek",
              "ietsAnders": true,
              "kinderen": [
                {"id": "familie-bezoeken", "woord": "familie bezoeken", "spreek": "Ik ben op bezoek geweest bij familie.", "hww": "bent", "rest": "op bezoek geweest bij familie", "emoji": "👵 👴 🏠", "waar": false},
                {"id": "vrienden-bezoeken", "woord": "vrienden bezoeken", "spreek": "Ik ben op bezoek geweest bij vrienden.", "hww": "bent", "rest": "op bezoek geweest bij vrienden", "emoji": "🧒 🤝", "waar": false}
              ]
            }
          ]
        },
        {
          "id": "chill-binnen",
          "woord": "chill",
          "spreek": "Ik heb rustig gedaan.",
          "emoji": "🛋️ 📺 😎",
          "beeld": "cat-chill",
          "ietsAnders": true,
          "kinderen": [
            {
              "id": "schermtijd",
              "woord": "schermtijd",
              "spreek": "Ik heb naar een scherm gekeken.",
              "emoji": "📺 🎮",
              "beeld": "g-schermtijd",
              "ietsAnders": true,
              "kinderen": [
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
              "kinderen": [
                {"id": "muziek", "woord": "muziek beluisteren", "spreek": "Ik heb naar muziek geluisterd.", "hww": "hebt", "rest": "naar muziek geluisterd", "emoji": "🎵 🎧"},
                {"id": "boek", "woord": "een boek bekijken", "spreek": "Ik heb een boek bekeken.", "hww": "hebt", "rest": "een boek bekeken", "emoji": "📖"},
                {"id": "zetel", "woord": "in de zetel zitten", "spreek": "Ik heb in de zetel gezeten.", "hww": "hebt", "rest": "in de zetel gezeten", "emoji": "🛋️"},
                {"id": "uitslapen", "woord": "uitslapen", "spreek": "Ik heb uitgeslapen.", "hww": "hebt", "rest": "uitgeslapen", "emoji": "😴 🛏️"}
              ]
            },
            {
              "id": "verzorging-weg",
              "woord": "verzorging",
              "spreek": "Ik heb mij verzorgd.",
              "emoji": "🛁 🧼",
              "beeld": "g-verzorging",
              "ietsAnders": true,
              "kinderen": [
                {"id": "douchen-bad", "woord": "douchen of bad", "spreek": "Ik heb gedoucht of in bad gezeten.", "hww": "hebt", "rest": "gedoucht of in bad gezeten", "emoji": "🛁 🧼"},
                {"id": "kapper", "woord": "naar de kapper", "spreek": "Ik ben naar de kapper geweest.", "hww": "bent", "rest": "naar de kapper geweest", "emoji": "💇 ✂️", "waar": false}
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "niks",
      "kleur": "#ffffff",
      "woord": "ik wil niks vertellen",
      "spreek": "Ik wil niks vertellen.",
      "emoji": "",
      "vraag": "vraag-groep-anders",
      "kinderen": [
        {"id": "weet-niet-meer", "woord": "ik weet het niet meer", "spreek": "Ik weet het niet meer.", "emoji": "🤔", "beeld": "g-weet-niet-meer", "zin": "Jij weet het niet meer?", "lagen": false},
        {"id": "vergeten", "woord": "ik ben het vergeten", "spreek": "Ik ben het vergeten.", "emoji": "🤔", "zin": "Jij bent het vergeten?", "lagen": false},
        {"id": "echt-iets-anders", "woord": "echt nog iets anders", "spreek": "Ik deed echt nog iets anders.", "emoji": "💬", "beeld": "anders", "typ": true},
        {
          "id": "wil-niet-vertellen",
          "woord": "ik wil het niet vertellen",
          "spreek": "Ik wil het niet vertellen.",
          "emoji": "",
          "beeld": "g-wil-niet-vertellen",
          "lagen": false,
          "einde": "einde-rustig",
          "kinderen": [
            {"id": "niet-goed", "woord": "ik voel me niet goed", "spreek": "Ik voel me niet goed.", "emoji": "", "zin": "Jij voelt je niet goed?"},
            {"id": "geen-zin", "woord": "ik heb geen zin om te praten", "spreek": "Ik heb geen zin om te praten.", "emoji": "", "zin": "Jij hebt geen zin om te praten?"},
            {"id": "hoeft-niet", "woord": "je hoeft het niet te weten", "spreek": "Je hoeft het niet te weten.", "emoji": "", "zin": "Jij wil het liever niet vertellen?"}
          ]
        }
      ]
    }
  ],
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
        {"id": "wie-groep", "woord": "groep", "spreek": "Ik was met een groep.", "zin": "met een groep", "emoji": "👥"},
        {"id": "wie-opvoeders", "woord": "opvoeders", "spreek": "Ik was met de opvoeders.", "zin": "met de opvoeders", "emoji": "🧑‍🏫"},
        {"id": "wie-vrienden-lg", "woord": "vrienden van de leefgroep", "spreek": "Ik was met vrienden van de leefgroep.", "zin": "met vrienden van de leefgroep", "emoji": "👫 👬"}
      ]
    },
    {
      "id": "waar",
      "vraag": "Waar?",
      "opties": [
        {"id": "waar-thuis-binnen", "woord": "thuis binnen", "spreek": "Ik was thuis, binnen.", "zin": "thuis binnen", "emoji": "🏠"},
        {"id": "waar-thuis-buiten", "woord": "thuis buiten", "spreek": "Ik was thuis, buiten.", "zin": "thuis buiten", "emoji": "🌳 ☀️"},
        {"id": "waar-familie", "woord": "bij familie", "spreek": "Ik was bij familie.", "zin": "bij familie", "emoji": "🏡 ❤️"},
        {"id": "waar-winkel", "woord": "winkel", "spreek": "Ik was in de winkel.", "zin": "in de winkel", "emoji": "🛒"},
        {"id": "waar-restaurant", "woord": "restaurant", "spreek": "Ik was op restaurant.", "zin": "op restaurant", "emoji": "🍽️"},
        {"id": "waar-frituur", "woord": "frituur", "spreek": "Ik was in de frituur.", "zin": "in de frituur", "emoji": "🍟", "scene": "a Belgian chip shop: a counter with a fryer behind it, a paper cone of fries on the counter and a few bar stools"},
        {"id": "waar-sportclub", "woord": "sportclub", "spreek": "Ik was in de sportclub.", "zin": "in de sportclub", "emoji": "🏟️ ⚽"},
        {"id": "waar-cafe", "woord": "café", "spreek": "Ik was op café.", "zin": "op café", "emoji": "☕", "scene": "a café terrace with small round tables, chairs and a sun umbrella", "titel": "CAFÉ"},
        {"id": "waar-leefgroep", "woord": "de leefgroep", "spreek": "Ik was in de leefgroep.", "zin": "in de leefgroep", "emoji": "👥"},
        {"id": "waar-jeugdbeweging", "woord": "de jeugdbeweging", "spreek": "Ik was bij de jeugdbeweging.", "zin": "bij de jeugdbeweging", "emoji": "⛺ 🌲"},
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
        {"id": "wann-vakantie", "woord": "in de vakantie", "spreek": "Het was in de vakantie.", "zin": "in de vakantie", "emoji": "☀️ 🏖️"},
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
  "zinnen": {"vraag-waar-weekend": "Waar was je in het weekend?", "vraag-binnen-buiten": "Was je binnen of buiten?"}
};
