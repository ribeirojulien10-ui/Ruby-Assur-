import { ImageResponse } from "next/og";

export const alt = "Ruby Assur' — Courtier en assurances dans l'Aisne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#0A1A35",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cercle décoratif gold en arrière-plan */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "2px solid rgba(201,162,75,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 480,
            height: 480,
            borderRadius: "50%",
            border: "2px solid rgba(201,162,75,0.1)",
            display: "flex",
          }}
        />

        {/* Contenu gauche */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 80px",
            width: 680,
          }}
        >
          {/* Badge ORIAS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#C9A24B",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(201,162,75,0.9)",
              }}
            >
              Courtier indépendant — ORIAS 24007878
            </span>
          </div>

          {/* Titre */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: "white",
                lineHeight: 1,
              }}
            >
              Ruby
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                color: "#C9A24B",
                lineHeight: 1,
              }}
            >
              {" "}Assur'
            </span>
          </div>

          {/* Sous-titre */}
          <p
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.75)",
              marginTop: 20,
              lineHeight: 1.4,
            }}
          >
            Votre assurance, enfin claire.
          </p>
          <p
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.45)",
              marginTop: 12,
            }}
          >
            Devis gratuit · Réponse sous 24h · Dans l'Aisne et toute la France
          </p>

          {/* URL */}
          <div
            style={{
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 2,
                background: "#C9A24B",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 18,
                color: "#C9A24B",
                fontWeight: 600,
              }}
            >
              rubyassur.fr
            </span>
          </div>
        </div>

        {/* Photo droite */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 520,
            height: 630,
            display: "flex",
          }}
        >
          {/* Dégradé de fondu gauche */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 200,
              height: "100%",
              background: "linear-gradient(to right, #0A1A35, transparent)",
              zIndex: 1,
              display: "flex",
            }}
          />
          <img
            src="https://rubyassur.fr/images/hero-ruby-assur.png"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
