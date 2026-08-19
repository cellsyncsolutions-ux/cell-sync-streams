import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Lang, TranslationKey } from "./translations";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TranslationKey) => string };

const defaultCtx: Ctx = {
  lang: "en",
  setLang: () => {},
  t: (k: TranslationKey) => translations.en[k] ?? k,
};

const LanguageContext = createContext<Ctx>(defaultCtx);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("css-lang") as Lang) || "en";
  });

  useEffect(() => {
    localStorage.setItem("css-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (k: TranslationKey) => translations[lang][k] ?? translations.en[k] ?? k;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);