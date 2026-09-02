import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { bazinga } from "@/i18n/routing";
import { AppProviders } from "@/shared/lib/AppProviders";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!bazinga.locales.includes(locale as (typeof bazinga.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
