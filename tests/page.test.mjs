// Ce qui casse une page statique sans qu'on s'en aperçoive : une image renommée,
// une ancre qui ne mène nulle part, un identifiant en double, une accolade oubliée.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { html, css, RACINE, valeursDe } from './lib.mjs';

const estLocal = (chemin) =>
  chemin &&
  !/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(chemin) &&
  !chemin.startsWith('/');

test('chaque fichier référencé par le HTML existe', () => {
  const refs = [
    ...valeursDe(/(?:src|href|poster)="([^"]+)"/g),
    ...valeursDe(/data-(?:src|before|after)="([^"]+)"/g),
  ].filter(estLocal);

  assert.ok(refs.length > 10, `seulement ${refs.length} références trouvées`);
  const absents = refs.filter((r) => !existsSync(join(RACINE, r)));
  assert.deepEqual(absents, [], 'fichiers référencés mais absents du dépôt');
});

test('chaque fichier référencé par le CSS existe', () => {
  const refs = valeursDe(/url\(['"]?([^'")]+)['"]?\)/g, css)
    .filter(estLocal)
    .map((r) => r.replace(/^\.\.\//, ''));

  const absents = refs.filter((r) => !existsSync(join(RACINE, r)));
  assert.deepEqual(absents, [], 'fichiers référencés par la feuille de style mais absents');
});

test('aucun identifiant en double', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const doublons = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual([...new Set(doublons)], [], 'identifiants présents plusieurs fois');
});

test('chaque ancre interne mène quelque part', () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const ancres = valeursDe(/href="#([^"]+)"/g).filter((a) => a !== 'top' || !ids.has('top'));
  const perdues = ancres.filter((a) => !ids.has(a));
  assert.deepEqual(perdues, [], 'liens de navigation vers une section inexistante');
});

test('chaque image porte un texte alternatif', () => {
  const sansAlt = [...html.matchAll(/<img\s[^>]*>/g)]
    .map((m) => m[0])
    .filter((balise) => !/\salt="/.test(balise));
  assert.deepEqual(sansAlt, [], 'images sans attribut alt');
});

test('les images lourdes sont chargées à la demande', () => {
  // Une image sous la ligne de flottaison qui part au chargement, c'est du poids
  // dépensé pour rien sur la première visite.
  const pressees = [...html.matchAll(/<img\s[^>]*>/g)]
    .map((m) => m[0])
    .filter((b) => /src="assets\/(covers|compare|screenshots)\//.test(b))
    .filter((b) => !/loading="lazy"/.test(b));
  assert.deepEqual(pressees, [], 'images de contenu sans loading="lazy"');
});

test('le JavaScript est syntaxiquement valide', () => {
  execFileSync(process.execPath, ['--check', join(RACINE, 'js/main.js')]);
});

test('les données structurées sont du JSON valide', () => {
  const bloc = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(bloc, 'bloc application/ld+json introuvable');
  const donnees = JSON.parse(bloc[1]);
  assert.equal(donnees['@type'], 'SoftwareApplication');
  assert.deepEqual(donnees.inLanguage, ['fr', 'en', 'es']);
  // La version est remplie depuis l'API : la figer ici, c'est mentir à Google
  // à la sortie suivante.
  assert.equal(donnees.softwareVersion, undefined, 'softwareVersion ne doit pas être écrit en dur');
});

test('les boutons de téléchargement visent le fichier, pas la page', () => {
  // GitHub résout « latest » tout seul, mais seulement si le nom du fichier ne
  // bouge pas : renommé, l'exécutable fait tomber les boutons en 404 silencieux.
  const attendu = 'https://github.com/ludvdber/AccioLauncher/releases/latest/download/AccioLauncher.exe';
  const boutons = [...html.matchAll(/href="([^"]*releases\/latest\/download\/[^"]*)"/g)].map((m) => m[1]);
  assert.ok(boutons.length >= 3, `${boutons.length} bouton(s) de téléchargement trouvé(s)`);
  for (const lien of boutons) {
    assert.equal(lien, attendu, 'le nom du fichier doit rester exactement AccioLauncher.exe');
  }

  const ld = html.match(/"downloadUrl":\s*"([^"]+)"/);
  assert.equal(ld?.[1], attendu, 'les données structurées doivent pointer au même endroit');
});

test('la page se déclare en français au départ', () => {
  assert.match(html, /<html lang="fr"/, 'le JavaScript change ensuite lang selon le visiteur');
});
