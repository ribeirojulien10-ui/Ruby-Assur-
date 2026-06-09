import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      mode: "demo",
      message:
        "Endpoint prévu pour une future connexion de chatbot. La version actuelle du site utilise uniquement des réponses prédéfinies en local.",
    },
    { status: 200 },
  );
}
