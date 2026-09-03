"use client";

import Link from "next/link";
import { Footer } from "@/shared/ui/Footer";
import { Navbar } from "@/shared/ui/Navbar";

type LegalPageProps = {
  locale: string;
  kind: "privacy" | "terms";
};

type Section = {
  title: string;
  body: string;
};

const content = {
  en: {
    privacy: {
      title: "Privacy Policy",
      intro: "How NOVA collects, uses, stores, and protects personal information.",
      sections: [
        { title: "Information we collect", body: "We collect the name, email address, optional phone number, password hash, profile avatar, check-ins, and technical session information needed to operate the account and protect the service." },
        { title: "How we use information", body: "We use account and check-in information to authenticate users, provide personal dashboards and insights, maintain security, and respond to support requests. We do not sell personal information or use check-ins for personalized advertising." },
        { title: "Storage and security", body: "Passwords are stored as secure hashes. Sessions use HttpOnly cookies and are checked on the server. Check-in records are associated with the authenticated account. No system can guarantee absolute security, so users should protect their credentials." },
        { title: "Cookies and logs", body: "NOVA uses an authentication cookie and essential technical logs such as session creation data, user agent, and IP address for security and operation. We do not currently use advertising cookies." },
        { title: "Retention and deletion", body: "Information is retained while the account is active or while it is needed for service operation and legal obligations. Contact us to request access, correction, or deletion. Requests are reviewed before action is taken." },
        { title: "Third-party services", body: "The current application uses PostgreSQL hosted by Supabase through the backend and Prisma. The application does not expose Supabase credentials or call Supabase directly from the browser." },
        { title: "Contact and changes", body: "Privacy questions can be sent to info@novapsychology.ao. We may update this policy when the service changes and will publish the new version on this page." },
      ] as Section[],
    },
    terms: {
      title: "Terms of Use",
      intro: "Rules for using NOVA psychology responsibly and safely.",
      sections: [
        { title: "Purpose of the service", body: "NOVA provides personal well-being tracking, check-ins, dashboards, and informational insights. It is not a medical device and does not replace diagnosis, treatment, therapy, or professional medical advice." },
        { title: "User accounts", body: "Users must provide accurate information, keep credentials confidential, and notify us of suspected unauthorized access. Each person may use only their own account and must be legally able to accept these terms." },
        { title: "Acceptable use", body: "Users may use NOVA for personal well-being tracking. They must not abuse the service, bypass access controls, probe or disrupt infrastructure, upload malicious content, impersonate others, or attempt to access another user's data." },
        { title: "User content", body: "Users remain responsible for the information and images they submit. Content must be lawful, accurate, and safe to process. Do not submit information that you are not authorized to share." },
        { title: "Availability and responsibility", body: "We work to keep NOVA available and accurate but do not guarantee uninterrupted service or that every insight is correct. Users remain responsible for decisions based on the service and should seek qualified help when needed." },
        { title: "Suspension and changes", body: "We may restrict or close accounts that violate these terms, threaten the service, or create risk for other users. We may change the service or these terms and will publish the updated version on this page." },
        { title: "Contact and last update", body: "Questions about these terms can be sent to info@novapsychology.ao. Last updated: September 2, 2026. This text should be reviewed by qualified legal counsel before production launch." },
      ] as Section[],
    },
  },
  pt: {
    privacy: {
      title: "Política de Privacidade",
      intro: "Como a NOVA recolhe, utiliza, armazena e protege dados pessoais.",
      sections: [
        { title: "Dados recolhidos", body: "Recolhemos nome, endereço de email, telefone opcional, hash da palavra-passe, avatar, check-ins e informações técnicas de sessão necessárias para operar a conta e proteger o serviço." },
        { title: "Utilização dos dados", body: "Utilizamos os dados da conta e dos check-ins para autenticar utilizadores, fornecer painéis e insights pessoais, manter a segurança e responder a pedidos de suporte. Não vendemos dados pessoais nem usamos check-ins para publicidade personalizada." },
        { title: "Armazenamento e segurança", body: "As palavras-passe são armazenadas como hashes seguros. As sessões usam cookies HttpOnly e são verificadas no servidor. Os check-ins ficam associados à conta autenticada. Nenhum sistema garante segurança absoluta, pelo que deves proteger as tuas credenciais." },
        { title: "Cookies e registos", body: "A NOVA utiliza um cookie de autenticação e registos técnicos essenciais, como dados de criação da sessão, user agent e endereço IP, para segurança e funcionamento. Atualmente não utilizamos cookies de publicidade." },
        { title: "Retenção e eliminação", body: "Os dados são mantidos enquanto a conta estiver ativa ou forem necessários para o serviço e obrigações legais. Contacta-nos para pedir acesso, correção ou eliminação. Os pedidos serão analisados antes de qualquer ação." },
        { title: "Serviços externos", body: "A aplicação atual utiliza a sua própria base de dados PostgreSQL e ainda não integra o Supabase. Qualquer fornecedor futuro, incluindo o Supabase, será documentado antes de ser utilizado em produção." },
        { title: "Contacto e alterações", body: "As questões de privacidade podem ser enviadas para info@novapsychology.ao. Podemos atualizar esta política quando o serviço mudar e publicaremos a nova versão nesta página." },
      ] as Section[],
    },
    terms: {
      title: "Termos de Utilização",
      intro: "Regras para utilizar a NOVA psychology de forma responsável e segura.",
      sections: [
        { title: "Finalidade do serviço", body: "A NOVA fornece acompanhamento pessoal de bem-estar, check-ins, painéis e insights informativos. Não é um dispositivo médico e não substitui diagnóstico, tratamento, terapia ou aconselhamento profissional." },
        { title: "Contas de utilizador", body: "Os utilizadores devem fornecer informação correta, proteger as credenciais e avisar-nos sobre acessos suspeitos. Cada pessoa pode utilizar apenas a sua conta e deve ter capacidade legal para aceitar estes termos." },
        { title: "Utilização aceitável", body: "A NOVA deve ser utilizada para acompanhamento pessoal de bem-estar. É proibido abusar do serviço, contornar controlos de acesso, testar ou interromper a infraestrutura, enviar conteúdo malicioso, fazer-se passar por terceiros ou tentar aceder a dados de outra pessoa." },
        { title: "Conteúdo do utilizador", body: "Os utilizadores continuam responsáveis pelas informações e imagens enviadas. O conteúdo deve ser lícito, correto e seguro para processamento. Não envies informação que não estejas autorizado a partilhar." },
        { title: "Disponibilidade e responsabilidade", body: "Trabalhamos para manter a NOVA disponível e correta, mas não garantimos serviço ininterrupto nem que todos os insights estejam corretos. O utilizador é responsável pelas decisões baseadas no serviço e deve procurar ajuda qualificada quando necessário." },
        { title: "Suspensão e alterações", body: "Podemos restringir ou encerrar contas que violem estes termos, ameacem o serviço ou criem risco para outros utilizadores. Podemos alterar o serviço ou estes termos e publicaremos a versão atualizada nesta página." },
        { title: "Contacto e última atualização", body: "As questões sobre estes termos podem ser enviadas para info@novapsychology.ao. Última atualização: 2 de setembro de 2026. Este texto deve ser revisto por assessoria jurídica qualificada antes do lançamento em produção." },
      ] as Section[],
    },
  },
} as const;

