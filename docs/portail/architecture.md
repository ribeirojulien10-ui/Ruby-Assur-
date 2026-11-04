# Portail documentaire — architecture, sécurité et passage en production

> **État : développement local uniquement.** Rien n'est déployé, aucun service externe n'est activé.
> Le portail est **désactivé par défaut** (`PORTAL_ENABLED` absent ⇒ toutes ses routes répondent 404).

## 1. Ce qui est réel et ce qui est simulé

| Élément | Local (testé) | Production |
|---|---|---|
| Base de données | SQLite (`node:sqlite`), fichier `.data/portal.sqlite` | **Non fait** : schéma PostgreSQL préparé (`supabase/migrations/0001_portail_documents.sql`), jamais exécuté |
| Stockage des fichiers | Disque privé `.data/storage/` (hors `public/`, droits 600, noms aléatoires) | **Non fait** : à brancher sur un stockage objet privé (voir §3) |
| Téléversement | Autorisation temporaire → envoi en quarantaine → contrôle → stockage privé | Même séquence, mais l'envoi irait **directement du navigateur au stockage** (URL signée). La route locale `PUT /api/portal/uploads/[jeton]` ne conviendrait pas sur Vercel (limite 4,5 Mo par requête) |
| Authentification de Julien | Better Auth (e-mail + mot de passe, sessions 8 h) — **réel** | À durcir : double authentification (plugin TOTP de Better Auth) |
| Antimalware | Analyse **basique** (exécutables déguisés, signature de test EICAR, PDF à actions actives) | **Non fait** : un vrai moteur (ex. ClamAV) est indispensable avant de marquer un fichier « sain » |
| Notifications | Table `outbox` ; **aucun e-mail n'est envoyé** (`PORTAL_NOTIFY_ENABLED` absent) | Resend, message générique sans donnée sensible (code prêt, non activé) |
| Limitation de débit | Mémoire du processus | **Compteur partagé requis** (ex. Upstash Redis) : sur Vercel chaque instance a sa propre mémoire |
| Relances automatiques | Politique pure + tests (`lib/portal/reminder-policy.ts`) | **Non branchée** à aucun planificateur : aucune relance automatique n'existe |

## 2. Modèle de données (relationnel, une demande = un dossier isolé)

`clients` → `requests` (une demande par client et par assurance) → `request_items` (pièces demandées) → `files` (fichiers).
`templates` / `template_items` (checklists modifiables par Julien), `uploads` (autorisations de téléversement à usage unique),
`events` (historique), `reminders` (relances), `outbox` (notifications), `audit_log` (trace anonyme des suppressions).

**Statuts** (le statut d'un dossier est **toujours dérivé** de l'état réel, jamais stocké) :
pièce : À fournir → Reçu → (Validé | À remplacer) ; dossier : En attente du client → En cours (pièces reçues) → À examiner (le client a confirmé) → Pièces validées → Terminé.
Le vocabulaire ne parle volontairement pas de dossier « complet » : en début de processus (étude, devis) un dossier ne l'est jamais. Julien est prévenu quand le **client confirme son envoi**.
*Recevoir un fichier ne veut pas dire le valider : seul Julien valide.*

**Informations saisies par le client** : chaque modèle peut définir des champs (texte, nombre, date, choix…) ; les valeurs sont enregistrées sur la demande. Un champ « obligatoire » vide maintient le dossier « en attente du client ». **Cases à cocher** : par ex. « C'est ma première assurance » rend le relevé d'information non demandé.

## 3. Stockage : comparaison et recommandation

| Critère | Supabase (Postgres + Storage privé) | Vercel Blob (privé) |
|---|---|---|
| Base de données relationnelle | **Incluse** (nécessaire : dossiers, pièces, historique) | Non : il faudrait ajouter une base (Neon, etc.) |
| Stockage privé + URL signées | Oui (téléversement direct signé) | Oui (mode privé disponible, annoncé en disponibilité générale) |
| Gestion des accès | RLS + bucket privé ; accès serveur par clé « service role » | Jeton d'accès serveur |
| Localisation des données | Régions UE disponibles à la création du projet (**à confirmer** : région exacte et contrat de sous-traitance / DPA) | **À vérifier** |
| Suppression / export | Standard PostgreSQL (`pg_dump`) + API Storage | API de suppression ; export à organiser |
| Simplicité | Un seul prestataire pour données + fichiers | Deux briques à assembler |

**Recommandation : Supabase, projet en région UE**, car le portail a autant besoin d'une base relationnelle que de fichiers. Vercel Blob privé reste une alternative valable si l'on préfère rester chez un seul prestataire d'hébergement, au prix d'une base à ajouter.
*Limite de cette recommandation : je n'ai pas pu confirmer sur les pages officielles les prix, la région ni les garanties contractuelles ; ils doivent être vérifiés avant tout engagement.*

## 4. Authentification

**Better Auth** (bibliothèque dédiée, pas de système maison) : mots de passe hachés par la bibliothèque, sessions courtes, cookies `httpOnly` + `SameSite=strict` (+ `Secure` en production), **inscription publique désactivée** (le compte est créé par script), liste blanche d'e-mails (`PORTAL_ADMIN_EMAILS`, refus par défaut), limitation des tentatives de connexion.
Chaque page de l'espace pro **et chaque action serveur** revérifient la session ; chaque fonction du service exige un objet `AdminSession`.

