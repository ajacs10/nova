import { defineRouting } from "next-intl/routing";

export const bazinga = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
