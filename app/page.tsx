import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import {
  Shield,
  Heart,
  Users,
  Handshake,
  Car,
  House,
  HeartPulse,
  ShieldCheck,
  Pin,
  Arrow,
} from "@/components/Icons";
import { taglines } from "@/lib/company";

export default function Home() {
  return (
    <>
      {/* HERO PHOTO */}
      <section className="hero-photo">
        <div className="hero-photo-img" />
        <div className="hero-photo-overlay" />
        <div className="wrap hero-photo-inner hero-anim">
          <span className="eyebrow eyebrow-light">
            Courtier local à Pasly / Soissons
          </span>
          <h1 className="hero-title">
            Un conseil clair, humain et <em>indépendant</em> pour protéger ce
            qui compte.
          </h1>
          <p className="lead lead-light">{taglines.hero}</p>
          <div className="hero-cta">
            <Link href="/contact" className="btn btn-light">
              Demander un devis <Arrow />
            </Link>
            <Link href="/nos-assurances" className="btn btn-outline-light">
              Découvrir nos assurances
            </Link>
          </div>
          <div className="hero-trust hero-trust-light">
            <div className="item">
              <Shield size={18} /> Courtier indépendant
            </div>
            <div className="item">
              <ShieldCheck size={18} /> Inscrit ORIAS 24007878
            </div>
            <div className="item">
              <Pin size={18} /> Proximité Pasly &amp; Soissons
            </div>
            <div className="item">
              <Shield size={18} /> Sans maniement de fonds
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="values">
            <div className="values-grid">
              <div className="value">
                <Shield size={38} className="ico" />
                <h4>Protection</h4>
                <p>
                  Des couvertures pensées pour sécuriser votre quotidien et vos
                  projets.
                </p>
              </div>
              <div className="value">
                <Heart size={38} className="ico" />
                <h4>Fidélité</h4>
                <p>
                  Un interlocuteur qui vous suit dans le temps, à chaque étape de
                  votre vie.
                </p>
              </div>
              <div className="value">
                <Users size={38} className="ico" />
                <h4>Proximité</h4>
                <p>
                  Un conseil de terrain, accessible et à votre écoute dans
                  l&apos;Aisne.
                </p>
              </div>
              <div className="value">
                <Handshake size={38} className="ico" />
                <h4>Accompagnement</h4>
                <p>
                  On compare, on explique, on conseille — pour des choix faits en
                  confiance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="eyebrow">Nos domaines</span>
          <h2 className="sec-title">
            Des assurances pour les particuliers et les professionnels
          </h2>
          <p className="sec-intro">
            Ruby Assur&apos; vous accompagne sur un large éventail de besoins.
            Notre rôle de courtier : comparer les solutions du marché et vous
            orienter vers ce qui correspond vraiment à votre situation.
          </p>
          <div className="grid-services">
            <div className="scard">
              <div className="ico">
                <Car />
              </div>
              <h3>Assurance auto</h3>
              <p>
                Pour rouler sereinement, avec une couverture ajustée à votre
                usage.
              </p>
            </div>
            <div className="scard">
              <div className="ico">
                <House />
              </div>
              <h3>Assurance habitation</h3>
              <p>
                Protégez votre logement et vos biens, en location comme en
                propriété.
              </p>
            </div>
            <div className="scard">
              <div className="ico">
                <HeartPulse />
              </div>
              <h3>Santé &amp; mutuelle</h3>
              <p>Une complémentaire santé adaptée à vous et à votre famille.</p>
            </div>
          </div>
          <div style={{ marginTop: 30 }}>
            <Link href="/nos-assurances" className="btn btn-ghost">
              Voir toutes nos assurances <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="eyebrow">Comment ça marche</span>
          <h2 className="sec-title">Trois étapes, zéro jargon</h2>
          <div className="steps">
            <div className="step">
              <div className="n">01</div>
              <h4>On échange</h4>
              <p>
                Vous nous expliquez votre situation et vos besoins. On vous
                écoute, sans engagement.
              </p>
            </div>
            <div className="step">
              <div className="n">02</div>
              <h4>On compare</h4>
              <p>
                En tant que courtier, on étudie les solutions du marché adaptées
                à votre profil.
              </p>
            </div>
            <div className="step">
              <div className="n">03</div>
              <h4>On vous conseille</h4>
              <p>
                On vous présente clairement les options pour décider en toute
                confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <CtaBand
            title="Parlons de votre projet"
            text="Un devis, une question, un besoin précis ? Décrivez-nous votre situation et nous revenons vers vous rapidement."
            cta="Demander un devis ou un rappel"
          />
        </div>
      </section>
    </>
  );
}
