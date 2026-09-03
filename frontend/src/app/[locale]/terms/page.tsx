import { LegalPage } from "@/shared/ui/LegalPage";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string | string[] }>;
};

export default async function TermsPage({ params, searchParams }: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const backHref = query.from === "register" ? `/${locale}/auth/register` : undefined;

  return <LegalPage locale={locale} kind="terms" backHref={backHref} />;
}
