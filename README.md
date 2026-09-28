# Freedom Taxi — Taxi parisien & taxi conventionné

Site vitrine + formulaire de réservation avec **envoi réel d'e-mails**.

- **Zone desservie :** Paris / Seine-Saint-Denis et alentours
- **Téléphones :** 07 61 13 56 73
- **Stack :** React 18 + Vite 6 + TailwindCSS + Express + Nodemailer

---

## Démarrage rapide

```bash
npm install
npm run dev        # http://localhost:5175
```

## Commandes disponibles

| Commande            | Rôle                                                        |
|---------------------|-------------------------------------------------------------|
| `npm run dev`       | Serveur de développement Vite (API de réservation incluse)   |
| `npm run build`     | Génère le dossier `dist/`                                    |
| `npm start`         | Serveur de production (sert `dist/` + l'API)                |
| `npm run serve`     | `build` puis `start`                                        |
| `npm run preview`   | Prévisualisation du build statique                          |
| `npm run images`    | (Re)génère les dérivés WebP de `public/images`              |
| `npm run images:plates` | Remplace les caractères des plaques par la marque |
| `npm run qa`        | Contrôle responsive + erreurs console (URL, largeur, hauteur)|
| `npm run qa:gallery`| Contrôle de la galerie véhicule + visionneuse              |

---

## Documentation

| Fichier | Contenu |
|---|---|
| `DEPLOYMENT.md` | Installation, build, mise en production, GitHub, hébergement, Supabase |
| `SECURITY.md` | Règles sur les secrets, en-têtes, rate limiting, données privées |
| `ASSET_LICENSES.md` | Provenance et licence de chaque image et police |
| `PRODUCTION_CHECKLIST.md` | Tout ce qu'il reste à vérifier avant la mise en ligne |

## Pages légales

Quatre pages statiques, servies en plus du site (qui est une application React) :

| URL | Contenu |
|---|---|
| `/mentions-legales` | Éditeur, hébergeur, direction de publication, propriété intellectuelle |
| `/politique-confidentialite` | Données collectées, finalités, durées, droits RGPD |
| `/cookies` | Le site n'utilise aucun cookie traceur |
| `/conditions-reservation` | Demande ≠ réservation confirmée, annulation, médiation |

> ⚠️ Elles contiennent des mentions `[À COMPLÉTER PAR LE CLIENT]` : ce sont des
> informations que **seul l'exploitant peut fournir** (hébergeur, médiateur de
> la consommation, tarifs, durée de conservation). Elles doivent être
> renseignées avant la mise en ligne — voir `PRODUCTION_CHECKLIST.md`.

---

## 🖼️ Les photos du site

Toutes les images affichées proviennent de `public/images`. La seule
transformation appliquée est le remplacement des caractères de la plaque
d'immatriculation par le nom de la marque (voir « Plaques d'immatriculation »
ci-dessous) ; les originaux intacts sont conservés dans `originals-images/`,
hors de `public/`, et ne sont jamais publiés.

| Fichier            | Dimensions | Section du site                        |
|--------------------|------------|----------------------------------------|
| `freedom-taxi-hero.jpeg` | 1600×900 | Image principale (Hero)             |
| `photo1.jpeg`      | 900×1600   | Galerie « Decouvrez notre vehicule »  |
| `photo2.jpeg`      | 900×1600   | Galerie « Decouvrez notre vehicule »  |
| `photo3.jpeg`      | 900×1600   | Galerie « Decouvrez notre vehicule »  |
| `hopital-clinique.jpg` | 1672×941 | Taxi conventionné (`#medical`)      |
| `aéroport.jpg`     | 1672×941   | Transferts & aéroports (`#aeroport`)   |
| `reservation.jpg`  | 1672×941   | Réservation (`#reservation`)           |
| `Paris.jpg`        | 1672×941   | Périmètre d'intervention               |

### Optimisation

