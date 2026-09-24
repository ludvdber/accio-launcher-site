// Le seul truc qui peut casser sans qu'on touche au site : les fichiers visés par
// les boutons de téléchargement (Windows et Linux). GitHub résout « latest » tout
// seul, mais si un fichier change de nom dans une sortie, ses boutons tombent en
// 404 sans que rien ne prévienne. Ce script tourne tout seul une fois par semaine.
import { lire } from './lib.mjs';

const html = lire('index.html');
const liens = [...html.matchAll(/href="(https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/latest\/download\/([^"]+))"/g)];

if (!liens.length) {
  console.error('Aucun bouton de téléchargement trouvé dans index.html.');
  process.exit(1);
}

const [, , proprietaire, depot] = liens[0];
// Un même fichier est proposé par plusieurs boutons : on le vérifie une fois.
const cibles = [...new Map(liens.map(([, url, , , fichier]) => [url, fichier])).entries()];
const entetes = { 'user-agent': 'accio-launcher-site-check' };
if (process.env.GITHUB_TOKEN) entetes.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

for (const [url] of cibles) console.log(`Le site pointe sur : ${url}`);

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

let echec = false;
for (const [url, fichier] of cibles) {
  if (!noms.includes(fichier)) {
    console.error('');
    console.error(`ÉCHEC — la sortie ${derniere.tag_name} ne contient pas « ${fichier} ».`);
    console.error('Les boutons de téléchargement qui le visent renvoient donc une page 404.');
    console.error(`Renomme le fichier en « ${fichier} » dans la sortie, ou change le lien dans index.html.`);
    echec = true;
    continue;
  }
  // Le nom est bon : on s'assure que le raccourci « latest » se résout vraiment.
  const tete = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  if (!tete.ok) {
    console.error('');
    console.error(`ÉCHEC — le lien vers « ${fichier} » répond ${tete.status} alors que le fichier existe.`);
    echec = true;
    continue;
  }
  console.log(`OK — « ${fichier} » est bien publié et le lien répond.`);
}
if (echec) process.exit(1);
