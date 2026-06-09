import { NextResponse } from "next/server";

// Route serveur : relaie les messages vers l'API Claude SANS exposer la clé au navigateur.
// Active dès qu'une clé ANTHROPIC_API_KEY est présente (voir .env.example).

export const runtime = "nodejs";

const SYSTEM = `Tu es l'assistant virtuel de Ruby Assur', cabinet de courtage en assurances basé à Pasly, près de Soissons (Aisne), dirigé par Julien Ribeiro. Ruby Assur' est un courtier INDÉPENDANT inscrit à l'ORIAS (n° 24007878), sans maniement de fonds.

TON RÔLE : accueillir chaleureusement, comprendre le besoin du visiteur, et l'orienter vers le bon type d'assurance. Ruby Assur' accompagne particuliers et professionnels sur : assurance auto, habitation, santé/mutuelle, prévoyance, emprunteur, assurance professionnelle, multirisque professionnelle, responsabilité civile professionnelle, et autres besoins.

COMPORTEMENT :
- Réponds en français, ton clair, humain, rassurant et professionnel, sans jargon.
- Sois CONCIS : 2 à 4 phrases maximum. Pose UNE question à la fois pour cerner le besoin.
- Rappelle si utile qu'en tant que courtier, Ruby Assur' compare les solutions du marché et conseille selon la situation du client.
- Dès que le besoin est clair, invite à demander un devis ou un rappel via le formulaire de contact du site.

RÈGLES STRICTES (conformité courtage) :
- N'invente JAMAIS de tarifs, montants, pourcentages, garanties précises, plafonds, ni noms de compagnies ou partenaires assureurs.
- Ne promets jamais le « meilleur prix » ni « l'assurance la moins chère ».
- Ne donne pas de conseil juridique ou financier définitif ; pour un cas précis, propose un échange avec un conseiller Ruby Assur'.
- Si on te demande un prix, explique qu'il dépend de la situation et propose d'établir un devis personnalisé.
- Reste dans le périmètre de l'assurance et de Ruby Assur'. Recadre poliment toute question hors sujet.

COORDONNÉES (si demandé) : Ruby Assur', 44 avenue du Bois Roger, 02200 Pasly. Email et téléphone à venir — invite à utiliser le formulaire de contact du site.`;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Mode démo locale sans clé : on renvoie un message clair plutôt qu'une erreur.
    return NextResponse.json({
      reply:
        "👋 L'assistant n'est pas encore activé sur cette version locale (clé API manquante). En attendant, vous pouvez décrire votre besoin via le formulaire de contact et Ruby Assur' vous recontactera.",
      demo: true,
    });
  }

  try {
    const { messages } = await req.json();

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM,
        messages,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { reply: "Désolé, une erreur est survenue. Réessayez dans un instant." },
        { status: 200 }
      );
    }

    const data = await res.json();
    const reply =
      (data.content || [])
        .map((b: { type: string; text?: string }) => (b.type === "text" ? b.text : ""))
        .join("")
        .trim() || "Désolé, je n'ai pas pu répondre. Pouvez-vous reformuler ?";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      {
        reply:
          "Oups, une erreur est survenue. Réessayez, ou contactez Ruby Assur' via le formulaire de contact.",
      },
      { status: 200 }
    );
  }
}
