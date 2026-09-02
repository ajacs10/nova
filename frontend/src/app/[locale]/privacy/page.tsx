import { LegalPage } from "@/shared/ui/LegalPage";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  return <LegalPage locale={locale} kind="privacy" />;
}
