# Déploiement — Freedom Taxi

Guide complet : installation, développement, mise en production, GitHub,
Vercel, hébergement classique et intégration Supabase.

---

## 0. Déploiement sur Vercel (recommandé)

Vercel héberge le site statique et exécute l'API `/api/booking` en fonction
serverless. **Il ne peut pas exécuter `npm start`** (serveur Express
persistant) : c'est `api/booking.js` qui remplace le serveur en production.

| Élément | Rôle |
|---|---|
| `vercel.json` | Build (`npm run build`), sortie `dist/`, alias des pages légales, en-têtes |
| `api/booking.js` | Endpoint serverless `POST /api/booking` |

`api/booking.js` ne réimplémente rien : il fait le pont vers
`server/booking-handler.js`, qui reste la source unique de la logique métier
(honeypot, validation, rate limiting, envoi SMTP). Le formulaire n'est donc pas
modifié.

### Mise en ligne

1. Pousser le code sur GitHub.
2. Sur Vercel : **Add New → Project**, choisir le dépôt, framework **Vite**.
3. Ne rien renseigner d'autre : `vercel.json` fournit déjà build et output.
4. **Deploy.**

Le site est en ligne immédiatement, sur `https://<projet>.vercel.app`.

### Variables d'environnement

À saisir dans **Vercel → Settings → Environment Variables** (jamais dans un
fichier versionné) :

| Variable | Exemple |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `compte@gmail.com` |
| `SMTP_PASS` | *mot de passe d'application* |
| `BOOKING_TO` | `reservations@freedomparis.fr` |
| `BOOKING_FROM` | `reservations@freedomparis.fr` |

`PORT` et `TRUST_PROXY` ne sont pas utiles sur Vercel.

> ⚠️ **Sans ces variables, le formulaire répond 500** et affiche « le service
> d'envoi n'est pas encore configuré ». Le site reste en ligne, mais aucune
> réservation ne part. Il faut les définir **avant** d'annoncer le site.

### Domaine freedomparis.fr

Vercel → Settings → Domains → **Add** `freedomparis.fr` et `www.freedomparis.fr`.
Vercel affiche les enregistrements DNS à copier chez votre registrar. Le
certificat HTTPS est délivré automatiquement.

### Ce qu'il faut savoir

- **Rate limiting en mémoire** : les compteurs vivent dans l'instance serverless
  courante. Elle est partagée entre invocations, mais pas garantie unique à 100 %.
  Pour un site de cette taille c'est largement suffisant.
- **Cold start** : la toute première requête après une période d'inactivité peut
  prendre 1 à 3 s. Le formulaire reste fonctionnel.
- **Plan gratuit** : 100 Go de bande passante par mois. Vos images pèsent ~4,8 Mo
  par visite complète ; avec les WebP, une visite réelle est bien plus légère.

---

## 1. Prérequis

| Outil | Version | Remarque |
|---|---|---|
| Node.js | 18 ou plus (20+ recommandé) | `node -v` |
| npm | fourni avec Node | `npm -v` |
| Git | récent | pour GitHub |

---

## 2. Installation

```bash
npm install
```

---

## 3. Variables d'environnement

Le projet lit un fichier `.env` à la racine. Il n'existe pas à l'installation :
il faut le créer à partir du modèle.

**Windows (PowerShell) :**

```powershell
Copy-Item .env.example .env
notepad .env
```

**Linux / macOS :**

```bash
cp .env.example .env
nano .env
```

Puis renseigner :

| Variable | Remplir avec |
|---|---|
| `SMTP_HOST` | Serveur SMTP de l'expéditeur (ex. `smtp.gmail.com`) |
| `SMTP_PORT` | `587` en général, `465` avec `SMTP_SECURE=true` |
| `SMTP_SECURE` | `false`, sauf si le port 465 est utilisé |
| `SMTP_USER` | Adresse e-mail d'envoi |
| `SMTP_PASS` | **Mot de passe d'application**, pas le mot de passe du compte |
| `BOOKING_TO` | Adresse qui reçoit les demandes de réservation |
| `BOOKING_FROM` | Nom et adresse affichés dans le mail |
| `PORT` | `5175` en développement |
| `TRUST_PROXY` | `1` si un reverse proxy est devant l'application |

> ⚠️ `.env` n'est **jamais** versionné. Seul `.env.example` l'est.
> Voir `SECURITY.md` pour les règles sur les secrets.

---

## 4. Développement

```bash
npm run dev
```

Le site est servi sur `http://localhost:5175`. L'API de réservation fonctionne
en développement : un plugin Vite (`server/vite-plugin-booking-api.js`) branche
exactement le même gestionnaire que la production, sur le même code.

---

## 5. Build

```bash
npm run build
```

Produit `dist/`, prêt à être servi. C'est le dossier à déployer.

---

## 6. Tests

```bash
npm run build

# Contrôle du rendu et des requêtes sur plusieurs tailles d'écran
npm run qa

# Contrôle de la galerie et de la visionneuse
npm run qa:gallery
```

Les deux commandes démarrent Vite toutes seules. Si `npm run dev` tourne déjà
sur la même machine, l'arrêter d'abord.

---

## 7. Lancer le serveur

Le serveur Express sert `dist/` **et** l'API de réservation. Il faut donc avoir
lancé le build avant.

```bash
npm start
```

`npm run serve` enchaîne les deux (build puis démarrage).

Vérification rapide :

```bash
curl http://localhost:5175/api/health
# {"ok":true}
```

