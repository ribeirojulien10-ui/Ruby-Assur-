# Direction artistique et design system — Ruby Assur'

## Intention
Une marque numérique **premium, crédible et accessible** : conserver l'identité (bleu marine profond, doré discret, élégance, sérieux, proximité) et la réinterpréter avec plus de finition. Composition **éditoriale** (asymétrie, lignes fines, grandes respirations) au lieu du modèle « titre centré + trois cartes identiques ».

## Jetons (définis une seule fois dans `tailwind.config.ts` et `app/globals.css`)
| Famille | Valeurs |
|---|---|
| Bleu nuit | `night` 900 `#0A1A35` (identique à l'ancien bleu), 950 `#060F20`, 800 `#0F2347`, 700 `#17315E` |
| Neutres chauds | `ivory` `#F6F1E7` (+ `deep`, `soft`), `paper` `#FCFAF6` |
| Or champagne (parcimonie) | `champagne` `#C9A96B`, `light` `#E6D3A9`, `deep` `#94742F` (≥ 3,9:1 sur ivoire, réservé aux grands textes et pictogrammes), **`ink` `#7A5F25` pour le texte sur fond clair** (contraste) |
| Texte | `ink` `#16202F`, `soft`, `muted`, `faint` `#5F6A7D` (≥ 4,8:1) |
| États (portail) | `ok` / `warn` / `danger` / `info` (+ variantes `soft`) — toujours doublés d'un libellé et d'une icône |
| Typographie | **Fraunces** (serif expressive, italiques) pour les titres ; **Inter** pour l'interface |
| Échelle de titres | `display-xl` → `display-sm` + `lead`, fluides (`clamp`) de 320 à 1920 px |
| Rayons / ombres | `sm` 6 px → `2xl` 32 px ; ombres `hairline`, `card`, `lift` (discrètes) |
| Espacements | `section` (fluide), `gutter` (fluide), conteneur `max-w-page` (76 rem) |
| Animations | apparition au défilement en **CSS pur** (`animation-timeline: view()`, sans JavaScript, sans masquage du contenu si non pris en charge), marquee des compagnies, ouverture de menu ; **`prefers-reduced-motion` désactive tout** |

Les anciens noms (`navy`, `gold`, `off`, `ruby`) restent définis et pointent vers la nouvelle palette : les pages légales et le chatbot héritent du nouveau style sans modification.

## Composants (réutilisables, sans abstraction inutile)
`Logo` (monogramme + mot-symbole provisoires) · `Header` (serveur) + `HeaderNav` (menus déroulants accessibles, tiroir mobile plein écran) · `Footer` · `PartnersScroll` · `FAQ` (accordéon accessible) · `CtaBand` · `ProductPage` (2 déclinaisons : particuliers clair / professionnels sombre) · `AudiencePage` · classes `btn-*`, `field`, `card`, `eyebrow`, `link-arrow`.

## Décisions à retenir
- **Aucune photo fictive de Julien** : cadre monogramme (JR) à remplacer par sa photographie.
- **Avis clients toujours masqués** (non vérifiés) ; aucune statistique ni témoignage inventé.
- Aucun logo de compagnie utilisé (mots-symboles) pour ne suggérer aucun partenariat officiel.
- Mise en page **séparée** pour le portail (pas de Google Ads/Analytics/chatbot).
- Pages obsolètes supprimées (`/confidentialite`, `/pourquoi-nous`, `/nos-assurances`) : leurs redirections 301 sont conservées dans `next.config.mjs`.

## Captures
`docs/refonte/avant/` (site actuel en production) et `docs/refonte/apres/` (nouvelle version locale), pages et largeurs comparables.

## Contrastes mesurés (WCAG)
Texte courant ≥ 5,1:1 ; texte secondaire ≥ 4,8:1 ; `champagne-ink` ≥ 5,3:1 ; blanc sur bleu nuit 17:1 ; or sur bleu nuit 7,7:1 ; badges d'état ≥ 4,6:1. Deux valeurs initiales (gris très clair, or) étaient sous les seuils : elles ont été corrigées.
