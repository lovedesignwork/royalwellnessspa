"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

const COUNTRIES: { code: Country; name: string }[] = [
  { code: "TH", name: "Thailand" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "VN", name: "Vietnam" },
  { code: "PH", name: "Philippines" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "RU", name: "Russia" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "NZ", name: "New Zealand" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "KH", name: "Cambodia" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "GR", name: "Greece" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "LA", name: "Laos" },
  { code: "MV", name: "Maldives" },
  { code: "MM", name: "Myanmar" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "ZA", name: "South Africa" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TR", name: "Turkey" },
];

interface Props {
  name: string;
  defaultCountry?: Country;
  required?: boolean;
  defaultValue?: string;
  hasError?: boolean;
  onChange?: (value: string) => void;
}

export default function CountryPhoneSelector({
  name,
  defaultCountry = "TH",
  required = false,
  defaultValue = "",
  hasError = false,
  onChange,
}: Props) {
  const [country, setCountry] = useState<Country>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = parsePhoneNumber(defaultValue);
        if (parsed?.country) {
          setCountry(parsed.country);
          setPhoneNumber(parsed.nationalNumber || "");
        }
      } catch {
        // ignore parse errors
      }
    }
    setHydrated(true);
  }, [defaultValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const buildFullNumber = useCallback(
    (countryCode: Country, phone: string): string => {
      if (!phone) return "";
      const dial = getCountryCallingCode(countryCode);
      const clean = phone.replace(/\D/g, "");
      return `+${dial}${clean}`;
    },
    []
  );

  const handleCountryChange = useCallback((c: Country) => {
    setCountry(c);
    setIsOpen(false);
    setSearchQuery("");
  }, []);

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    const fullNumber = buildFullNumber(country, value);
    onChange?.(fullNumber);
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCountryCallingCode(c.code).includes(searchQuery)
  );

  const FlagComponent = flags[country];
  const dialCode = hydrated ? getCountryCallingCode(country) : "66";

  return (
    <div
      className={`flex bg-white border ${
        hasError ? "border-red-400" : "border-cream"
      } relative`}
    >
      <input
        type="hidden"
        name={name}
        value={buildFullNumber(country, phoneNumber)}
      />

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((s) => !s)}
          aria-label="Select country code"
          className="flex items-center gap-2 px-3 h-full min-h-[48px] min-w-[100px] bg-transparent border-r border-cream cursor-pointer font-body text-sm text-charcoal hover:bg-gold/5 transition-colors"
        >
          {FlagComponent && (
            <span className="w-5 h-4 overflow-hidden inline-block flex-shrink-0 border border-cream/50">
              <FlagComponent title={country} />
            </span>
          )}
          <span className="font-body text-sm text-charcoal/70" suppressHydrationWarning>
            +{dialCode}
          </span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-charcoal/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-72 max-h-80 bg-white border border-cream shadow-xl z-50 flex flex-col">
            <div className="p-3 border-b border-cream">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full p-2 bg-cream/30 border border-cream font-body text-sm text-charcoal outline-none focus:border-gold"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredCountries.length === 0 ? (
                <div className="p-4 font-body text-sm text-charcoal/50 italic">
                  No country matches &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const Flag = flags[c.code];
                  const active = country === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountryChange(c.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left font-body transition-colors ${
                        active ? "bg-gold/10" : "hover:bg-cream/50"
                      }`}
                    >
                      {Flag && (
                        <span className="w-5 h-4 overflow-hidden inline-block flex-shrink-0 border border-cream/50">
                          <Flag title={c.name} />
                        </span>
                      )}
                      <span
                        className={`flex-1 text-sm ${
                          active ? "text-gold font-medium" : "text-charcoal"
                        }`}
                      >
                        {c.name}
                      </span>
                      <span className="text-sm text-charcoal/50">
                        +{getCountryCallingCode(c.code)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder="89 123 4567"
        required={required}
        autoComplete="tel-national"
        className="flex-1 p-3 bg-transparent border-none font-body text-sm text-charcoal outline-none min-w-0 focus:ring-0"
      />
    </div>
  );
}
