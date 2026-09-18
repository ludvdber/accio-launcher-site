// Le seul truc qui peut casser sans qu'on touche au site : le fichier visé par
// les boutons de téléchargement. GitHub résout « latest » tout seul, mais si
// l'exécutable change de nom dans une sortie, les boutons tombent en 404 sans
// que rien ne prévienne. Ce script tourne tout seul une fois par semaine.
import { lire } from './lib.mjs';

const html = lire('index.html');
const lien = html.match(/href="(https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/latest\/download\/([^"]+))"/);

if (!lien) {
  console.error('Aucun bouton de téléchargement trouvé dans index.html.');
  process.exit(1);
}

const [, url, proprietaire, depot, fichier] = lien;
const entetes = { 'user-agent': 'accio-launcher-site-check' };
if (process.env.GITHUB_TOKEN) entetes.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

console.log(`Le site pointe sur : ${url}`);

const reponse = await fetch(
  `https://api.github.com/repos/${proprietaire}/${depot}/releases?per_page=20`,
  { headers: entetes },
);

if (!reponse.ok) {
  console.error(`L'API GitHub a répondu ${reponse.status}. Vérification impossible.`);
  process.exit(1);
}

const sorties = await reponse.json();
const derniere = sorties.find((s) => !s.prerelease && !s.draft) ?? sorties[0];

if (!derniere) {
  console.error(`Aucune sortie publiée sur ${proprietaire}/${depot}.`);
  process.exit(1);
}

const noms = derniere.assets.map((a) => a.name);
console.log(`Dernière sortie : ${derniere.tag_name}`);
console.log(`Fichiers publiés : ${noms.join(', ') || '(aucun)'}`);

if (!noms.includes(fichier)) {
  console.error('');
  console.error(`ÉCHEC — la sortie ${derniere.tag_name} ne contient pas « ${fichier} ».`);
  console.error('Les boutons de téléchargement du site renvoient donc une page 404.');
  console.error(`Renomme le fichier en « ${fichier} » dans la sortie, ou change le lien dans index.html.`);
  process.exit(1);
}

// Le nom est bon : on s'assure que le raccourci « latest » se résout vraiment.
const tete = await fetch(url, { method: 'HEAD', redirect: 'follow' });
if (!tete.ok) {
  console.error('');
  console.error(`ÉCHEC — le lien répond ${tete.status} alors que le fichier existe.`);
  process.exit(1);
}

console.log('');
console.log(`OK — « ${fichier} » est bien publié et le lien répond.`);