## 5. Liens clients

- Jeton de **256 bits** (`crypto.randomBytes(32)`, 43 caractères base64url) : impossible à deviner, non énumérable.
- La base ne contient que l'**empreinte SHA-256** du jeton ; une copie **chiffrée (AES-256-GCM)** permet à Julien de recopier le lien (clé `PORTAL_LINK_KEY`, jamais dans le code).
- Durée **configurable** (7 / 14 / 30 / 60 jours — *défaut de 14 jours à valider*), **prolongeable**, **révocable**, **régénérable** (l'ancien lien cesse de fonctionner).
- Un lien ne donne accès qu'à **sa** demande : chaque ressource (pièce, fichier, autorisation) est vérifiée comme appartenant à la demande du jeton.
- Aucune donnée personnelle dans l'URL. Pages et API : `Cache-Control: no-store`, `X-Robots-Tag: noindex`, `Referrer-Policy: no-referrer`.
- Page client ≠ page publique : mise en page séparée **sans Google Ads, sans Analytics, sans chatbot**.
- *Étudié, non implémenté* : vérification supplémentaire (code envoyé séparément) pour les documents très sensibles.

## 6. Protections sur les fichiers

Extension **et** contenu réel (signature) concordants (PDF, JPEG, PNG, WebP, HEIC) ; taille plafonnée (15 Mo par fichier, 100 Mo par dossier, configurables) ; nombre de fichiers par pièce limité ; nom nettoyé ; clé de stockage aléatoire sans nom de client ; **quarantaine** avant enregistrement ; autorisation de téléversement **à usage unique et expirante** ; fichier jamais lisible tant qu'il n'est pas contrôlé ; remplacement = suppression physique de l'ancien fichier ; aucun fichier dans `public/` ni dans Git (`.data/` ignoré) ; diffusion à Julien en flux par une route authentifiée, `nosniff` + `CSP sandbox`, aperçu limité aux PDF/images, **aucune URL publique permanente**.

## 7. RGPD et conservation (à faire valider)

Information du client sur la page de dépôt (formulation à valider) ; collecte limitée aux pièces de la checklist ; traçabilité (`events`) sans contenu de document ; suppression définitive d'un dossier (fichiers + données, trace anonyme conservée) ; fonction de purge des dossiers clôturés (`purgeClosedRequests`) **sans durée par défaut** ; expiration/révocation des liens.
**Aucune durée de conservation n'est inventée** : elle doit être fixée par Julien (avec conseil juridique). La politique de confidentialité publique devra être mise à jour avant mise en ligne du portail (mention du portail, des sous-traitants, des durées).
Sous-traitants à documenter : hébergeur (Vercel), base + stockage (Supabase ou équivalent), envoi d'e-mails (Resend).

## 8. Coûts d'hébergement estimatifs (ordres de grandeur, **non vérifiés sur les pages officielles**)

Hypothèses : ~100 nouveaux dossiers/mois, ~10 Mo de documents par dossier ⇒ ~1 Go/mois, ~12 Go/an.
- Supabase offre Pro : de l'ordre de **25 $/mois** (stockage inclus de l'ordre de 100 Go selon les sources consultées).
- Vercel : l'offre gratuite « Hobby » est destinée à un usage non commercial (à vérifier dans les conditions) ; l'offre Pro est de l'ordre de **20 $/mois**.
- Resend : offre gratuite suffisante pour des notifications peu nombreuses (à vérifier).
- Compteur de limitation de débit partagé (Upstash) : offre gratuite probable.
**Total indicatif : ~25 à ~50 $/mois.** À confirmer sur les grilles tarifaires officielles avant décision.

## 9. Passage en production : prérequis (aucun n'est fait)

1. Valider avec Julien les **documents par assurance**, les **pièces obligatoires / conditionnelles** et les **formats**.
2. Choisir et ouvrir le **stockage** (projet UE, contrat de sous-traitance, sauvegardes), exécuter la migration SQL **après relecture et test**.
3. Écrire l'adaptateur de stockage de production (URL de téléversement signée, téléchargement signé court) — l'interface `StorageAdapter` est prête.
4. Brancher un **antimalware** réel.
5. Activer la **double authentification** et créer le compte de Julien (pas le compte de développement).
6. Compteur de **limitation de débit partagé**.
7. Variables d'environnement de production : `PORTAL_ENABLED`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PORTAL_LINK_KEY`, `PORTAL_ADMIN_EMAILS`, `PORTAL_BASE_URL`, clés du stockage ; notifications : `PORTAL_NOTIFY_ENABLED`, `PORTAL_NOTIFY_TO`.
8. Fixer les **durées de conservation**, le processus de suppression et mettre à jour les **pages légales**.
9. Tests de bout en bout sur un environnement de préproduction avec des données fictives, puis test d'intrusion léger.

## 10. Fonctions non réalisées

Téléchargement groupé (ZIP) ; relances automatiques (politique préparée, non branchée) ; statistiques ; extraction documentaire par IA (nécessiterait une analyse de confidentialité et une validation humaine) ; code d'accès supplémentaire par lien ; adaptateur Supabase.
