// Outils communs aux tests. Le site n'a aucune dépendance et les tests non plus :
// tout se lit avec Node seul, rien à installer.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');

export const lire = (chemin) => readFileSync(join(RACINE, chemin), 'utf8');

export const html = lire('index.html');
export const css = lire('css/styles.css');
export const js = lire('js/main.js');

/**
 * Extrait un objet littéral de main.js par son nom et le renvoie évalué.
 * Le fichier est une IIFE qui touche au DOM : on ne peut pas l'exécuter,
 * seulement en découper les dictionnaires.
 */
export function objetDe(nom, source = js) {
  const debut = source.indexOf(`var ${nom} = {`);
  if (debut < 0) throw new Error(`objet introuvable dans js/main.js : ${nom}`);
  let i = source.indexOf('{', debut);
  let profondeur = 0;
  for (let k = i; k < source.length; k++) {
    if (source[k] === '{') profondeur++;
    else if (source[k] === '}') {
      profondeur--;
      if (profondeur === 0) return eval(`(${source.slice(i, k + 1)})`);
    }
  }
  throw new Error(`accolade jamais refermée pour ${nom}`);
}

/**
 * Contenu d'un élément repéré par un de ses attributs, balises imbriquées
 * comprises. Sert à comparer un texte français du HTML à sa traduction.
 */
export function contenuDe(attribut, valeur, source = html) {
  const ancre = source.indexOf(`${attribut}="${valeur}"`);
  if (ancre < 0) return null;
  const ouverture = source.lastIndexOf('<', ancre);
  const balise = source.slice(ouverture + 1).match(/^[a-zA-Z0-9]+/)[0];
  const debut = source.indexOf('>', ancre) + 1;

  const jetons = new RegExp(`</?${balise}[\\s>/]`, 'g');
  jetons.lastIndex = debut;
  let profondeur = 1, m;
  while ((m = jetons.exec(source))) {
    profondeur += m[0][1] === '/' ? -1 : 1;
    if (profondeur === 0) return source.slice(debut, m.index);
  }
  throw new Error(`élément jamais refermé : ${attribut}="${valeur}"`);
}

/** Toutes les valeurs distinctes d'un attribut dans le HTML. */
export const valeursDe = (motif, source = html) =>
  [...new Set([...source.matchAll(motif)].map((m) => m[1]))];

export const LANGUES = ['en', 'es'];
