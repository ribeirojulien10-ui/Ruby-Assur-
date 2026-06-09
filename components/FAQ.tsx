"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem { question: string; answer: string; }

export function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-off-gray">
      {items.map((item, i) => (
        <div key={i}>
          <button
            className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-navy"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.question}</span>
            <ChevronDown className={`h-5 w-5 shrink-0 text-gold transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <p className="pb-4 text-sm leading-7 text-slate-600">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
}
