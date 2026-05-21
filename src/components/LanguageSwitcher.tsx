"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTransition } from "react";

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export default function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: "en" | "th") => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className={`flex items-center gap-1 rounded-full p-1 ${
      isScrolled ? "bg-cream/50" : "bg-white/10"
    }`}>
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
          locale === "en"
            ? isScrolled
              ? "bg-gold text-white"
              : "bg-white text-charcoal"
            : isScrolled
              ? "text-charcoal/70 hover:bg-gold/10"
              : "text-white/70 hover:bg-white/10"
        } ${isPending ? "opacity-50" : ""}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("th")}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
          locale === "th"
            ? isScrolled
              ? "bg-gold text-white"
              : "bg-white text-charcoal"
            : isScrolled
              ? "text-charcoal/70 hover:bg-gold/10"
              : "text-white/70 hover:bg-white/10"
        } ${isPending ? "opacity-50" : ""}`}
      >
        TH
      </button>
    </div>
  );
}
