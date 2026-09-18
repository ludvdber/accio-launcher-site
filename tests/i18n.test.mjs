// Le site parle trois langues et le français seul est visible dans le HTML :
// un texte ajouté sans ses traductions ne casse rien à l'écran, il laisse juste
// du français au milieu de l'anglais. C'est exactement ce que ces tests attrapent.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, objetDe, contenuDe, valeursDe, LANGUES } from './lib.mjs';

const i18n = objetDe('i18n');
const gameDescs = objetDe('gameDescs');
const buildWords = objetDe('buildWords');

const contenus = valeursDe(/data-i18n="([^"]+)"/g);
const attributs = valeursDe(/data-i18n-(?:alt|label|title)="([^"]+)"/g);
const horsDom = ['page_title', 'page_desc', 'hero_typed'];
const attendues = [...contenus, ...attributs, ...horsDom];

test('le HTML porte bien des textes à traduire', () => {
  assert.ok(contenus.length > 50, `seulement ${contenus.length} textes trouvés`);
  assert.ok(attributs.length > 10, `seulement ${attributs.length} attributs trouvés`);
});

for (const langue of LANGUES) {
  test(`${langue} : aucune traduction manquante`, () => {
    const manquantes = attendues.filter((c) => i18n[langue][c] === undefined);
    assert.deepEqual(manquantes, [], `clés absentes du dictionnaire ${langue}`);
  });

  test(`${langue} : aucune traduction vide`, () => {
    const vides = attendues.filter((c) => !String(i18n[langue][c] ?? '').trim());
    assert.deepEqual(vides, [], `clés vides dans le dictionnaire ${langue}`);
  });

  test(`${langue} : aucune clé orpheline`, () => {
    const orphelines = Object.keys(i18n[langue]).filter((c) => !attendues.includes(c));
    assert.deepEqual(orphelines, [], `clés que plus aucun élément n'utilise (${langue})`);
  });

  test(`${langue} : les liens survivent à la traduction`, () => {
    const casses = [];
    for (const cle of contenus) {
      const source = contenuDe('data-i18n', cle);
      if (source === null) continue;
      const liens = (t) => [...t.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).sort();
      const attendus = liens(source).join(' | ');
      const obtenus = liens(String(i18n[langue][cle])).join(' | ');
      if (attendus !== obtenus) casses.push(`${cle} : "${obtenus}" au lieu de "${attendus}"`);
    }
    assert.deepEqual(casses, [], 'un lien a disparu ou changé dans une traduction');
  });

  test(`${langue} : la mise en forme interne est conservée`, () => {
    const ecarts = [];
    for (const cle of contenus) {
      const source = contenuDe('data-i18n', cle);
      if (source === null) continue;
      const balises = (t) => (t.match(/<[a-zA-Z]/g) || []).length;
      const attendu = balises(source);
      const obtenu = balises(String(i18n[langue][cle]));
      if (attendu !== obtenu) ecarts.push(`${cle} : ${obtenu} balise(s) contre ${attendu} en français`);
    }
    assert.deepEqual(ecarts, [], 'un <em> ou un <a> manque dans une traduction');
  });
}

test('les 8 fiches de jeu existent dans les trois langues', () => {
  for (const langue of ['fr', ...LANGUES]) {
    const fiches = gameDescs[langue];
    assert.ok(Array.isArray(fiches), `gameDescs.${langue} absent`);
    assert.equal(fiches.length, 8, `gameDescs.${langue} : ${fiches.length} fiches au lieu de 8`);
    fiches.forEach((fiche, i) => {
      for (const champ of ['y', 't', 'd']) {
        assert.ok(String(fiche[champ] ?? '').trim(), `gameDescs.${langue}[${i}].${champ} vide`);
      }
    });
  }
});

test('la ligne sous le bouton est complète dans les trois langues', () => {
  for (const langue of ['fr', ...LANGUES]) {
    const mots = buildWords[langue];
    assert.ok(mots, `buildWords.${langue} absent`);
    for (const champ of ['os', 'oss', 'notes']) {
      assert.ok(String(mots[champ] ?? '').trim(), `buildWords.${langue}.${champ} vide`);
    }
  }
});

test('les textes remplis par le JavaScript ne portent pas data-i18n', () => {
  // setLang écraserait ce que renderBuild() et renderDiscord() viennent d'écrire.
  for (const id of ['dl-build', 'community-live']) {
    const balise = html.match(new RegExp(`<[^>]*id="${id}"[^>]*>`));
    assert.ok(balise, `élément #${id} introuvable`);
    assert.ok(!balise[0].includes('data-i18n='), `#${id} ne doit pas porter data-i18n`);
  }
});
