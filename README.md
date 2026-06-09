# Ruby Assur' — Site vitrine (démo locale)

Site vitrine de **Ruby Assur'**, courtier en assurances à Pasly & Soissons.
Version de démonstration à faire tourner **en local**, avant toute décision de
nom de domaine / hébergement.

Stack : **Next.js 14** (App Router) · **React 18** · **TypeScript** · **Tailwind CSS**.

---

## 🚀 Lancer le site en local

Prérequis : **Node.js 18.17+** (https://nodejs.org).

```bash
npm install      # une seule fois
npm run dev
```

👉 **http://localhost:3000**

---

## 🐶 Logo

Emblème **samoyède** dessiné en SVG (fourrure ébouriffée), décliné en
`components/Emblem.tsx` : variante `badge` (pastille navy, header/favicon),
`ring` (anneau or, fonds sombres) et `plain` (sans cercle). Net à toutes les
tailles, du favicon 16px au grand format. Les fichiers SVG bruts des variantes
sont aussi disponibles à part.

---

## 💬 Assistant / Chatbot

Un assistant Claude est intégré (bulle en bas à droite, sur toutes les pages)
pour accueillir le visiteur et l'orienter vers la bonne assurance, dans le
respect des règles de courtage (ne donne jamais de prix, de garanties ni de
partenaires inventés).

- **`components/Chatbot.tsx`** — l'interface (côté navigateur)
- **`app/api/chat/route.ts`** — la route serveur (garde la clé API secrète)

### Activer l'assistant IA
Par défaut, sans clé, l'assistant affiche un message renvoyant vers le
formulaire. Pour l'activer pour de vrai :

1. Créer une clé sur https://console.anthropic.com (facturation à l'usage)
2. Copier `.env.example` en `.env.local`
3. Y coller la clé : `ANTHROPIC_API_KEY=...`
4. Relancer `npm run dev`

> 💡 Coût : quelques centimes par conversation. Rien n'est engagé tant qu'aucune
> clé n'est ajoutée. Ne jamais publier `.env.local`.

---

## 📂 Structure

```
ruby-assur-next/
├── app/
│   ├── layout.tsx            # Layout global : fonts, SEO, Header/Footer/Chatbot
│   ├── page.tsx              # Accueil
│   ├── globals.css           # Design system + styles chatbot
│   ├── icon.svg              # Favicon (emblème samoyède)
│   ├── api/chat/route.ts     # Route serveur du chatbot
│   ├── nos-assurances/
│   ├── a-propos/
│   ├── pourquoi-nous/
│   ├── contact/
│   ├── mentions-legales/
│   ├── reclamations/
│   └── confidentialite/
├── components/
│   ├── Header.tsx  Footer.tsx  Emblem.tsx
│   ├── Chatbot.tsx  ContactForm.tsx
│   ├── OriasPill.tsx  CtaBand.tsx  Icons.tsx
├── lib/company.ts            # ⚠️ Infos légales centralisées (à compléter)
├── .env.example              # Clé API du chatbot (optionnelle)
└── package.json
```

---

## ✏️ À compléter avant mise en ligne

Regroupé dans **`lib/company.ts`** (signalé en doré sur le site) :
email réel, téléphone, hébergeur (mentions légales), dates de mise à jour,
section cookies. Penser aussi à remplacer `SITE_URL` dans `app/layout.tsx`
par le vrai domaine pour le SEO/partage social.

Le formulaire de contact est en mode démo (ouvre la messagerie pré-remplie).

---

## ⚖️ Conformité

Activité de **courtage en assurance** : ORIAS visible partout, mentions légales
complètes (SIREN, SIRET, RCS, ORIAS, ACPR), page Réclamations (médiateur) et
politique de confidentialité RGPD. Aucun tarif, partenaire ou garantie inventé.