Les quatre photos de service étaient des **PNG de 2,3 à 2,5 Mo** chacune
(≈ 9,6 Mo au total), sans autre usage que celui de l'affichage. Elles ont été
converties en **JPEG** : le format est exactement fait pour de la photographie,
et non pour de l'illustration avec aplats. Le gain est immédiat, sans perte
visible.

`npm run images` crée en plus, pour chaque image, un dérivé **WebP** (qualité
80) ; le site sert le WebP via `<picture>` et garde le JPEG en repli.

Résultat : le dossier `dist/` est passé de **19,2 Mo à 4,8 Mo** après build
(−75 %), et le poids total d'une page de **5 078 Ko à 4 400 Ko**.

> Les fichiers `photo*.jpeg` et `freedom-taxi-hero.jpeg` étaient **déjà** au
> format JPEG : ils n'ont pas été reconvertis. Seuls les quatre PNG ont changé
> d'extension.
(résolution naturelle conservée).

Pour refaire les dérivés après avoir remplacé/ajouté une photo :

```bash
npm run images
```

### Plaques d'immatriculation

Les huit photos ci-dessus montrent la même voiture, dont **les plaques
d'immatriculation étaient lisibles** (numéro à 7 caractères, plus lisible encore
sur la Peugeot noire garée à gauche de `photo1.jpeg`).

`npm run images:plates` ne floute pas les plaques : il **remplace leurs
caractères par le nom de la marque**, comme sur les plaques advertising des taxis
parisiens. Sept lettres, sept caractères : la plaque garde son format.

Pour que la plaque passe pour une vraie plaque photographiée et pas pour une
étiquette collée sur la photo :

- **le fond est échantillonné sur la photo** (deux bandes au centre de la
  plaque) et reappliqué en dégradé, donc la plaque prend la lumière du cliché ;
- **le porte-plaque sombre est redessiné** autour, sinon l'ancien cadre de la
  vraie plaque reste visible et on voit un double contour ;
- **la plaque est rendue à sa position et à son angle réels**, puis passe dans
  un flou très léger (sigma 1 à 2) avec les bords fondus dans l'image.

Quatre pièges déjà payés, à ne pas rejouer :

- **une image peut avoir plusieurs plaques** (`photo1.jpeg` en a deux). Le
  fichier est traité en une seule passe ; sinon la seconde écriture repart de
  l'original et annule la première, et la plaque disparaît.
- **`sharp.rotate()` ne dégoinde pas le canevas, il rogne.** Il faut donc rendre
  la plaque sur un canevas déjà dimensionné pour sa boîte de rotation, sinon les
  angles de la plaque et les bandes bleues sont coupés.
- **une boîte qui ne recopie pas `angle` produit un `NaN`** dans les dimensions du
  SVG, et le moteur rend alors le SVG à sa taille naturelle (552×134) : la plaque
  sort trois fois trop grande.
- **l'échantillonnage doit se faire au centre de la plaque.** Sur une plaque
  inclinée, une bande posée en haut ou en bas de la boîte sort de la plaque et
  tombe sur la calandre — la plaque ressort noire.

Les boîtes sont relevées en pixels dans `scripts/plate-branding.mjs`, mesurées
sur les originaux à partir de zooms 4x à 12x — **pas d'après les vignettes** —
puis vérifiées en recadrant les fichiers **déjà traités**.

| Fichier                | Boîte (x, y, l, h)    | Angle  |
|------------------------|------------------------|--------|
| `photo1.jpeg` (Corolla, avant)   | 760, 830, 61, 44   | −11,7° |
| `photo1.jpeg` (Peugeot garée)   | 0, 706, 39, 15      | −1,9°  |
| `photo2.jpeg`          | 46, 760, 79, 43            | −6,5°  |
| `photo3.jpeg`          | 701, 879, 100, 37          | +3,3°  |
| `freedom-taxi-hero.jpeg` | 1343, 638, 122, 31        | −0,6°  |
| `aéroport.png`         | 310, 594, 178, 46          | −0,6°  |
| `hopital-clinique.png` | 166, 561, 166, 44          | −1,2°  |
| `reservation.png`      | 157, 574, 175, 50          | −0,7°  |
| `Paris.png`            | 222, 611, 179, 51          | −0,6°  |

