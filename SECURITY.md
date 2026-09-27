# Sécurité — Freedom Taxi

Ce document décrit les règles de sécurité appliquées au projet et ce qu'il ne
faut pas faire. Il s'adresse à toute personne qui reprend le code.

---

## 1. Le secret absolute

**Le seul secret du projet est le mot de passe SMTP (`SMTP_PASS`).**

Règles :

- Il vit **exclusivement** dans le fichier `.env`, à la racine.
- `.env` est ignoré par Git. Il ne doit jamais être versionné, même « juste
  pour cette fois ».
- `.env.example` ne contient que des **noms** de variables, jamais de valeurs.
- Aucune clé, aucun mot de passe, aucun token ne doit être écrit dans un
  fichier lu par Vite, donc dans aucun fichier portant un suffixe `VITE_`.

### Le piège `VITE_`

Vite n'injecte dans le bundle JavaScript que les variables **préfixées par
`VITE_`**. C'est le mécanisme, pas un bug.

> Toute variable `VITE_` est donc **publique** : elle finit dans le fichier
> `dist/assets/*.js`, téléchargeable par n'importe qui.

C'est pour cela qu'un futur client Supabase se découpe en deux :

| Clé | Où elle vit | Pourquoi |
|---|---|---|
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Navigateur | Clé publique, conçue pour être exposée, protégée par les règles RLS en base |
| `SUPABASE_SECRET_KEY` (ex-`service_role`) | Serveur uniquement | Contourne les règles RLS : elle ne doit **jamais** atteindre le navigateur |

---

## 2. Traitement des données personnelles

Le formulaire collecte des données personnelles (nom, téléphone, email, itinéraire).

- Le client **ne fait jamais confiance au frontend** : `validateBooking()` dans
  `server/booking-mailer.js` revérifie et nettoie chaque champ côté serveur.
- Le champ « message » ne doit jamais recevoir de donnée de santé. C'est
  rappelé sous le champ dans l'interface, et dans la politique de
  confidentialité. Un transporteur qui reçoit des données de santé voit ses
  obligations RGPD devenir nettement plus lourdes.
- Le contenu du mail est échappé (`escapeHtml`) avant d'être mis en HTML : sans
  cela, un message contenant `<script>` deviendrait du HTML exécuté dans la
  boîte mail du destinataire.

---

## 3. Ce que le serveur ne doit jamais renvoyer

En cas d'erreur, la réponse contient un message en français, jamais :

- une stack trace ;
- un message d'erreur SMTP (il contient parfois l'hôte et des détails de
  connexion) ;
- un nom de variable d'environnement ;
- la valeur d'un secret.

C'est vérifié dans `server/booking-handler.js` : `console.error` n'enregistre
que `err.message`, et la réponse envoyée au client est un texte fixe.

---

## 4. Limitation de débit et anti-spam

- **5 demandes par minute et par IP** sur `POST /api/booking`, fenêtre
  glissante. La limite est appliquée **avant** l'envoi SMTP, sinon un robot
  sature la boîte mail.
- **Honeypot** : un champ invisible dans le formulaire. Seuls les robots le
  remplissent ; la requête est alors acceptée en apparence mais aucun mail
  n'est envoyé.
- Le compteur est purgé toutes les 5 minutes, sinon la table en mémoire
  grossirait indéfiniment.
- ⚠️ Le rate limiting est **en mémoire** : il ne fonctionne que sur une
  instance unique. Sur une architecture à plusieurs instances, il faut un
  stockage partagé (Redis, ou le rate limiting de l'hébergeur).

`TRUST_PROXY` doit rester cohérent avec le nombre de proxys réellement
présents devant l'application, sinon `req.ip` n'est pas l'adresse du visiteur
et tout le monde se partage le même quota.

---

## 5. En-têtes HTTP

Appliqués par `server/security.js` :

| En-tête | Rôle |
|---|---|
| `Content-Security-Policy` | Empêche l'exécution de scripts non prévus |
| `X-Content-Type-Options: nosniff` | Empêche le navigateur de deviner un type MIME |
| `X-Frame-Options: DENY` | Interdit l'affichage du site dans une iframe (clickjacking) |
| `Referrer-Policy` | Limite les informations transmises aux sites tiers |
| `Permissions-Policy` | Coupe géolocalisation, micro, caméra, paiement |
| `Strict-Transport-Security` | Force HTTPS (uniquement sur une requête sécurisée) |

Si vous ajoutez une source externe (police, vidéo, carte, CDN), **il faut
l'ajouter à la CSP**, sinon le navigateur la bloquera silencieusement. C'est
aussi ce qui est arrivé avec Google Fonts : la police était bloquée tant que
`fonts.googleapis.com` et `fonts.gstatic.com` n'étaient pas autorisés.

---

## 6. CORS

Aucun en-tête CORS n'est envoyé, et c'est **voulu**. Le formulaire est
same-origin : le navigateur n'autorise de toute façon pas une page tierce à
appeler l'API. Ajouter `Access-Control-Allow-Origin: *` ouvrirait le serveur à
n'importe quel site du monde, qui pourrait s'en servir pour envoyer des e-mails
depuis votre serveur.

---

## 7. Fichiers privés

`originals-images/` contient les photos **avant** modification des plaques
d'immatriculation. Elles ne doivent jamais être publiées.

- Le dossier est hors de `public/`, donc absent de `dist/`.
- Il est ignoré par Git.
- `server/index.js` ne sert que `dist/` : le dossier n'est pas exposé.
- Une demande sur `/originals-images/...` retombe sur la page du site, la
  photo n'est pas renvoyée.

**Ne pas déplacer ces fichiers dans `public/`.** Si vous les supprimez, la
régénération des plaques devient impossible (les coordonnées sont mesurées sur
les originaux).

---

## 8. Avant chaque mise en ligne

```bash
npm audit --omit=dev     # doit afficher 0 vulnérabilité
npm run build            # doit réussir
```

Et vérifier que `.env` n'est pas sur le point d'être versionné :

```bash
git check-ignore .env originals-images/
```

Les deux doivent être ignorés.
