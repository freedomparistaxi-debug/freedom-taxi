# Licences et provenance des fichiers

Ce document recense les fichiers du projet et leur origine. Il sert à savoir,
pour chaque élément, d'où il vient et ce qu'on a le droit d'en faire.

**Aucune licence n'est inventée ici.** Tant qu'une information n'a pas été
confirmée par l'exploitant, elle est marquée `[À CONFIRMER]`.

---

## 1. Visuels

| Fichier | Source | Licence / droit | Usage | Commentaire |
|---|---|---|---|---|
| `public/images/freedom-taxi-hero.jpeg` | Fourni par l'exploitant | `[À CONFIRMER]` | Image d'accueil, og:image | Photographie du véhicule |
| `public/images/photo1.jpeg` | Fourni par l'exploitant | `[À CONFIRMER]` | Galerie véhicule | Plaque remplacée par « FREEDOM » |
| `public/images/photo2.jpeg` | Fourni par l'exploitant | `[À CONFIRMER]` | Galerie véhicule | Plaque remplacée par « FREEDOM » |
| `public/images/photo3.jpeg` | Fourni par l'exploitant | `[À CONFIRMER]` | Galerie véhicule | Plaque remplacée par « FREEDOM » |
| `public/images/aéroport.jpg` | Fourni par l'exploitant | `[À CONFIRMER]` | Section transferts aéroport | Plaque remplacée par « FREEDOM » |
| `public/images/hopital-clinique.jpg` | Fourni par l'exploitant | `[À CONFIRMER]` | Section taxi conventionné | Plaque remplacée par « FREEDOM » |
| `public/images/reservation.jpg` | Fourni par l'exploitant | `[À CONFIRMER]` | Illustration du formulaire | Plaque remplacée par « FREEDOM » |
| `public/images/Paris.jpg` | Fourni par l'exploitant | `[À CONFIRMER]` | Section zone d'intervention | Plaque remplacée par « FREEDOM » |
| `public/favicon.svg` | Créé pour ce projet | Propriétaire du projet | Icône du site | — |
| Logo (composant `Logo.jsx`) | Créé pour ce projet | Propriétaire du projet | En-tête et pied de page | — |

> **Point d'attention.** Ces photographies sont décrites comme « fournies par
> l'exploitant ». Si l'une d'elles provient en réalité d'un compte tiers
> (réseaux sociaux, banque d'images, concurrent), la licence n'est pas la même :
> il faut le vérifier avant la mise en ligne et l'indiquer ici.

## 2. Polices

| Élément | Source | Licence | Usage |
|---|---|---|---|
| Plus Jakarta Sans | Google Fonts | SIL Open Font License 1.1 | Police du site |

## 3. Dépendances logicielles

Les dépendances sont listées dans `package.json`. Elles sont soumises à leurs
licences respectives (MIT, Apache-2.0, etc.). `npm ls --long` affiche la
licence de chacune :

```bash
npm ls --omit=dev --long
```

Aucune dépendance n'est « copiée-collée » dans le code source : tout provient
de npm, avec sa licence et ses mises à jour de sécurité.

## 4. Textes

Les textes du site (descriptions de services, textes commerciaux) sont
originaux et rédigés pour FREEDOM TAXI. Ils ont été produits avec une assistance
outillée par intelligence artificielle, puis relus et validés par
l'exploitant.

Les informations d'entreprise (SIREN, SIRET, TVA, NAF, adresse, président) ont
été communiquées par l'exploitant et n'ont pas été inventées.

## 5. Retouches d'images

Les plaques d'immatriculation visibles sur les photographies ont été
remplacées par la mention « FREEDOM » à l'aide d'un outil de traitement
d'image assistée par IA (`scripts/plate-branding.mjs`).

- Les fichiers **publiés** dans `public/images/` portent la plaque modifiée.
- Les originaux **non modifiés** sont conservés dans `originals-images/`, qui
  n'est jamais versionné ni déployé.

Ces retouches sont décrites dans les mentions légales du site.
