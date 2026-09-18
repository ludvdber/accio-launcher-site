/* ===========================================
   ACCIO LAUNCHER — V2
   =========================================== */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* --- Crossfade hero video poster→playing --- */
  var heroVid = document.querySelector('.hero-video');
  if (heroVid) {
    heroVid.addEventListener('playing', function () { heroVid.classList.add('playing'); });
  }

  /* --- Particles --- */
  var c = document.getElementById('particles');
  var ctx = c.getContext('2d');
  var ps = [], N = 30, running = false;

  function resize() { c.width = innerWidth; c.height = innerHeight; }

  function make(init) {
    var g = Math.random() > 0.3;
    var o = Math.random() * 0.4 + 0.1;
    return {
      x: Math.random() * c.width,
      y: init ? Math.random() * c.height : c.height + 10,
      r: Math.random() * 1.8 + 0.5,
      s: Math.random() * 0.35 + 0.1,
      osc: Math.random() * 1.2 + 0.4,
      os: Math.random() * 0.007 + 0.002,
      ph: Math.random() * Math.PI * 2,
      col: g ? 'rgba(212,160,23,' + o + ')' : 'rgba(190,190,210,' + o + ')'
    };
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      p.y -= p.s;
      p.ph += p.os;
      ctx.beginPath();
      ctx.arc(p.x + Math.sin(p.ph) * p.osc, p.y, p.r, 0, 6.28);
      ctx.fillStyle = p.col;
      ctx.fill();
      if (p.y < -10) ps[i] = make(false);
    }
    requestAnimationFrame(tick);
  }

  if (!reduced) {
    resize();
    for (var i = 0; i < N; i++) ps.push(make(true));
    running = true;
    tick();
    var rt;
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) running = false;
      else { running = true; tick(); }
    });
  }

  /* --- Nav scroll --- */
  var nav = document.getElementById('nav');
  var prog = document.getElementById('nav-progress');
  addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', scrollY > 60);
    if (prog) {
      var h = document.documentElement.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    }
  });

  /* --- Burger menu --- */
  var burger = document.getElementById('nav-burger');
  var navLinks = document.getElementById('nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Background music toggle --- */
  var bgMusic = document.getElementById('bg-music');
  var musicBtn = document.getElementById('nav-music');
  if (bgMusic && musicBtn) {
    bgMusic.volume = 0.15;
    var musicPlaying = false;
    musicBtn.classList.add('muted');
    musicBtn.addEventListener('click', function () {
      if (musicPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('muted');
      } else {
        bgMusic.play().catch(function () {});
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('muted');
      }
      musicPlaying = !musicPlaying;
    });
  }

  /* --- Game grid: click to expand detail inline --- */
  var gameDescs = {
    fr: [
      { y:'2001', t:'À l\'école des sorciers', d:'Jeu d\'action-aventure en 3D où vous incarnez Harry lors de sa première année à Poudlard. Apprenez les sortilèges comme Flipendo et Lumos, explorez le château et ses environs, collectez les dragées surprises de Bertie Crochue et les cartes de sorciers célèbres. Des cours de vol sur balai aux affrontements dans les souterrains, revivez l\'aventure qui a fait découvrir Poudlard à toute une génération de joueurs.' },
      { y:'2002', t:'La Chambre des secrets', d:'Retournez à Poudlard pour une deuxième année encore plus riche. Le château est désormais un véritable monde ouvert à explorer librement entre les cours. Nouveaux sortilèges, duels de sorciers, matchs de Quidditch jouables et un bestiaire élargi avec les elfes de maison, les acromantules et le Basilic. Le jeu qui a défini ce que pouvait être un monde Harry Potter interactif.' },
      { y:'2004', t:'Le Prisonnier d\'Azkaban', d:'Pour la première fois, jouez trois personnages : Harry, Ron et Hermione. Chacun possède des capacités uniques indispensables pour résoudre les énigmes. Harry repousse les Détraqueurs avec Expecto Patronum, Hermione transforme les statues en créatures, Ron attire les objets à lui avec Carpe Retractum. Le gameplay coopératif donne une vraie profondeur à l\'exploration de Poudlard et de ses environs, de la Cabane Hurlante à la Forêt Interdite.' },
      { y:'2005', t:'La Coupe de feu', d:'Le Tournoi des Trois Sorciers en coopération jusqu\'à 3 joueurs. Affrontez le Magyar à pointes, plongez dans le Lac Noir et parcourez le labyrinthe du Tournoi. Le jeu mise sur l\'action et le travail d\'équipe : lancez des sorts combinés, protégez vos alliés et adaptez votre stratégie à chaque épreuve. Un gameplay nerveux qui change radicalement du reste de la série.' },
      { y:'2007', t:'L\'Ordre du Phénix', d:'Poudlard en monde ouvert comme jamais auparavant. Chaque couloir, chaque salle, chaque passage secret est modélisé et explorable librement. Recrutez les membres de l\'Armée de Dumbledore, apprenez de nouveaux sorts en traçant des gestes avec la baguette, et affrontez Ombrage et les Mangemorts. La représentation la plus fidèle et la plus ambitieuse du château jamais créée dans un jeu vidéo.' },
      { y:'2009', t:'Le Prince de sang-mêlé', d:'Trois piliers de gameplay : les duels de sorciers en temps réel, la préparation de potions et l\'exploration libre de Poudlard. Le château s\'est encore enrichi avec de nouvelles zones et des missions secondaires. Affrontez des adversaires de plus en plus redoutables en duel, maîtrisez l\'art subtil des potions du Prince de Sang-Mêlé, et découvrez les secrets les plus sombres de l\'école.' },
      { y:'2010', t:'Les Reliques de la Mort — Partie 1', d:'Rupture totale avec les épisodes précédents. Fini l\'exploration de Poudlard : place à un jeu d\'action à la troisième personne où Harry, Ron et Hermione fuient les Mangemorts à travers l\'Angleterre. Système de couverture, sorts offensifs variés et missions d\'infiltration. Du Ministère de la Magie à la forêt de Dean, la chasse aux Horcruxes commence.' },
      { y:'2011', t:'Les Reliques de la Mort — Partie 2', d:'La Bataille de Poudlard. Le dernier jeu de la série concentre toute son action sur l\'affrontement final. Incarnez Harry, mais aussi Hermione, Ron, Ginny, Seamus, Neville et même le Professeur McGonagall dans des missions variées. Défendez le château salle par salle, détruisez les derniers Horcruxes et affrontez Voldemort dans un duel ultime.' }
    ],
    en: [
      { y:'2001', t:'Philosopher’s Stone', d:'A 3D action-adventure where you play Harry through his first year at Hogwarts. Learn spells like Flipendo and Lumos, explore the castle and its grounds, and collect Bertie Bott’s Every Flavour Beans and Famous Witches and Wizards cards. From flying lessons to the dungeons below, relive the adventure that introduced a whole generation of players to Hogwarts.' },
      { y:'2002', t:'Chamber of Secrets', d:'Back to Hogwarts for a second year with far more to do. The castle becomes a true open world you can roam freely between lessons. New spells, wizard duels, playable Quidditch matches and a bigger bestiary, with house-elves, giant spiders and the Basilisk. The game that set the standard for what a Harry Potter game could be.' },
      { y:'2004', t:'Prisoner of Azkaban', d:'For the first time you play as three characters — Harry, Ron and Hermione — each with abilities you’ll need to solve the puzzles. Harry drives off Dementors with Expecto Patronum, Hermione turns statues into creatures, and Ron pulls things towards him with Carpe Retractum. Working as a team gives real depth to exploring Hogwarts and beyond, from the Shrieking Shack to the Forbidden Forest.' },
      { y:'2005', t:'Goblet of Fire', d:'The Triwizard Tournament, in co-op for up to three players. Face the Hungarian Horntail, dive into the Black Lake and find your way through the maze. This one is all about action and teamwork: cast combined spells, protect your friends and adapt your tactics to each task. Fast-paced action unlike anything else in the series.' },
      { y:'2007', t:'Order of the Phoenix', d:'Hogwarts as you’ve never seen it: a fully open castle where every corridor, room and secret passage can be explored. Recruit Dumbledore’s Army, learn new spells with wand gestures, and stand up to Umbridge and the Death Eaters. The most faithful and ambitious version of the castle ever put in a video game.' },
      { y:'2009', t:'Half-Blood Prince', d:'Three ways to play: real-time wizard duels, potion-making and free exploration of Hogwarts. The castle is bigger than ever, with new areas and side quests. Take on tougher and tougher opponents, master the Half-Blood Prince’s potions and uncover the school’s darkest secrets.' },
      { y:'2010', t:'Deathly Hallows — Part 1', d:'A complete change of direction. Hogwarts is behind you: this is a third-person action game, with Harry, Ron and Hermione on the run from the Death Eaters across England. Take cover, fight with a range of attack spells and slip through stealth missions. From the Ministry of Magic to the Forest of Dean, the hunt for the Horcruxes begins.' },
      { y:'2011', t:'Deathly Hallows — Part 2', d:'The Battle of Hogwarts. The last game in the series is all about the final showdown. Play as Harry, but also as Hermione, Ron, Ginny, Seamus, Neville and even Professor McGonagall. Defend the castle room by room, destroy the last Horcruxes and face Voldemort in one final duel.' }
    ],
    es: [
      { y:'2001', t:'La piedra filosofal', d:'Aventura de acción en 3D en la que te pones en la piel de Harry durante su primer curso en Hogwarts. Aprende hechizos como Flipendo y Lumos, explora el castillo y sus alrededores, y colecciona grageas Bertie Bott de todos los sabores y cromos de magos famosos. De las clases de vuelo a los subterráneos del castillo, revive la aventura con la que toda una generación de jugadores descubrió Hogwarts.' },
      { y:'2002', t:'La cámara secreta', d:'Vuelve a Hogwarts para un segundo curso con mucho más que hacer. El castillo se convierte en un auténtico mundo abierto que puedes recorrer libremente entre clase y clase. Nuevos hechizos, duelos de magos, partidos de quidditch y un bestiario más amplio, con elfos domésticos, acromántulas y el basilisco. El juego que marcó cómo tenía que ser un Harry Potter interactivo.' },
      { y:'2004', t:'El prisionero de Azkaban', d:'Por primera vez juegas con tres personajes —Harry, Ron y Hermione—, cada uno con habilidades propias que necesitarás para resolver los acertijos. Harry ahuyenta a los dementores con Expecto Patronum, Hermione convierte las estatuas en criaturas y Ron atrae objetos hacia él con Carpe Retractum. Jugar en equipo le da mucha más profundidad a explorar Hogwarts y sus alrededores, de la Casa de los Gritos al Bosque Prohibido.' },
      { y:'2005', t:'El cáliz de fuego', d:'El Torneo de los Tres Magos en cooperativo, hasta para tres jugadores. Enfréntate al Colacuerno Húngaro, sumérgete en el Lago Negro y recorre el laberinto. Aquí mandan la acción y el trabajo en equipo: lanza hechizos combinados, protege a tus compañeros y adapta tu estrategia a cada prueba. Un ritmo frenético que no se parece a nada del resto de la saga.' },
      { y:'2007', t:'La Orden del Fénix', d:'Un Hogwarts abierto como nunca se había visto: cada pasillo, cada sala y cada pasadizo secreto se puede recorrer libremente. Recluta al Ejército de Dumbledore, aprende nuevos hechizos con gestos de varita y plántales cara a Umbridge y a los mortífagos. La versión más fiel y ambiciosa del castillo que se ha hecho nunca en un videojuego.' },
      { y:'2009', t:'El misterio del príncipe', d:'Tres formas de jugar: duelos de magos en tiempo real, preparación de pociones y exploración libre de Hogwarts. El castillo es más grande que nunca, con nuevas zonas y misiones secundarias. Enfréntate a rivales cada vez más duros, domina las pociones del Príncipe Mestizo y descubre los secretos más oscuros del colegio.' },
      { y:'2010', t:'Las Reliquias de la Muerte — Parte 1', d:'Un cambio radical respecto a las entregas anteriores. Se acabó explorar Hogwarts: es un juego de acción en tercera persona en el que Harry, Ron y Hermione huyen de los mortífagos por toda Inglaterra. Coberturas, hechizos de ataque variados y misiones de sigilo. Del Ministerio de Magia al bosque de Dean, empieza la caza de los Horrocruxes.' },
      { y:'2011', t:'Las Reliquias de la Muerte — Parte 2', d:'La Batalla de Hogwarts. El último juego de la saga se centra por completo en el enfrentamiento final. Juega como Harry, pero también como Hermione, Ron, Ginny, Seamus, Neville e incluso la profesora McGonagall. Defiende el castillo sala por sala, destruye los últimos Horrocruxes y enfréntate a Voldemort en un duelo final.' }
    ]
  };
  var bgMap = [
    'assets/backgrounds/hp1.jpg','assets/backgrounds/hp2.jpg','assets/backgrounds/hp3.jpg',
    'assets/backgrounds/hp4.jpg','assets/backgrounds/hp5.jpg','assets/backgrounds/hp6.jpg',
    'assets/backgrounds/hp7a.jpg','assets/backgrounds/hp7b.jpg'
  ];

  var gcardGrid = document.getElementById('gcard-grid');
  var gcards = document.querySelectorAll('.gcard');
  var detailTpl = document.getElementById('gcard-detail-tpl');
  var activeGame = -1;
  var activeDetail = null;

  function closeGame() {
    if (activeDetail) { activeDetail.remove(); activeDetail = null; }
    gcards.forEach(function (c) { c.classList.remove('active'); });
    activeGame = -1;
  }

  function openGame(idx) {
    if (activeGame === idx) { closeGame(); return; }
    closeGame();
    activeGame = idx;
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
    var data = (gameDescs[lang] || gameDescs.fr)[idx];
    var card = gcards[idx];
    card.classList.add('active');

    // Clone template
    var frag = detailTpl.content.cloneNode(true);
    var el = frag.querySelector('.gcard-detail');
    el.querySelector('.gcard-detail-year').textContent = data.y;
    el.querySelector('.gcard-detail-title').textContent = data.t;
    el.querySelector('.gcard-detail-text').textContent = data.d;
    el.querySelector('.gcard-detail-bg').style.backgroundImage = 'url(' + bgMap[idx] + ')';
    el.querySelector('.gcard-detail-close').addEventListener('click', closeGame);
    applyAttrs(el, lang);

    // Position arrow under the active card
    var gridRect = gcardGrid.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var arrowLeft = cardRect.left - gridRect.left + cardRect.width / 2 - 8;
    el.querySelector('.gcard-detail-arrow').style.left = arrowLeft + 'px';

    // Insert after the last card in this row
    // Desktop: 4 per row. Mobile: 2 per row.
    var cols = getComputedStyle(gcardGrid).gridTemplateColumns.split(' ').length;
    var rowEnd = Math.min((Math.floor(idx / cols) + 1) * cols, gcards.length) - 1;
    var afterCard = gcards[rowEnd];
    afterCard.insertAdjacentElement('afterend', el);
    activeDetail = el;

    setTimeout(function () {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }

  gcards.forEach(function (card) {
    card.addEventListener('click', function () {
      openGame(parseInt(card.getAttribute('data-game'), 10));
    });
  });

  /* --- GitHub data --- */
  var dlEl = document.getElementById('dl-count');
  var verEl = document.getElementById('version');
  var buildEl = document.getElementById('dl-build');
  var latestTag = '';

  // Version et poids reels sous le bouton. Sans reponse de l'API, la ligne garde
  // son texte de repli ecrit dans le HTML : elle ne doit jamais rester vide.
  var RELEASES_URL = 'https://github.com/ludvdber/AccioLauncher/releases/latest';
  var buildWords = {
    fr: { os: 'Windows 10 et 11', oss: 'Open-source', notes: 'Notes de version' },
    en: { os: 'Windows 10 and 11', oss: 'Open-source', notes: 'Release notes' },
    es: { os: 'Windows 10 u 11', oss: 'Código abierto', notes: 'Notas de la versión' }
  };
  // Le numero de version est lui-meme le lien vers le changelog. Tant que l'API
  // n'a pas repondu, le lien garde son libelle : le changelog reste joignable.
  function renderBuild() {
    if (!buildEl) return;
    var w = buildWords[currentLang] || buildWords.fr;
    var label = latestTag ? 'Version ' + latestTag.replace(/^v/, '') : w.notes;
    var parts = ['<a href="' + RELEASES_URL + '" target="_blank" rel="noopener" title="' +
                 w.notes + '">' + label + '</a>'];
    parts.push(w.os);
    parts.push(w.oss);
    buildEl.innerHTML = parts.join('<span class="hero-sep">·</span>');
  }
  fetch('https://api.github.com/repos/ludvdber/AccioLauncher/releases?per_page=100')
    .then(function (r) { if (!r.ok) throw r; return r.json(); })
    .then(function (rel) {
      var t = 0;
      rel.forEach(function (r) { r.assets.forEach(function (a) { t += a.download_count; }); });
      if (dlEl) animateCount(dlEl, t);
      var latest = rel.find(function (r) { return !r.prerelease; }) || rel[0];
      if (latest) {
        latestTag = latest.tag_name || '';
        renderBuild();
        // Les donnees structurees annoncaient une version figee dans le HTML :
        // elle vient maintenant du meme tag que le reste.
        var ld = document.getElementById('ld-app');
        if (ld && latestTag) {
          try {
            var data = JSON.parse(ld.textContent);
            data.softwareVersion = latestTag.replace(/^v/, '');
            ld.textContent = JSON.stringify(data, null, 2);
          } catch (e) {}
        }
      }
      if (latest && verEl) {
        var vTxt = 'Accio Launcher ' + latest.tag_name;
        if (latest.published_at) {
          var d = new Date(latest.published_at);
          var monthNames = {
            fr: ['jan.','fév.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'],
            en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            es: ['ene.','feb.','mar.','abr.','may.','jun.','jul.','ago.','sept.','oct.','nov.','dic.']
          };
          var months = monthNames[currentLang] || monthNames.fr;
          vTxt += ' — ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
        }
        verEl.textContent = vTxt;
      }
    })
    .catch(function () {});

  /* --- Apres un clic sur Telecharger ---
     Le fichier part de GitHub sans rien changer a la page : on confirme que
     c'est parti, on souhaite bon jeu, et on glisse l'etoile en seconde ligne.
     Le bouton de la barre de navigation n'y a pas droit : c'est un raccourci,
     et le bloc s'afficherait loin de l'endroit ou le visiteur regarde. */
  var thanks = document.getElementById('dl-thanks');
  if (thanks) {
    document.querySelectorAll('a.cta[href*="releases/latest/download/"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.insertAdjacentElement('afterend', thanks);
        thanks.hidden = false;
      });
    });
  }

  /* --- Discord : nombre de membres, en direct ---
     L'API publique des invitations repond sans cle et autorise l'appel depuis le
     navigateur. Si elle ne repond pas, la ligne reste masquee : pas de trou. */
  var liveEl = document.getElementById('community-live');
  var dMembers = 0, dOnline = 0;

  function renderDiscord() {
    if (!liveEl || !dMembers) return;
    if (currentLang === 'en') {
      liveEl.innerHTML = '<b>' + dMembers + '</b> members on Discord, <b>' + dOnline + '</b> of them online right now.';
    } else if (currentLang === 'es') {
      liveEl.innerHTML = '<b>' + dMembers + '</b> miembros en Discord, <b>' + dOnline + '</b> conectados ahora mismo.';
    } else {
      liveEl.innerHTML = 'Le Discord compte <b>' + dMembers + '</b> membres, dont <b>' + dOnline + '</b> en ligne en ce moment.';
    }
    liveEl.hidden = false;
  }

  if (liveEl) {
    fetch('https://discord.com/api/v10/invites/TNwDQd7KGe?with_counts=true')
      .then(function (r) { if (!r.ok) throw r; return r.json(); })
      .then(function (d) {
        dMembers = d.approximate_member_count || 0;
        dOnline = d.approximate_presence_count || 0;
        renderDiscord();
      })
      .catch(function () {});
  }

  /* --- Comparison slider --- */
  var slider = document.getElementById('slider');
  var handle = document.getElementById('slider-handle');
  var after = document.getElementById('slider-after');
  if (slider && handle && after) {
    var dragging = false;
    var pct = 50;
    function set(val) {
      pct = Math.max(0, Math.min(100, val));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
      slider.setAttribute('aria-valuenow', Math.round(pct));
    }
    function fromX(cx) { var r = slider.getBoundingClientRect(); set(((cx - r.left) / r.width) * 100); }

    var sliderHint = document.getElementById('slider-hint');
    function hideHint() { if (sliderHint) sliderHint.classList.add('hidden'); }
    slider.addEventListener('mousedown', function (e) { dragging = true; fromX(e.clientX); hideHint(); });
    addEventListener('mousemove', function (e) { if (dragging) { e.preventDefault(); fromX(e.clientX); } });
    addEventListener('mouseup', function () { dragging = false; });
    slider.addEventListener('touchstart', function (e) { dragging = true; fromX(e.touches[0].clientX); hideHint(); }, { passive: true });
    slider.addEventListener('touchmove', function (e) { if (dragging) { e.preventDefault(); fromX(e.touches[0].clientX); } }, { passive: false });
    slider.addEventListener('touchend', function () { dragging = false; });

    // Keyboard support
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); set(pct - 2); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); set(pct + 2); }
    });
  }

  /* --- Animated count (triggered when visible) --- */
  function animateCount(el, target) {
    if (!el || target === 0) { if (el) el.textContent = '0'; return; }
    function run() {
      var dur = 1400, start = performance.now();
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { run(); io.disconnect(); }
      }, { threshold: 0.5 });
      io.observe(el);
    } else { run(); }
  }

  /* --- Typing animation on hero subtitle --- */
  var typed = document.getElementById('hero-typed');
  var frPhrase = 'Revivez les 8 jeux Harry Potter PC avec des graphismes modernes.';
  var phrase = frPhrase;
  var typedLang = 'fr';
  var ti = 0, typeRun = 0;
  // Chaque frappe porte un jeton : changer de langue en cours de route annule
  // la precedente au lieu de melanger deux phrases dans le meme element.
  function typeNext(run) {
    if (run !== typeRun || !typed) return;
    if (ti < phrase.length) {
      typed.textContent += phrase[ti];
      ti++;
      setTimeout(function () { typeNext(run); }, 35 + Math.random() * 25);
    } else {
      typed.classList.add('typed-done');
    }
  }
  function startTyping(delay) {
    typeRun++;
    var run = typeRun;
    ti = 0;
    typed.textContent = '';
    typed.classList.remove('typed-done');
    setTimeout(function () { typeNext(run); }, delay);
  }
  if (typed) {
    if (reduced) {
      typed.classList.add('typed-done');
    } else {
      startTyping(800);
    }
  }

  /* --- Back to top --- */
  var btt = document.getElementById('btt');
  if (btt) {
    addEventListener('scroll', function () {
      btt.classList.toggle('visible', scrollY > innerHeight);
    });
    btt.addEventListener('click', function () {
      scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Hero dimming on scroll --- */
  var heroFade = document.querySelector('.hero-fade');
  if (heroFade && !reduced) {
    addEventListener('scroll', function () {
      var ratio = Math.min(scrollY / (innerHeight * 0.7), 1);
      // Les valeurs de depart doivent etre celles du CSS : sinon le hero
      // s'assombrit d'un coup au premier pixel de defilement, et n'y revient
      // jamais puisque ce style en ligne l'emporte ensuite sur la feuille.
      heroFade.style.background =
        'radial-gradient(ellipse at center, rgba(6,6,17,' + (0.12 + ratio * 0.68) + ') 0%, rgba(6,6,17,1) ' + (92 - ratio * 37) + '%),' +
        'linear-gradient(180deg, rgba(6,6,17,' + (0.06 + ratio * 0.64) + ') 0%, rgba(6,6,17,' + (0.22 + ratio * 0.68) + ') 50%, rgba(6,6,17,1) 100%)';
    });
  }

  /* --- Compare tabs (switch game pairs) --- */
  var tabs = document.querySelectorAll('.compare-tab');
  var imgBefore = document.getElementById('img-before');
  var imgAfter = document.getElementById('img-after');
  if (tabs.length && imgBefore && imgAfter) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        // Show placeholders
        var phs = document.querySelectorAll('.slider-placeholder');
        phs.forEach(function (p) { p.style.display = ''; });
        // Load new images
        function hideOnLoad(img) {
          var ph = img.parentElement.querySelector('.slider-placeholder');
          img.onload = function () { if (ph) ph.style.display = 'none'; };
        }
        hideOnLoad(imgBefore);
        hideOnLoad(imgAfter);
        imgBefore.src = tab.getAttribute('data-before');
        imgAfter.src = tab.getAttribute('data-after');
        if (imgBefore.complete) { var ph = imgBefore.parentElement.querySelector('.slider-placeholder'); if (ph) ph.style.display = 'none'; }
        if (imgAfter.complete) { var ph2 = imgAfter.parentElement.querySelector('.slider-placeholder'); if (ph2) ph2.style.display = 'none'; }
        // Reset slider to 50%
        if (after && handle) {
          after.style.clipPath = 'inset(0 0 0 50%)';
          handle.style.left = '50%';
          pct = 50;
        }
      });
    });
  }

  /* --- Scroll reveal --- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('shown'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('shown'); });
  }

  /* --- Smooth scroll (+ close mobile nav) --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* --- Preview tab switcher --- */
  var previewTabs = document.querySelectorAll('.preview-tab');
  var previewImg = document.getElementById('preview-img');
  if (previewTabs.length && previewImg) {
    previewTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        previewTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        previewImg.style.opacity = '0';
        setTimeout(function () {
          var newSrc = tab.getAttribute('data-src');
          previewImg.onload = function () { previewImg.style.opacity = '1'; };
          previewImg.src = newSrc;
          // Fallback if cached (onload already fired)
          if (previewImg.complete) previewImg.style.opacity = '1';
        }, 200);
      });
    });
    previewImg.style.transition = 'opacity 0.3s';
  }


  /* --- Easter egg: type "marauder" anywhere --- */
  var eeBuffer = '';
  var eeTarget = 'marauder';
  var eeMsg = document.getElementById('ee-msg');
  if (eeMsg) {
    document.addEventListener('keydown', function (e) {
      if (e.key.length === 1) eeBuffer += e.key.toLowerCase();
      if (eeBuffer.length > eeTarget.length) eeBuffer = eeBuffer.slice(-eeTarget.length);
      if (eeBuffer === eeTarget) {
        eeMsg.classList.add('show');
        // Burst of gold particles
        if (c && c.width) {
          if (!running) { resize(); running = true; tick(); }
          for (var i = 0; i < 60; i++) {
            ps.push({
              x: c.width / 2 + (Math.random() - 0.5) * 600,
              y: c.height / 2 + (Math.random() - 0.5) * 400,
              r: Math.random() * 3.5 + 1,
              s: Math.random() * 2 + 0.8,
              osc: Math.random() * 4,
              os: Math.random() * 0.03,
              ph: Math.random() * 6.28,
              col: 'rgba(240,208,96,' + (Math.random() * 0.7 + 0.3) + ')'
            });
          }
        }
        setTimeout(function () { eeMsg.classList.remove('show'); eeBuffer = ''; }, 4000);
      }
    });
  }

  /* --- Hide placeholders on image load --- */
  document.querySelectorAll('.slider-before img, .slider-after img').forEach(function (img) {
    function h() { var p = img.parentElement.querySelector('.slider-placeholder'); if (p) p.style.display = 'none'; }
    if (img.complete && img.naturalWidth > 0) h(); else img.addEventListener('load', h);
  });

  /* --- i18n (FR/EN toggle) --- */
  var i18n = {
    en: {
      nav_games: 'Games', nav_compare: 'Before/After', nav_community: 'Community', nav_dl: 'Download',
      hero_cta: 'Download for free', hero_downloads: 'downloads',
      hero_typed: 'Relive all 8 Harry Potter PC games with modern graphics.',
      hero_warn_q: 'Windows will show a warning the first time you run it — that’s normal.',
      hero_warn_a: 'The launcher is free and isn’t signed with a paid certificate, so Windows shows “Windows protected your PC”. Click <em>More info</em>, then <em>Run anyway</em>.',
      games_heading: 'The Games', games_sub: '2001 – 2011. Ten years of Harry Potter on PC, all in one launcher. All eight games are available and ready to play.', games_cta: 'Download Accio Launcher',
      game1_title: "Philosopher’s Stone",
      game2_title: 'Chamber of Secrets',
      game3_title: 'Prisoner of Azkaban',
      game4_title: 'Goblet of Fire',
      game5_title: 'Order of the Phoenix',
      game6_title: 'Half-Blood Prince',
      game7_title: 'Deathly Hallows — 1',
      game8_title: 'Deathly Hallows — 2',
      preview_heading: 'The Launcher', preview_sub: 'Everything is set up from the very first launch. Pick a game and play.',
      preview_tab1: 'The catalogue', preview_tab2: 'Installed game', preview_tab3: 'Versions',
      pf1: 'One-click downloads that resume if your connection drops',
      pf2: 'English, French and Spanish',
      pf3: 'Five Hogwarts house themes',
      pf4: 'Playtime and session history',
      pf5: 'Repairs broken installations',
      pf6: 'Updates itself',
      compare_heading: 'Before / After', compare_sub: 'What the graphics upgrade changes, game by game.',
      ctab1: 'HP1 — Hogwarts corridors', ctab2: 'HP5 — Common room',
      ctab3: 'HP5 — Library', ctab4: 'HP5 — The castle',
      ctab5: 'HP6 — The Burrow', ctab6: 'HP6 — The grounds at night',
      slider_hint: 'Drag to compare',
      community_heading: 'Community',
      community_sub: 'Accio Launcher is shaped by the people who use it. Your bug reports get things fixed, and your screenshots show others what it can do.',
      ccard1_t: 'Report a bug',
      ccard1_d: 'Game won’t start? Download stuck? Something looks off? Open an issue on GitHub. It’s the fastest way to get it fixed — and it saves everyone else from running into the same problem.',
      ccard1_cta: 'Open an issue',
      ccard2_t: 'Share your screenshots',
      ccard2_d: 'A Hogwarts corridor in perfect light, a duel caught at just the right moment, the castle at sunset: show them off on Discord or GitHub. The best ones get featured.',
      ccard3_t: 'Share an idea',
      ccard3_d: 'Missing a feature, or something that bugs you? Suggest it. The launcher is available in English, French and Spanish, and adding a language doesn’t take any code — just a translation file.',
      ccard3_cta: 'Suggest', ccard3_cta2: 'Help translate',
      faq_heading: 'FAQ',
      faq1_q: 'Is it legal?', faq1_a: 'Accio Launcher is just a tool: it contains no game files. It downloads games that haven’t been on sale for years and installs them for you. You’re expected to own the games you install, and it’s up to you to check what the law allows where you live. The code is public, and the project isn’t affiliated with Warner Bros. or Electronic Arts.',
      faq2_q: 'Is it free?', faq2_a: 'Yes, completely. It’s open-source, with no ads and no tracking.',
      faq3_q: 'Is it safe?', faq3_a: 'The code is public on GitHub. Every download is verified as it comes in: if a file is damaged or tampered with along the way, it’s rejected. No account, no data collection, no ads.',
      faq4_q: 'What do the graphics look like?', faq4_a: 'Full HD (1920×1080), with sharper visuals and better lighting — how much depends on the game. Everything comes pre-configured: there’s nothing else to install or tweak.',
      faq5_q: 'Are all 8 games available?', faq5_a: 'Yes, since version 1.0 — from Philosopher’s Stone (2001) to Deathly Hallows — Part 2 (2011). The whole collection is there.',
      faq6_q: 'Why does Windows show a warning?', faq6_a: 'That’s expected. The launcher is free, and a code-signing certificate costs several hundred euros a year, so Windows shows “Windows protected your PC”. Click <em>More info</em>, then <em>Run anyway</em>. The file comes straight from the project’s GitHub page — the same place as the source code.',
      faq7_q: 'Do I need to reinstall it for every update?', faq7_a: 'No. The launcher updates itself in one click, and your installed games stay put.',
      faq8_q: 'What do I need?', faq8_a: 'Windows 10 or 11, 8 GB of RAM and a graphics card with 2 GB of video memory. Make sure you have room for the biggest game — the launcher checks your free space and warns you before downloading.',
      support_heading: 'Support the project',
      support_text: 'Made by one developer in their spare time. No ads, nothing to buy — just the wish to bring these games back to life.',
      kofi_cta: '☕ Buy me a coffee on Ko-fi',
      footer_oss: 'Source code on <a href="https://github.com/ludvdber/AccioLauncher" target="_blank" rel="noopener">GitHub</a> — MIT licence; the released executable is under GPL v3.',
      fl_launcher: 'The launcher', fl_catalog: 'The game catalogue', fl_issues: 'Report a bug',
      legal1: 'Accio Launcher is an independent community project, not affiliated with Warner Bros. Entertainment Inc. or Electronic Arts Inc. Harry Potter™ is a registered trademark of Warner Bros. Entertainment Inc. © Wizarding World.',
      legal2: 'This software is provided free of charge and as is. Users must legally own the games they install.',
      page_title: 'Accio Launcher — Every Harry Potter PC game',
      page_desc: 'All 8 Harry Potter PC games (2001–2011) in one launcher: one-click downloads, upgraded graphics, everything pre-configured. Free and open-source.',
      alt_hp1: "Box art for Harry Potter and the Philosopher’s Stone (2001)",
      alt_hp2: 'Box art for Harry Potter and the Chamber of Secrets (2002)',
      alt_hp3: 'Box art for Harry Potter and the Prisoner of Azkaban (2004)',
      alt_hp4: 'Box art for Harry Potter and the Goblet of Fire (2005)',
      alt_hp5: 'Box art for Harry Potter and the Order of the Phoenix (2007)',
      alt_hp6: 'Box art for Harry Potter and the Half-Blood Prince (2009)',
      alt_hp7: 'Box art for Harry Potter and the Deathly Hallows — Part 1 (2010)',
      alt_hp8: 'Box art for Harry Potter and the Deathly Hallows — Part 2 (2011)',
      alt_launcher: 'Accio Launcher showing a game page and a carousel of all eight covers',
      alt_before: 'Original graphics', alt_after: 'Enhanced graphics',
      ph_before: 'Before — Original', ph_after: 'After — Enhanced',
      aria_music: 'Music', title_music: 'Ambient music', aria_menu: 'Menu',
      aria_close: 'Close', aria_compare: 'Before/after comparison', aria_top: 'Back to top',
      dl_thanks_title: 'Your download has started. Enjoy the games!',
      dl_thanks_star: 'If you enjoy it, a <a href="https://github.com/ludvdber/AccioLauncher" target="_blank" rel="noopener">star on GitHub</a> helps other players find it.',
      ee_main: 'I solemnly swear that I am up to no good.',
      ee_sub: 'Mischief managed.'
    },
    es: {
      nav_games: 'Juegos', nav_compare: 'Antes/Después', nav_community: 'Comunidad', nav_dl: 'Descargar',
      hero_cta: 'Descargar gratis', hero_downloads: 'descargas',
      hero_typed: 'Revive los 8 juegos de Harry Potter para PC con gráficos modernos.',
      hero_warn_q: 'Windows mostrará una advertencia la primera vez que lo abras. Es normal.',
      hero_warn_a: 'Como el launcher es gratuito, no está firmado con un certificado de pago, así que Windows muestra «Windows protegió su PC». Haz clic en <em>Más información</em> y después en <em>Ejecutar de todas formas</em>.',
      games_heading: 'Los juegos', games_sub: '2001 – 2011. Diez años de Harry Potter en PC reunidos en un solo launcher. Los ocho juegos ya están disponibles.', games_cta: 'Descargar Accio Launcher',
      game1_title: 'La piedra filosofal',
      game2_title: 'La cámara secreta',
      game3_title: 'El prisionero de Azkaban',
      game4_title: 'El cáliz de fuego',
      game5_title: 'La Orden del Fénix',
      game6_title: 'El misterio del príncipe',
      game7_title: 'Las Reliquias de la Muerte — 1',
      game8_title: 'Las Reliquias de la Muerte — 2',
      preview_heading: 'El launcher', preview_sub: 'Todo funciona desde el primer momento. Elige un juego y a jugar.',
      preview_tab1: 'El catálogo', preview_tab2: 'Juego instalado', preview_tab3: 'Versiones',
      pf1: 'Instalación en un clic; si se corta la conexión, la descarga continúa donde se quedó',
      pf2: 'Español, francés e inglés',
      pf3: 'Cinco temas inspirados en las casas de Hogwarts',
      pf4: 'Tiempo de juego e historial de partidas',
      pf5: 'Repara instalaciones dañadas',
      pf6: 'Se actualiza solo',
      compare_heading: 'Antes / Después', compare_sub: 'Así cambian los gráficos, juego a juego.',
      ctab1: 'HP1 — Pasillos de Hogwarts', ctab2: 'HP5 — Sala común',
      ctab3: 'HP5 — Biblioteca', ctab4: 'HP5 — El castillo',
      ctab5: 'HP6 — La Madriguera', ctab6: 'HP6 — Los terrenos de noche',
      slider_hint: 'Arrastra para comparar',
      community_heading: 'Comunidad',
      community_sub: 'Accio Launcher crece gracias a su comunidad. Tus reportes ayudan a corregir errores, y tus capturas, a que más gente lo descubra.',
      ccard1_t: 'Reporta un error',
      ccard1_d: 'Si un juego no arranca, una descarga se queda a medias o algo se ve raro, abre un reporte en GitHub. Es la forma más rápida de que se arregle, y así les ahorras el mismo problema a los demás.',
      ccard1_cta: 'Abrir un reporte',
      ccard2_t: 'Comparte tus capturas',
      ccard2_d: 'Un pasillo de Hogwarts con buena luz, un duelo en el momento justo, el castillo al atardecer… Si sacas una captura que te guste, compártela en Discord o en GitHub. Las mejores tendrán un lugar destacado.',
      ccard3_t: '¿Tienes una idea?',
      ccard3_d: 'Si crees que al launcher le falta alguna función o hay algo que cambiarías, cuéntalo en GitHub. Ya está en español, francés e inglés, y para añadir otro idioma no hace falta programar: basta con traducir un archivo.',
      ccard3_cta: 'Sugerir', ccard3_cta2: 'Ayudar a traducir',
      faq_heading: 'Preguntas frecuentes',
      faq1_q: '¿Es legal?', faq1_a: 'Accio Launcher es solo una herramienta: no incluye ningún archivo de los juegos. Descarga juegos que llevan años sin venderse y los instala por ti. Se da por hecho que tienes los juegos que instalas, y te corresponde comprobar lo que permite la ley de tu país. El código es público y el proyecto no tiene relación con Warner Bros. ni con Electronic Arts.',
      faq2_q: '¿Es gratis?', faq2_a: 'Sí, completamente. Es de código abierto, no tiene anuncios y no recopila tus datos.',
      faq3_q: '¿Es seguro?', faq3_a: 'El código es público en GitHub. Cada descarga se verifica: si un archivo llega dañado o modificado, se descarta. No hace falta crear una cuenta, no se recopila ningún dato y no hay anuncios.',
      faq4_q: '¿Cómo se ven los gráficos?', faq4_a: 'Full HD (1920×1080), con una imagen más nítida y mejor iluminación, según el juego. Todo viene ya configurado: no tienes que instalar ni ajustar nada más.',
      faq5_q: '¿Están disponibles los 8 juegos?', faq5_a: 'Sí, desde la versión 1.0: desde La piedra filosofal (2001) hasta Las Reliquias de la Muerte — Parte 2 (2011). La colección está completa.',
      faq6_q: '¿Por qué Windows muestra una advertencia?', faq6_a: 'Es normal. El launcher es gratuito y no tiene certificado de firma, que cuesta varios cientos de euros al año, así que Windows muestra «Windows protegió su PC». Haz clic en <em>Más información</em> y después en <em>Ejecutar de todas formas</em>. El archivo se descarga directamente de la página del proyecto en GitHub, el mismo sitio donde está el código.',
      faq7_q: '¿Tengo que reinstalarlo con cada actualización?', faq7_a: 'No. El launcher se actualiza con un solo clic y tus juegos instalados se quedan como están.',
      faq8_q: '¿Qué necesito para jugar?', faq8_a: 'Windows 10 u 11, 8 GB de RAM y una tarjeta gráfica con 2 GB de memoria. Asegúrate de tener espacio para el juego más grande: el launcher comprueba el espacio libre y te avisa antes de descargar.',
      support_heading: 'Apoya el proyecto',
      support_text: 'Lo desarrolla una sola persona en su tiempo libre. Sin anuncios y sin nada que comprar: solo las ganas de devolver la vida a estos juegos.',
      kofi_cta: '☕ Invítame a un café en Ko-fi',
      footer_oss: 'Código fuente en <a href="https://github.com/ludvdber/AccioLauncher" target="_blank" rel="noopener">GitHub</a> — licencia MIT; el ejecutable publicado está bajo GPL v3.',
      fl_launcher: 'El launcher', fl_catalog: 'El catálogo de juegos', fl_issues: 'Reportar un error',
      legal1: 'Accio Launcher es un proyecto comunitario independiente, no afiliado a Warner Bros. Entertainment Inc. ni a Electronic Arts Inc. Harry Potter™ es una marca registrada de Warner Bros. Entertainment Inc. © Wizarding World.',
      legal2: 'Este software se ofrece gratis y tal cual. Cada usuario debe tener legalmente los juegos que instala.',
      page_title: 'Accio Launcher — Todos los juegos de Harry Potter para PC',
      page_desc: 'Los 8 juegos de Harry Potter para PC (2001–2011) en un solo launcher: descarga con un clic, gráficos mejorados y todo ya configurado. Gratis y de código abierto.',
      alt_hp1: 'Portada de Harry Potter y la piedra filosofal (2001)',
      alt_hp2: 'Portada de Harry Potter y la cámara secreta (2002)',
      alt_hp3: 'Portada de Harry Potter y el prisionero de Azkaban (2004)',
      alt_hp4: 'Portada de Harry Potter y el cáliz de fuego (2005)',
      alt_hp5: 'Portada de Harry Potter y la Orden del Fénix (2007)',
      alt_hp6: 'Portada de Harry Potter y el misterio del príncipe (2009)',
      alt_hp7: 'Portada de Harry Potter y las Reliquias de la Muerte — Parte 1 (2010)',
      alt_hp8: 'Portada de Harry Potter y las Reliquias de la Muerte — Parte 2 (2011)',
      alt_launcher: 'Accio Launcher mostrando la ficha de un juego y el carrusel con las ocho portadas',
      alt_before: 'Gráficos originales', alt_after: 'Gráficos mejorados',
      ph_before: 'Antes — Original', ph_after: 'Después — Mejorado',
      aria_music: 'Música', title_music: 'Música ambiental', aria_menu: 'Menú',
      aria_close: 'Cerrar', aria_compare: 'Comparación antes/después', aria_top: 'Volver arriba',
      dl_thanks_title: 'Ya se está descargando. ¡Que lo disfrutes!',
      dl_thanks_star: 'Si te gusta, <a href="https://github.com/ludvdber/AccioLauncher" target="_blank" rel="noopener">dale una estrella en GitHub</a>: así más jugadores lo descubren.',
      ee_main: 'Juro solemnemente que mis intenciones no son buenas.',
      ee_sub: 'Travesura realizada.'
    }
  };

  var currentLang = 'fr';
  var langSwitch = document.getElementById('lang-switch');
  var langBtns = document.querySelectorAll('#lang-switch button[data-lang]');
  var frTexts = {}, frAttrs = {};

  // Save original FR texts
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    frTexts[el.getAttribute('data-i18n')] = el.innerHTML;
  });

  // Certains textes ne sont pas du contenu mais des attributs : la description
  // d'une image, le libelle d'un bouton sans mot. Ils se traduisent aussi, sinon
  // un lecteur d'ecran anglais ou espagnol entend du francais.
  var I18N_ATTRS = { 'data-i18n-alt': 'alt', 'data-i18n-label': 'aria-label', 'data-i18n-title': 'title' };
  var attrRoots = [document];
  if (detailTpl) attrRoots.push(detailTpl.content);
  attrRoots.forEach(function (root) {
    Object.keys(I18N_ATTRS).forEach(function (da) {
      root.querySelectorAll('[' + da + ']').forEach(function (el) {
        frAttrs[el.getAttribute(da)] = el.getAttribute(I18N_ATTRS[da]);
      });
    });
  });

  function applyAttrs(root, lang) {
    Object.keys(I18N_ATTRS).forEach(function (da) {
      root.querySelectorAll('[' + da + ']').forEach(function (el) {
        var key = el.getAttribute(da);
        var val = lang === 'fr' ? frAttrs[key] : (i18n[lang] || {})[key];
        if (val !== undefined && val !== null) el.setAttribute(I18N_ATTRS[da], val);
      });
    });
  }

  var descEl = document.querySelector('meta[name="description"]');
  var frPage = { title: document.title, desc: descEl ? descEl.getAttribute('content') : '' };

  function setLang(lang) {
    if (lang !== 'fr' && !i18n[lang]) lang = 'fr';
    currentLang = lang;
    document.documentElement.lang = lang;
    langBtns.forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    var dict = lang === 'fr' ? frTexts : i18n[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    applyAttrs(document, lang);
    document.title = lang === 'fr' ? frPage.title : (i18n[lang].page_title || frPage.title);
    if (descEl) {
      descEl.setAttribute('content', lang === 'fr' ? frPage.desc : (i18n[lang].page_desc || frPage.desc));
    }
    // Update game detail panel if open
    if (activeGame >= 0 && activeDetail && gameDescs[lang]) {
      var gd = gameDescs[lang][activeGame];
      activeDetail.querySelector('.gcard-detail-year').textContent = gd.y;
      activeDetail.querySelector('.gcard-detail-title').textContent = gd.t;
      activeDetail.querySelector('.gcard-detail-text').textContent = gd.d;
    }
    renderBuild();
    renderDiscord();
    // Re-run typing animation with correct language
    if (typed && lang !== typedLang) {
      typedLang = lang;
      phrase = lang === 'fr' ? frPhrase : i18n[lang].hero_typed;
      if (reduced) { typed.textContent = phrase; } else { startTyping(200); }
    }
  }

  function pickLang(lang) {
    setLang(lang);
    try { localStorage.setItem('accio-lang', lang); } catch (e) {}
    // Sur mobile le selecteur vit dans le menu : le choix fait, on referme.
    if (navLinks && burger && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  }

  langBtns.forEach(function (b) {
    b.addEventListener('click', function () { pickLang(b.getAttribute('data-lang')); });
  });

  // Un groupe radio se parcourt aux fleches, pas a la tabulation : une seule
  // tabulation entre dans le groupe, les fleches choisissent la langue.
  if (langSwitch) {
    langSwitch.addEventListener('keydown', function (e) {
      var list = Array.prototype.slice.call(langBtns);
      var i = list.indexOf(document.activeElement);
      if (i < 0) return;
      var next;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i - 1;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i + 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = list.length - 1;
      else return;
      e.preventDefault();
      next = (next + list.length) % list.length;
      pickLang(list[next].getAttribute('data-lang'));
      list[next].focus();
    });
  }

  // Langue d'ouverture : le choix precedent s'il existe, sinon celle du
  // navigateur si on la parle, sinon le francais.
  var startLang = '';
  try { startLang = localStorage.getItem('accio-lang') || ''; } catch (e) {}
  if (!startLang) {
    var navLang = (navigator.language || '').slice(0, 2).toLowerCase();
    if (navLang === 'en' || navLang === 'es') startLang = navLang;
  }
  if (startLang && startLang !== 'fr') setLang(startLang);

})();
