"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { chatReplies, chatSuggestions, type ChatSuggestion } from "@/lib/site";

type ChatMessage = {
  id: string;
  role: "assistant" | "visitor";
  text: string;
};

const welcomeMessage =
  "Wouaf ! 🐾 Moi c’est Flocon, le samoyède de Ruby Assur’. Je suis là pour vous orienter vers la bonne assurance. Posez-moi votre question !";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: welcomeMessage,
    },
  ]);

  const displayedSuggestions = useMemo(() => chatSuggestions, []);

  function handleSuggestion(suggestion: ChatSuggestion) {
    setOpen(true);
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${suggestion}-visitor`,
        role: "visitor",
        text: suggestion,
      },
      {
        id: `${Date.now()}-${suggestion}-assistant`,
        role: "assistant",
        text: chatReplies[suggestion],
      },
    ]);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open ? (
        <section
          className="mb-3 flex max-h-[min(680px,calc(100svh-120px))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-ruby-line bg-white shadow-soft sm:w-[380px]"
          aria-label="Assistant Ruby Assur’"
        >
          <div className="flex items-center justify-between gap-3 border-b border-ruby-line bg-ruby-navy px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl" aria-hidden="true">🐕</span>
              <div>
                <p className="text-sm font-semibold">Flocon — Ruby Assur’</p>
                <p className="text-xs text-white/70">Samoyède assistant</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Fermer le chat"
              onClick={() => setOpen(false)}
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-ruby-frost px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[86%] rounded-lg px-3 py-2 text-sm leading-6 ${
                    message.role === "visitor"
                      ? "bg-ruby-navy text-white"
                      : "border border-ruby-line bg-white text-ruby-ink"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-ruby-line bg-white p-3">
            <p className="mb-3 rounded-md bg-ruby-sand p-3 text-xs leading-5 text-ruby-ink">
              Les réponses de cet assistant sont données à titre informatif et ne remplacent pas un échange personnalisé avec un courtier.
            </p>
            <div className="grid gap-2">
              {displayedSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="focus-ring rounded-md border border-ruby-line bg-white px-3 py-2 text-left text-sm font-medium text-ruby-navy transition hover:bg-ruby-frost"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        aria-label={open ? "Fermer Flocon" : "Ouvrir Flocon, l’assistant Ruby Assur’"}
        onClick={() => setOpen((value) => !value)}
        className="focus-ring flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-ruby-navy px-4 font-semibold text-white shadow-soft transition hover:bg-ruby-ink"
      >
        <span className="text-xl" aria-hidden="true">🐾</span>
        <span className="hidden text-sm sm:inline">Flocon</span>
      </button>
    </div>
  );
}