Si les e-mails ne sont pas configurés, le serveur le signale au démarrage et
liste les variables manquantes.

---

## 8. Régénérer les images

---

## 9. Mise en production

### 9.1 Ce qu'il faut sur le serveur

```bash
git clone <url-du-depot>
cd freedom-taxi
npm ci --omit=dev
cp .env.example .env      # puis compléter
npm run build
```

`npm ci` installe exactement les versions de `package-lock.json` (reproductible),
contrairement à `npm install`.

### 9.2 Processus qui tourne en permanence

Avec [pm2](https://pm2.keymetrics.io/) :

```bash
npm install -g pm2
pm2 start server/index.js --name freedom-taxi
pm2 save
pm2 startup
```

### 9.3 Reverse proxy et HTTPS

L'application écoute en HTTP sur le port défini par `PORT`. C'est le rôle du
reverse proxy de terminer le HTTPS.

**Caddy** (le plus simple, HTTPS automatique) :

```
freedomparis.fr {
    reverse_proxy localhost:5175
}
```

**Nginx** :

```nginx
server {
    listen 80;
    server_name freedomparis.fr www.freedomparis.fr;
    return 301 https://freedomparis.fr$request_uri;
}

server {
    listen 443 ssl http2;
    server_name freedomparis.fr www.freedomparis.fr;

    ssl_certificate     /etc/letsencrypt/live/freedomparis.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/freedomparis.fr/privkey.pem;

    client_max_body_size 1m;

    location / {
        proxy_pass http://127.0.0.1:5175;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

⚠️ `X-Forwarded-For` est ce que l'application lit pour connaître l'adresse du
visiteur (rate limiting). Sans cet en-tête, tout le monde se partage le même
quota.

### 9.4 Sauvegardes

À sauvegarder : `.env` et `originals-images/`. Ni l'un ni l'autre n'est dans le
---

## 11. Hébergement futur

Le projet est construit pour qu'aucune de ces solutions ne demande de
modifier le code.

| Solution | Front (`dist/`) | API Express | HTTPS |
|---|---|---|---|
| VPS + Nginx/Caddy | Nginx | `pm2` | Let's Encrypt |
| OVH mutualisé / Cloud | Apache | ✗ (PHP) | inclus |
| Railway / Render / Fly.io | automatique | automatique | automatique |
| Vercel / Netlify | automatique | ✗ (fonctions) | automatique |

**Point clé pour Supabase + Vercel** : Vercel ne fait tourner que du front.
Il faudra soit déplacer l'envoi d'e-mails vers une Edge Function, soit
conserver un petit serveur Node séparé pour `/api/booking`. Aucune de ces
options n'est implémentée à ce jour.

> Si l'hébergement est en PHP (mutualisé OVH par exemple), l'API Express ne
> pourra pas tourner : il faudra réécrire `/api/booking` en PHP. Le format de la
> requête et des réponses est documenté dans `server/booking-handler.js`, la
> transition est donc faisable, mais ce n'est pas fait aujourd'hui.

---

## 12. Supabase (intégration future)

Aucune dépendance Supabase n'est installée et aucune configuration n'a été
créée. Le projet fonctionne sans.

Pour une intégration future :

1. Créer le projet Supabase.
2. Récupérer l'URL et la clé **publiable** dans les réglages API.
3. Les mettre dans `.env` en développement, et dans les variables
   d'environnement de l'hébergeur en production :
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<clé publique>
   ```
4. Créer les tables, et activer les politiques RLS **avant** d'écrire la
   moindre donnée.
5. Installer le client : `npm install @supabase/supabase-js`.
6. Lire l'URL avec `import.meta.env.VITE_SUPABASE_URL`.

### Règles absolues

- La clé secrète (`secret` / `service_role`) **ne doit jamais** être dans une
  variable `VITE_`, ni dans le code du navigateur, ni dans le dépôt. Elle sert
  uniquement à un script exécuté côté serveur.
- La clé publique n'est pas un secret : elle apparaît dans le bundle. C'est
  normal et sans danger **à condition que les politiques RLS soient
  configurées**. Sans RLS, la clé publique donne accès en lecture à toutes
  les tables.
- Ne pas stocker d'information de santé dans Supabase. Voir `SECURITY.md`.

dépôt Git, donc ils ne sont **pas** restaurés par un simple `git clone`.

---

## 10. GitHub

### Première publication

```bash
git init
git add .
git status              # vérifier AVANT de commiter
```

`git status` ne doit **pas** faire apparaître `.env` ni `originals-images/`.
Le cas échéant, arrêter et vérifier le `.gitignore` :

```bash
git check-ignore .env originals-images/
```

Puis :

```bash
git commit -m "Version initiale"
git remote add origin <url-du-depot>
git push -u origin main
```

### Secrets

- `VITE_*` → publique, versionnable sans risque (mais n'y mettez rien de secret).
- `SMTP_PASS` → jamais versionnée. En production, elle se définit dans
  l'environnement de l'hébergeur, pas dans un fichier du dépôt.

Si un secret a été poussé par erreur, **le faire tourner** : supprimer le
fichier ne suffit pas, l'historique Git le conserve. Utiliser
`git filter-repo` ou réinitialiser le dépôt.

```bash
npm run images:plates   # remplace les caractères des plaques par « FREEDOM »
npm run images          # génère les dérivés WebP
```

Ces commandes lisent les originaux dans `originals-images/`, qui ne doivent
jamais être supprimés. Le résultat est publié dans `public/images/`.