**Les originaux non traités sont conservés une seule fois dans
`originals-images/`**, dossier situé hors de `public/` : il n'est donc ni
déployé par Vite, ni servi par `server/index.js`, et il est ignoré par Git.
Le script est idempotent — il repart toujours des originaux, relancer la
commande ne cumule pas les traitements.

```bash
npm run images:plates   # remplace les caractères des plaques (originaux sauvegardés)
npm run images          # regénère ensuite les dérivés WebP
```

> **Important :** les fichiers de `public/images/` ne sont plus bit-à-bit
> identiques aux photos fournies : ils portent la plaque « FREEDOM ». C'est
> volontaire, c'est la seule façon d'empêcher la lecture de la plaque depuis
> l'URL publique (`/images/photo1.jpeg`) ou depuis les balises `og:image`.
> Les originaux restent disponibles dans `originals-images/`.

---

## ⚙️ Configuration des e-mails (OBLIGATOIRE)

Sans cette étape, le formulaire **ne peut pas** envoyer d'e-mail : il affiche
un message d'erreur invitant le client à appeler. Rien n'est simulé.

### 1. Créer le fichier `.env`

Copiez `.env.example` vers `.env` (à la racine du projet) :

```bash
cp .env.example .env      # Windows : copy .env.example .env
```

### 2. Renseigner les variables

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=adresse-du-compte-expéditeur
SMTP_PASS=mot-de-passe-application
BOOKING_TO=Dominique_tanoh94@yahoo.fr
BOOKING_FROM=Freedom Taxi <adresse-du-compte-expéditeur>
PORT=5175
```

### 3. Obtenir `SMTP_PASS` (mot de passe d'application Gmail)

1. Le compte Google doit avoir la **validation en 2 étapes** activée.
2. Rendez-vous sur <https://myaccount.google.com/apppasswords>.
3. Créez un mot de passe d'application nommé « Freedom Taxi ».
4. Copiez les 16 caractères dans `SMTP_PASS`.

> ⚠️ Ce n'est **pas** votre mot de passe Google. Ne committez jamais le
> fichier `.env` : il est déjà ignoré par `.gitignore`.

### 4. Vérifier que tout est bon

```bash
npm start
```

Le démarrage affiche `✓ Envoi des réservations : CONFIGURÉ (SMTP)`.
Sinon, la liste des variables manquantes est affichée.

Test de l'API :

```bash
curl http://localhost:5175/api/health
# → { "ok": true, "mailConfigured": true }
```

---

## Comportement du formulaire

| Situation                    | Réponse                                 |
|------------------------------|-----------------------------------------|
| Envoi réussi                 | Écran de confirmation                   |
| Champs invalides             | Erreurs affichées champ par champ       |
| SMTP non configuré           | Message d'erreur + lien `mailto:`       |
| Plus de 5 demandes/min/IP    | Message « trop de demandes »            |

Si l'envoi échoue, le client voit un **vrai message d'erreur** et peut
envoyer sa demande via un `mailto:` pré-rempli — aucune fausse confirmation
n'est affichée.

---

## Où modifier les informations de l'entreprise

Toutes les informations de l'entreprise (numéros, zone, services) sont
centralisées dans **`src/config/business.js`**. Ce fichier est la source de
vérité unique : modifiez-le, et le site entier est à jour.

---

## Déploiement

Le serveur de production (`server/index.js`) sert les fichiers statiques et
l'API. Déployez-le sur n'importe quel hébergeur compatible Node.js
(Render, Railway, Fly.io, VPS…) en définissant les mêmes variables
d'environnement dans l'interface de l'hébergeur.

```bash
npm install
npm run build
npm start
```

## Sécurité

- Aucun mot de passe dans le code ni dans Git.
- Validation des données côté serveur (`server/booking-mailer.js`).
- Limitation du débit par IP.
- Protection contre l'injection HTML dans le corps des e-mails.
