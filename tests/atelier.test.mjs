// La page de l'atelier : ses textes existent dans les trois langues, et l'accueil y mène.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, lire, objetDe, valeursDe, LANGUES } from './lib.mjs';

const page = lire('atelier.html');
const script = lire('js/atelier.js');

test('chaque texte de l’atelier est traduit en anglais et en espagnol', () => {
  const cles = valeursDe(/data-i18n="([^"]+)"/g, page);
  assert.ok(cles.length > 10, `seulement ${cles.length} clés`);
  const dicos = objetDe('i18n', script);
  for (const langue of LANGUES) {
    const manquantes = cles.filter((c) => !(c in dicos[langue]));
    assert.deepEqual(manquantes, [], `clés absentes en ${langue}`);
  }
});

test('les états du launcher ont tous un libellé', () => {
  const vif = objetDe('vif', script);
  for (const langue of ['fr', ...LANGUES]) {
    for (const cle of ['cherche', 'cours', 'fait', 'auto', 'echec']) {
      assert.ok(vif[langue][cle], `${langue}.${cle} manquant`);
    }
  }
});

test('l’atelier lit le fichier du launcher et n’écrit le JSON que par textContent', () => {
  assert.match(script, /AccioLauncher\/main\/src\/data\/atelier\.json/);
  const rendu = script.slice(script.indexOf('function rendre'), script.indexOf('function choisir'));
  assert.ok(rendu.length > 200, 'fonction rendre introuvable');
  assert.doesNotMatch(rendu, /innerHTML/);
});

test('l’accueil mène à l’atelier', () => {
  assert.match(html, /href="atelier\.html"/);
});
