"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Accordéon accessible (boutons + aria-expanded). Les réponses restent dans le DOM (fermées visuellement)
 * pour rester lisibles par les moteurs de recherche et les lecteurs d'écran.
 */
export function FAQ({ items, tone = "light" }: { items: FAQItem[]; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  const dark = tone === "dark";
  return (
    <div className={`divide-y ${dark ? "divide-white/10 border-y border-white/10" : "divide-line border-y border-line"}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={`${base}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold transition sm:text-[1.12rem] ${
                  dark ? "text-white hover:text-champagne-light" : "text-night hover:text-champagne-ink"
                }`}
              >
                <span className="font-body">{item.question}</span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition duration-300 ${
                    dark ? "border-white/25" : "border-night/20"
                  } ${isOpen ? "rotate-45 bg-champagne text-night border-champagne" : ""}`}
                  aria-hidden="true"
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div
              id={`${base}-a-${i}`}
              role="region"
              aria-labelledby={`${base}-q-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className={`max-w-prose pb-6 text-[1rem] leading-7 ${dark ? "text-white/70" : "text-ink-muted"}`}>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
