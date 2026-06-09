"use client";

import { MessageCircle, X, Bot } from "lucide-react";
import { useMemo, useState } from "react";
import { chatReplies, chatSuggestions, type ChatSuggestion } from "@/lib/site";

type ChatMessage = {
  id: string;
  role: "assistant" | "visitor";
  text: string;
};

const welcomeMessage =
  "Bonjour 👋 Je suis l’assistant Ruby Assur’. Posez-moi votre question ou choisissez un sujet ci-dessous.";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: welcomeMessage },
  ]);

  const displayedSuggestions = useMemo(() => chatSuggestions, []);

  function handleSuggestion(suggestion: ChatSuggestion) {
    setOpen(true);
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-v`, role: "visitor", text: suggestion },
      { id: `${Date.now()}-a`, role: "assistant", text: chatReplies[suggestion] },
    ]);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <section
          className="mb-3 flex max-h-[min(600px,calc(100svh-100px))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-off-gray bg-white shadow-elevated sm:w-[380px]"
          aria-label="Assistant Ruby Assur’"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-navy px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold">
                <Bot className="h-5 w-5 text-navy" />
              </div>
              <div>
                <p className="text-sm font-semibold">Assistant Ruby Assur’</p>
                <p className="text-xs text-white/60">Réponse immédiate</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fermer le chat"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-off-white px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "visitor" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[86%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                  message.role === "visitor"
                    ? "bg-navy text-white"
                    : "border border-off-gray bg-white text-slate-700 shadow-card"
                }`}>
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="border-t border-off-gray bg-white p-3">
            <p className="mb-2 text-xs text-slate-400">Choisissez un sujet :</p>
            <div className="grid gap-1.5">
              {displayedSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="rounded-xl border border-off-gray bg-off-white px-3 py-2 text-left text-xs font-medium text-navy transition hover:border-navy hover:bg-navy hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">
              Réponses indicatives — sans valeur contractuelle.
            </p>
          </div>
        </section>
      )}

      {/* Bouton flottant — visible et classique */}
      <button
        type="button"
        aria-label={open ? "Fermer l’assistant" : "Ouvrir l’assistant"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 items-center gap-2.5 rounded-full bg-navy px-5 text-sm font-semibold text-white shadow-elevated transition hover:bg-navy-accent"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{open ? "Fermer" : "Un conseil ?"}</span>
      </button>
    </div>
  );
}
