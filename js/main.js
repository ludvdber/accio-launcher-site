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
      { y:'2002', t:'La Chambre des secrets', d:'Retournez à Poudlard pour une deuxième année encore plus riche. Le château est désormais un véritable monde ouvert à explorer librement entre les cours. Nouveaux sortilèges, duels de sorciers, matchs de Quidditch jouables et un bestiaire élargi avec les Elfes de maison, les Aragogs et le Basilic. Le jeu qui a défini ce que pouvait être un monde Harry Potter interactif.' },
      { y:'2004', t:'Le Prisonnier d\'Azkaban', d:'Pour la première fois, jouez trois personnages : Harry, Ron et Hermione. Chacun possède des capacités uniques indispensables pour résoudre les énigmes. Harry lance Expecto Patronum, Hermione se faufile avec Croûtard, Ron utilise sa force. Le gameplay coopératif donne une vraie profondeur à l\'exploration de Poudlard et de ses environs, de la Cabane Hurlante à la Forêt Interdite.' },
      { y:'2005', t:'La Coupe de feu', d:'Le Tournoi des Trois Sorciers en coopération jusqu\'à 3 joueurs. Affrontez le Magyar à pointes, plongez dans le Lac Noir et parcourez le labyrinthe du Tournoi. Le jeu mise sur l\'action et le travail d\'équipe : lancez des sorts combinés, protégez vos alliés et adaptez votre stratégie à chaque épreuve. Un gameplay nerveux qui change radicalement du reste de la série.' },
      { y:'2007', t:'L\'Ordre du Phénix', d:'Poudlard en monde ouvert comme jamais auparavant. Chaque couloir, chaque salle, chaque passage secret est modélisé et explorable librement. Recrutez les membres de l\'Armée de Dumbledore, apprenez de nouveaux sorts avec la baguette contrôlée au stick analogique, et affrontez Ombrage et les Mangemorts. La représentation la plus fidèle et la plus ambitieuse du château jamais créée dans un jeu vidéo.' },
      { y:'2009', t:'Le Prince de sang-mêlé', d:'Trois piliers de gameplay : les duels de sorciers en temps réel, la préparation de potions et l\'exploration libre de Poudlard. Le château s\'est encore enrichi avec de nouvelles zones et des missions secondaires. Affrontez des adversaires de plus en plus redoutables en duel, maîtrisez l\'art subtil des potions du Prince de Sang-Mêlé, et découvrez les secrets les plus sombres de l\'école.' },
      { y:'2010', t:'Les Reliques de la Mort — Partie 1', d:'Rupture totale avec les épisodes précédents. Fini l\'exploration de Poudlard : place à un jeu d\'action à la troisième personne où Harry, Ron et Hermione fuient les Mangemorts à travers l\'Angleterre. Système de couverture, sorts offensifs variés et missions d\'infiltration. Du Ministère de la Magie à la forêt de Dean, la chasse aux Horcruxes commence.' },
      { y:'2011', t:'Les Reliques de la Mort — Partie 2', d:'La Bataille de Poudlard. Le dernier jeu de la série concentre toute son action sur l\'affrontement final. Incarnez Harry, mais aussi Hermione, Ron, Ginny, Seamus, Neville et même le Professeur McGonagall dans des missions variées. Défendez le château salle par salle, détruisez les derniers Horcruxes et affrontez Voldemort dans un duel ultime.' }
    ],
    en: [
      { y:'2001', t:"Philosopher's Stone", d:"A 3D action-adventure game where you play as Harry during his first year at Hogwarts. Learn spells like Flipendo and Lumos, explore the castle and its grounds, collect Bertie Bott's Every Flavour Beans and Famous Witches and Wizards cards. From broomstick flying lessons to the underground chambers, relive the adventure that introduced an entire generation to Hogwarts." },
      { y:'2002', t:'Chamber of Secrets', d:'Return to Hogwarts for an even richer second year. The castle is now a true open world to explore freely between classes. New spells, wizard duels, playable Quidditch matches, and an expanded bestiary featuring House-Elves, Aragog, and the Basilisk. The game that defined what an interactive Harry Potter world could be.' },
      { y:'2004', t:'Prisoner of Azkaban', d:"For the first time, play as three characters: Harry, Ron, and Hermione. Each has unique abilities essential for solving puzzles. Harry casts Expecto Patronum, Hermione sneaks with Scabbers, Ron uses his strength. The cooperative gameplay adds real depth to exploring Hogwarts and its surroundings, from the Shrieking Shack to the Forbidden Forest." },
      { y:'2005', t:'Goblet of Fire', d:"The Triwizard Tournament in co-op for up to 3 players. Face the Hungarian Horntail, dive into the Black Lake, and navigate the Tournament maze. The game focuses on action and teamwork: cast combined spells, protect your allies, and adapt your strategy to each challenge. A fast-paced gameplay that radically differs from the rest of the series." },
      { y:'2007', t:'Order of the Phoenix', d:"Hogwarts in open-world like never before. Every corridor, every room, every secret passage is modeled and freely explorable. Recruit members of Dumbledore's Army, learn new spells with analogue stick wand control, and face Umbridge and the Death Eaters. The most faithful and ambitious representation of the castle ever created in a video game." },
      { y:'2009', t:'Half-Blood Prince', d:"Three gameplay pillars: real-time wizard duels, potion brewing, and free exploration of Hogwarts. The castle has been further enriched with new areas and side missions. Face increasingly formidable opponents in duels, master the subtle art of the Half-Blood Prince's potions, and uncover the school's darkest secrets." },
      { y:'2010', t:'Deathly Hallows — Part 1', d:"A total break from previous entries. No more Hogwarts exploration: this is a third-person action game where Harry, Ron, and Hermione flee the Death Eaters across England. Cover system, varied offensive spells, and stealth missions. From the Ministry of Magic to the Forest of Dean, the hunt for Horcruxes begins." },
      { y:'2011', t:'Deathly Hallows — Part 2', d:"The Battle of Hogwarts. The final game in the series focuses all its action on the ultimate confrontation. Play as Harry, but also Hermione, Ron, Ginny, Seamus, Neville, and even Professor McGonagall in varied missions. Defend the castle room by room, destroy the last Horcruxes, and face Voldemort in one final duel." }
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
  var latestTag = '', latestSize = 0;

  // Version et poids reels sous le bouton. Sans reponse de l'API, la ligne garde
  // son texte de repli ecrit dans le HTML : elle ne doit jamais rester vide.
  function renderBuild() {
    if (!buildEl) return;
    var en = currentLang === 'en';
    var parts = [];
    if (latestTag) parts.push('Version ' + latestTag.replace(/^v/, ''));
    if (latestSize) parts.push(Math.round(latestSize / 1048576) + (en ? ' MB' : ' Mo'));
    parts.push(en ? 'Windows 10 and 11' : 'Windows 10 et 11');
    buildEl.textContent = parts.join(' · ');
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
        var exe = latest.assets.filter(function (a) { return /\.exe$/i.test(a.name); })[0];
        latestSize = exe ? exe.size : 0;
        renderBuild();
      }
      if (latest && verEl) {
        var vTxt = 'Accio Launcher ' + latest.tag_name;
        if (latest.published_at) {
          var d = new Date(latest.published_at);
          var months = currentLang === 'en'
            ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            : ['jan.','fév.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
          vTxt += ' — ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
        }
        verEl.textContent = vTxt;
      }
    })
    .catch(function () {});

  /* --- Discord : nombre de membres, en direct ---
     L'API publique des invitations repond sans cle et autorise l'appel depuis le
     navigateur. Si elle ne repond pas, la ligne reste masquee : pas de trou. */
  var liveEl = document.getElementById('community-live');
  var dMembers = 0, dOnline = 0;

  function renderDiscord() {
    if (!liveEl || !dMembers) return;
    liveEl.innerHTML = currentLang === 'en'
      ? 'The Discord has <b>' + dMembers + '</b> members, <b>' + dOnline + '</b> of them online right now.'
      : 'Le Discord compte <b>' + dMembers + '</b> membres, dont <b>' + dOnline + '</b> en ligne en ce moment.';
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
  var ti = 0;
  function typeNext() {
    if (typed && ti < phrase.length) {
      typed.textContent += phrase[ti];
      ti++;
      setTimeout(typeNext, 35 + Math.random() * 25);
    } else if (typed) {
      typed.classList.add('typed-done');
    }
  }
  if (typed) {
    if (reduced) {
      typed.classList.add('typed-done');
    } else {
      typed.textContent = '';
      setTimeout(typeNext, 800);
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
      hero_cta: 'Download — Free', hero_downloads: 'downloads',
      hero_all_games: 'All 8 games available',
      hero_typed: 'Relive all 8 Harry Potter PC games with modern graphics.',
      hero_notes: 'Release notes',
      hero_warn_q: 'Windows will show a warning the first time — that is expected.',
      hero_warn_a: 'The launcher is free and is not signed with a paid certificate, so Windows shows “Windows protected your PC”. Click <em>More info</em>, then <em>Run anyway</em>.',
      games_heading: 'The Games', games_sub: '2001 – 2011. Ten years of Harry Potter PC games, united in a single launcher. All eight are online and playable.', games_cta: 'Download Accio Launcher',
      game1_title: "Philosopher's Stone",
      game2_title: 'Chamber of Secrets',
      game3_title: 'Prisoner of Azkaban',
      game4_title: 'Goblet of Fire',
      game5_title: 'Order of the Phoenix',
      game6_title: 'Half-Blood Prince',
      game7_title: 'Deathly Hallows — 1',
      game8_title: 'Deathly Hallows — 2',
      preview_heading: 'The Launcher', preview_sub: 'Everything is ready from the first launch. Pick a game, click, play.',
      preview_tab1: 'The catalogue', preview_tab2: 'Installed game', preview_tab3: 'Versions',
      pf1: 'One-click download, resumes after a drop',
      pf2: 'French, English, Spanish',
      pf3: 'Five Hogwarts house themes',
      pf4: 'Playtime and session history',
      pf5: 'Repairs a damaged installation',
      pf6: 'Updates itself',
      compare_heading: 'Before / After', compare_sub: 'The impact of graphic enhancements on Harry Potter games.',
      ctab1: 'HP1 — Hogwarts corridors', ctab2: 'HP5 — Common room',
      ctab3: 'HP5 — Library', ctab4: 'HP5 — The castle',
      slider_hint: 'Drag to compare',
      community_heading: 'The community',
      community_sub: "The launcher moves forward with the people who play it. A bug reported is a bug fixed — and a good screenshot is the project's best showcase.",
      ccard1_t: 'Report a bug',
      ccard1_d: "A game that won't start, a download that stalls, something drawn wrong? Open an issue on GitHub. It's the shortest path to a fix — and it saves ten other people the same lost evening.",
      ccard1_cta: 'Open an issue',
      ccard2_t: 'Share your screenshots',
      ccard2_d: 'A Hogwarts corridor in the right light, a duel caught at the right moment, the castle at sunset: show them off. On Discord or on GitHub — the best ones get featured.',
      ccard3_t: 'Suggest an idea',
      ccard3_d: 'Something missing, something that annoys you? Say so. The launcher speaks French, English and Spanish, and adding a language takes no code at all — just a translation file.',
      ccard3_cta: 'Suggest', ccard3_cta2: 'Translate',
      faq_heading: 'FAQ',
      faq1_q: 'Is it legal?', faq1_a: 'Accio Launcher is a tool: it contains no game files. It downloads archives of games that have not been sold for years and installs them for you. You are expected to own the games you install, and making sure of that under your own country’s rules is up to you. The code is public, and the project is affiliated with neither Warner Bros. nor Electronic Arts.',
      faq2_q: 'Is it free?', faq2_a: 'Yes, entirely. Open-source, no ads, no tracking.',
      faq3_q: 'Is it safe?', faq3_a: 'The code is public on GitHub. Every archive is checked against its fingerprint while it downloads: a file damaged or altered on the way is rejected. No account, no data collected, no ads.',
      faq4_q: 'What graphic quality?', faq4_a: '1920×1080, with a cleaner image and reworked lighting depending on the game. Everything is pre-configured: nothing to install or tweak on the side.',
      faq5_q: 'Are all 8 games available?', faq5_a: "Yes, since version 1.0: from the Philosopher's Stone (2001) to Deathly Hallows Part 2 (2011). The catalogue is complete.",
      faq6_q: 'Windows shows a warning?', faq6_a: '“Windows protected your PC” is expected: the launcher is free and has no code-signing certificate, which costs several hundred euros a year. Click <em>More info</em>, then <em>Run anyway</em>. The file comes straight from GitHub, published by the project’s own repository — the same source as the code.',
      faq7_q: 'Reinstall it for every version?', faq7_a: 'No. The launcher updates itself in one click, and games already installed stay where they are.',
      faq8_q: 'What do I need?', faq8_a: 'Windows 10 or 11, 8 GB of memory, 2 GB of video memory. Leave room for the largest game: the launcher checks free space and warns you before downloading.',
      support_heading: 'Support the project',
      support_text: 'Developed by a single passionate developer, in their spare time. No ads, no monetization — just the desire to bring these games back to life.',
      kofi_cta: '☕ Buy a coffee on Ko-fi',
      footer_oss: 'Source code on <a href="https://github.com/ludvdber/AccioLauncher" target="_blank" rel="noopener">GitHub</a> — MIT licence; the distributed executable is GPL v3.',
      fl_launcher: 'The launcher', fl_catalog: 'The game catalogue', fl_issues: 'Report a bug',
      legal1: 'Accio Launcher is an independent community project, not affiliated with Warner Bros. Entertainment Inc. or Electronic Arts Inc. Harry Potter™ is a registered trademark of Warner Bros. Entertainment Inc. © Wizarding World.',
      legal2: 'This software is provided free of charge, as-is. Games must be legally owned by the user.',
      ee_main: 'I solemnly swear that I am up to no good.',
      ee_sub: 'Mischief managed.'
    }
  };

  var currentLang = 'fr';
  var langBtn = document.getElementById('lang-toggle');
  var frTexts = {};

  // Save original FR texts
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    frTexts[el.getAttribute('data-i18n')] = el.innerHTML;
  });

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';
    if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    var dict = lang === 'fr' ? frTexts : i18n.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
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
      phrase = lang === 'en' ? i18n.en.hero_typed : frPhrase;
      if (reduced) {
        typed.textContent = phrase;
      } else {
        typed.textContent = '';
        typed.classList.remove('typed-done');
        ti = 0;
        setTimeout(typeNext, 200);
      }
    }
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setLang(currentLang === 'fr' ? 'en' : 'fr');
    });
  }

})();