export function LegalPage({ locale, kind }: LegalPageProps) {
  const language = locale === "pt" ? "pt" : "en";
  const page = content[language][kind];

  return (
    <div className="legal-page">
      <Navbar />
      <main className="legal-main">
        <header className="legal-header">
          <span>NOVA psychology</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </header>
        <div className="legal-content">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
        <Link href={`/${language}`} className="legal-back">{language === "pt" ? "Voltar à página inicial" : "Back to home"}</Link>
      </main>
      <Footer />
      <style jsx>{`
        .legal-page { min-height: 100vh; background: #060810; color: #fff; }
        .legal-main { max-width: 980px; margin: 0 auto; padding: 132px 24px 72px; }
        .legal-header { max-width: 720px; margin-bottom: 40px; }
        .legal-header span { color: #00d2b5; font-size: .72rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        h1 { margin: 12px 0 10px; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; }
        .legal-header p { margin: 0; color: rgba(255,255,255,.65); line-height: 1.7; }
        .legal-content { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid rgba(255,255,255,.1); }
        section { padding: 26px; background: #0a0e1a; border: 1px solid rgba(255,255,255,.06); }
        h2 { margin: 0 0 10px; font-size: 1.05rem; }
        section p { margin: 0; color: rgba(255,255,255,.68); line-height: 1.75; }
        .legal-back { display: inline-block; margin-top: 24px; color: #00d2b5; font-weight: 700; }
        @media (max-width: 700px) { .legal-main { padding: 112px 16px 48px; } .legal-content { grid-template-columns: 1fr; } section { padding: 22px; } }
      `}</style>
    </div>
  );
}
