"use client";

import { useState, useRef, useEffect } from "react";
import Emblem from "./Emblem";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Bonjour 👋 Je suis l'assistant de Ruby Assur'. Je peux vous aider à y voir clair et à trouver l'assurance adaptée à votre situation. Vous cherchez quelque chose pour vous, votre famille, ou votre activité professionnelle ?";

const CHIPS = [
  "Assurance auto",
  "Habitation",
  "Santé / mutuelle",
  "Assurance pro",
  "Demander un devis",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight });
  }, [history, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next = [...history, { role: "user" as const, content: trimmed }];
    setHistory(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setHistory((h) => [...h, { role: "assistant", content: data.reply }]);
    } catch {
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content:
            "Oups, une erreur est survenue. Réessayez, ou utilisez le formulaire de contact.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cbot">
      {!open && (
        <button className="cbot-launch" onClick={() => setOpen(true)}>
          <span>Besoin d&apos;aide&nbsp;?</span>
          <span className="cbot-av">
            <Emblem size={40} variant="badge" />
          </span>
        </button>
      )}

      {open && (
        <div className="cbot-panel">
          <div className="cbot-head">
            <span className="cbot-av">
              <Emblem size={40} variant="badge" />
            </span>
            <div className="cbot-title">
              <b>Assistant Ruby Assur&apos;</b>
              <span>
                <i className="cbot-dot" /> Vous oriente vers la bonne assurance
              </span>
            </div>
            <button className="cbot-x" onClick={() => setOpen(false)} aria-label="Réduire">
              −
            </button>
          </div>

          <div className="cbot-msgs" ref={msgsRef}>
            {history.map((m, i) => (
              <div key={i} className={`cbot-msg ${m.role}`}>
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="cbot-typing">
                <i /><i /><i />
              </div>
            )}
          </div>

          <div className="cbot-chips">
            {CHIPS.map((c) => (
              <button key={c} className="cbot-chip" onClick={() => send(c)} disabled={busy}>
                {c}
              </button>
            ))}
          </div>

          <div className="cbot-foot">
            <textarea
              rows={1}
              value={input}
              placeholder="Écrivez votre message…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button
              className="cbot-send"
              onClick={() => send(input)}
              disabled={busy || !input.trim()}
              aria-label="Envoyer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <div className="cbot-disc">
            Assistant de démonstration · ne remplace pas un conseil personnalisé
          </div>
        </div>
      )}
    </div>
  );
}
