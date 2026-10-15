// La page de l'atelier. La liste vient du MÊME atelier.json que le launcher,
// lu sur la branche publiée : le site et le launcher ne peuvent pas diverger.
// Tout ce qui vient du fichier passe par textContent, jamais par innerHTML.
(function () {
  'use strict';

  var SOURCE = 'https://raw.githubusercontent.com/ludvdber/AccioLauncher/main/src/data/atelier.json';

  // Le français vit dans le DOM ; ces deux dictionnaires portent le reste.
  var i18n = {
    en: {
      at_titre: 'The workshop',
      at_lead: 'The eight games are more than fifteen years old, and so are their images. The workshop lists what artists can remake: covers, trailers, cards, textures, videos. A piece we use goes into the launcher or the game, with your name on it.',
      at_comment: 'How to take part',
      at_etape1: 'Pick a need from the list below, or suggest your own.',
      at_etape2: 'Say so in the #accio-medias channel on Discord before you start, so two people don’t do the same work.',
      at_etape3: 'Post the finished file there, in the formats given. If it is used, it ships with an update and your name goes in the credits.',
      at_discord: 'Join the Discord',
      at_droits: 'Your rights',
      at_droits1: 'You remain the author of your work. By sending it, you agree that it is published under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">Creative Commons Attribution 4.0</a> licence: the project may use it, adapt it and distribute it, always with your name.',
      at_droits2: 'Only send what you made yourself: no clips from the films, no images taken from elsewhere. The project is free and run by volunteers; contributions are not paid.',
      at_cherche: 'What we need',
      at_charge: 'Loading the list…',
      at_retour: 'Back to the home page',
      at_legal: 'Accio Launcher is an independent community project, not affiliated with Warner Bros. Entertainment Inc. or Electronic Arts Inc. Harry Potter™ is a trademark of Warner Bros. Entertainment Inc.',
      page_title: 'The workshop · Accio Launcher'
    },
    es: {
      at_titre: 'El taller',
      at_lead: 'Los ocho juegos tienen más de quince años, y sus imágenes también. El taller reúne lo que los artistas pueden rehacer: portadas, tráileres, cromos, texturas, vídeos. Una obra elegida entra en el launcher o en el juego, con tu nombre.',
      at_comment: 'Cómo participar',
      at_etape1: 'Elige una necesidad de la lista de abajo, o propón la tuya.',
      at_etape2: 'Avísalo en el canal #accio-medias del Discord antes de empezar, para que dos personas no hagan el mismo trabajo.',
      at_etape3: 'Publica allí el archivo terminado, en los formatos indicados. Si se elige, llega con una actualización y tu nombre aparece en los créditos.',
      at_discord: 'Unirse al Discord',
      at_droits: 'Tus derechos',
      at_droits1: 'Sigues siendo el autor de tu obra. Al enviarla, aceptas que se publique bajo la licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener">Creative Commons Atribución 4.0</a>: el proyecto puede usarla, adaptarla y distribuirla, siempre con tu nombre.',
      at_droits2: 'Envía solo lo que hayas creado tú: nada de fragmentos de las películas ni de imágenes sacadas de otro sitio. El proyecto es gratuito y voluntario; las contribuciones no se pagan.',
      at_cherche: 'Lo que buscamos',
      at_charge: 'Cargando la lista…',
      at_retour: 'Volver al inicio',
      at_legal: 'Accio Launcher es un proyecto comunitario independiente, sin relación con Warner Bros. Entertainment Inc. ni con Electronic Arts Inc. Harry Potter™ es una marca registrada de Warner Bros. Entertainment Inc.',
      page_title: 'El taller · Accio Launcher'
    }
  };

  // Ce que seul le script écrit : aucun équivalent dans le DOM.
  var vif = {
    fr: { cherche: 'Recherché', cours: 'En cours', fait: 'Fait', auto: 'Toutes les jaquettes et tous les fonds des huit jeux.', echec: 'La liste n’a pas pu être chargée. Elle est aussi dans le launcher et sur le Discord.' },
    en: { cherche: 'Wanted', cours: 'In progress', fait: 'Done', auto: 'Every cover and background of the eight games.', echec: 'The list could not be loaded. It is also in the launcher and on Discord.' },
    es: { cherche: 'Se busca', cours: 'En curso', fait: 'Hecho', auto: 'Todas las portadas y fondos de los ocho juegos.', echec: 'No se pudo cargar la lista. También está en el launcher y en el Discord.' }
  };

  var fr = {};
  var elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function (el) { fr[el.getAttribute('data-i18n')] = el.innerHTML; });
  fr.page_title = document.title;

  var langue = 'fr';
  var donnees = null;
  var echec = false;

  function texte(champ) {
    if (!champ) return '';
    return champ[langue] || champ.fr || '';
  }

  function cree(balise, classe, contenu) {
    var el = document.createElement(balise);
    if (classe) el.className = classe;
    if (contenu) el.textContent = contenu;
    return el;
  }

  function rendre() {
    var etat = document.getElementById('atelier-etat');
    var zone = document.getElementById('metiers');
    zone.textContent = '';
    if (echec) {
      etat.hidden = false;
      etat.textContent = vif[langue].echec;
      return;
    }
    if (!donnees) return;
    etat.hidden = true;

    (donnees.metiers || []).forEach(function (m) {
      var carte = cree('article', 'metier');
      var tete = cree('div', 'metier-tete');
      tete.appendChild(cree('h3', '', texte(m.nom)));
      tete.appendChild(cree('span', 'metier-ou', texte(m.ou)));
      carte.appendChild(tete);
      carte.appendChild(cree('p', 'metier-texte', texte(m.texte)));

      var formats = cree('ul', 'metier-formats');
      (m.formats || []).forEach(function (f) { formats.appendChild(cree('li', '', texte(f))); });
      carte.appendChild(formats);

      var besoins = m.besoins || [];
      if (m.auto) {
        carte.appendChild(cree('p', 'metier-auto', vif[langue].auto));
      } else if (besoins.length) {
        var liste = cree('ul', 'besoins');
        besoins.forEach(function (b) {
          var ligne = cree('li', 'besoin');
          ligne.appendChild(cree('span', 'besoin-jeu', b.jeu || ''));
          var quoi = cree('span', 'besoin-quoi', texte(b.quoi));
          if (b.detail) quoi.appendChild(cree('small', '', texte(b.detail)));
          ligne.appendChild(quoi);
          var cle = vif[langue][b.etat] ? b.etat : 'cherche';
          ligne.appendChild(cree('span', 'besoin-etat besoin-etat--' + cle, vif[langue][cle]));
          liste.appendChild(ligne);
        });
        carte.appendChild(liste);
      }
      zone.appendChild(carte);
    });
  }

  function choisir(lang) {
    langue = lang === 'en' || lang === 'es' ? lang : 'fr';
    document.documentElement.lang = langue;
    var dico = langue === 'fr' ? fr : i18n[langue];
    elements.forEach(function (el) {
      var cle = el.getAttribute('data-i18n');
      // Seuls les textes à lien portent du HTML, et il vient de ce fichier.
      if (dico[cle] !== undefined) el.innerHTML = dico[cle];
    });
    document.title = dico.page_title || fr.page_title;
    document.querySelectorAll('#lang-switch button').forEach(function (b) {
      var actif = b.getAttribute('data-lang') === langue;
      b.classList.toggle('is-active', actif);
      b.setAttribute('aria-checked', actif ? 'true' : 'false');
      b.tabIndex = actif ? 0 : -1;
    });
    rendre();
  }

  document.querySelectorAll('#lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      try { localStorage.setItem('accio-lang', lang); } catch (e) {}
      choisir(lang);
    });
  });

  var depart = '';
  try { depart = localStorage.getItem('accio-lang') || ''; } catch (e) {}
  if (!depart) depart = (navigator.language || 'fr').slice(0, 2);
  choisir(depart);

  fetch(SOURCE, { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (json) { donnees = json; rendre(); })
    .catch(function () { echec = true; rendre(); });
})();
