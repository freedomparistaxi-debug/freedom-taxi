# Checklist avant mise en ligne

Cochez chaque ligne avant de publier sur `freedomparis.fr`.

---

## A. Bloquant — le site ne doit pas être publié sans ces éléments

- [ ] **Hébergeur identifié** : raison sociale, adresse, téléphone et URL,
      à inscrire dans `/mentions-legales`. Obligatoire en France (LCEN).
- [ ] **Médiateur de la consommation désigné** et nommé dans
      `/conditions-reservation`. Obligatoire pour un transporteur, même sans
      adhésion à un organisme.
- [ ] **Forme juridique** de la société (SAS, SARL, EI…) renseignée dans
      `/mentions-legales`.
- [ ] **Adresse électronique de contact officielle** renseignée (actuellement
      `[À COMPLÉTER PAR LE CLIENT]` dans les 4 pages).
- [ ] **Durée de conservation** des demandes définie et inscrite dans
      `/politique-confidentialite`.
- [ ] **Toutes les mentions `[À COMPLÉTER PAR LE CLIENT]`** remplacées.

Recherche rapide dans les pages légales :

```bash
grep -rn "À COMPLÉTER" public/legal/
```

Cette commande ne doit rien retourner.

---

## B. Technique

- [ ] `npm install` puis `npm run build` : le build doit réussir.
- [ ] `npm audit --omit=dev` : **0 vulnérabilité**.
- [ ] `npm run qa` : aucune requête en échec, aucune erreur console.
- [ ] `npm run qa:gallery` : galerie et visionneuse fonctionnelles.
- [ ] `npm start` fonctionne et `curl /api/health` renvoie `{"ok":true}`.
- [ ] Les 4 pages légales s'ouvrent : `/mentions-legales`,
      `/politique-confidentialite`, `/cookies`, `/conditions-reservation`.
- [ ] `/robots.txt` et `/sitemap.xml` accessibles.
- [ ] HTTPS actif (certificat valide, redirection HTTP → HTTPS).
- [ ] `www` redirige vers le domaine nu (sans quoi le SEO est dupliqué).

---

## C. Sécurité

- [ ] `.env` présent **sur le serveur** et **absent du dépôt Git**.
- [ ] `git check-ignore .env originals-images/` retourne les deux chemins.
- [ ] `originals-images/` n'est **pas** dans `dist/`.
- [ ] Une demande sur `/originals-images/...` ne renvoie pas de photo.
- [ ] Les en-têtes de sécurité sont bien servis (CSP, nosniff, frame-deny).
- [ ] Le mot de passe SMTP est un **mot de passe d'application**, pas le mot
      de passe du compte.
- [ ] Le rate limiting fonctionne derrière le proxy (tester plusieurs requêtes
      rapprochées : la 6ᵉ doit renvoyer 429).
- [ ] `TRUST_PROXY` correspond au nombre réel de proxys.

---

## D. Réservation et e-mail

- [ ] Une demande de test arrive bien dans la boîte `BOOKING_TO`.
- [ ] Les 10 champs apparaissent correctement dans le mail reçu.
- [ ] Un caractère spécial (`&`, `<`, `"`, `'`) ne casse pas l'affichage.
- [ ] Le message de confirmation dit bien « demande reçue », et non
      « réservation confirmée ».
- [ ] La note « Merci de ne pas transmettre d'informations médicales »
      est visible sous le champ message.
- [ ] Le lien `mailto:` de secours fonctionne si le serveur est indisponible.
- [ ] Une adresse e-mail valide mais inexistante est acceptée par le
      formulaire (l'email reste facultatif).

---

## E. Contenu

- [ ] Les deux numéros de téléphone sont corrects et joignables.
- [ ] Aucune mention à Google Fonts ne casse l'affichage (police chargée).
- [ ] Le logo et les couleurs sont inchangés.
- [ ] Les photographies sont bien celles de l'exploitant, et leur licence est
      confirmée dans `ASSET_LICENSES.md`.
- [ ] Le SIREN, le SIRET et la TVA sont identiques à l'immatriculation réelle.
- [ ] Aucun `[À COMPLÉTER]` ne subsiste dans le site.

---

## F. Mobile et accessibilité

- [ ] Le formulaire se remplit entièrement au doigt sur téléphone.
- [ ] Le clavier permet de passer d'un champ à l'autre, et le bouton
      « Envoyer » est atteignable.
- [ ] Un focus visible existe sur les liens du pied de page.
- [ ] Le menu mobile s'ouvre et se referme.
- [ ] La barre d'appel fixe du bas ne masque pas le bouton d'envoi.

---

## G. Après la mise en ligne

- [ ] Déclarer le site sur Search Console et y soumettre `sitemap.xml`.
- [ ] Vérifier les aperçus de partage sur Facebook, WhatsApp, LinkedIn.
- [ ] Vérifier que le schema.org est validé (Google Rich Results Test).
- [ ] Confirmer que les en-têtes de sécurité sont bien appliqués en ligne
      (https://securityheaders.com).
- [ ] Mettre en place une sauvegarde de `.env` et de `originals-images/`.
