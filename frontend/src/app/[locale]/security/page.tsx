"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Footer } from "@/shared/ui/Footer";
import { Navbar } from "@/shared/ui/Navbar";

export default function SecurityPolicyPage() {
  const params = useParams();
  const isPt = ((params?.locale as string) || "pt") === "pt";

  const sections = isPt
    ? [
        {
          title: "Dados que utilizamos",
          body: "Recolhemos os dados necessários para criar a tua conta e prestar a experiência NOVA: nome, email, telefone opcional, dados dos check-ins, preferências e informações técnicas essenciais para segurança e funcionamento.",
        },
        {
          title: "Finalidade dos dados",
          body: "Os dados dos check-ins são usados para apresentar métricas, identificar padrões de bem-estar e gerar insights dentro da tua conta. Não usamos os teus registos para publicidade personalizada nem vendemos dados pessoais.",
        },
        {
          title: "Sessão e acesso",
          body: "As áreas privadas exigem uma sessão autenticada. Os tokens de sessão são enviados em cookies HttpOnly, protegidos por SameSite e revogados no logout. O acesso é negado por defeito quando a sessão é inválida ou expirada.",
        },
        {
          title: "Uploads de imagem",
          body: "Avatares aceitam apenas JPEG, PNG e WebP. O conteúdo é validado por assinatura binária real, limitado a 2 MB e processado para WebP 256x256. A saída sanitizada não preserva metadados EXIF, GPS ou outros metadados de origem.",
        },
        {
          title: "Proteção técnica",
          body: "Aplicamos validação de entrada, ORM parametrizado, CORS restrito, cabeçalhos de segurança, limites de request, mensagens de erro genéricas e proteção contra exposição de tokens, palavras-passe, caminhos internos e outros segredos.",
        },
        {
          title: "Retenção e eliminação",
          body: "Conservamos os dados enquanto a conta estiver ativa ou enquanto forem necessários para prestar o serviço e cumprir obrigações aplicáveis. Podes pedir a correção ou eliminação dos teus dados através do contacto abaixo.",
        },
        {
          title: "Os teus direitos",
          body: "Podes pedir acesso, correção, atualização ou eliminação dos teus dados pessoais, bem como esclarecimentos sobre o seu uso. Também podes terminar a sessão a qualquer momento e alterar a palavra-passe nas Configurações.",
        },
        {
          title: "Uso responsável",
          body: "A NOVA é uma ferramenta de acompanhamento de bem-estar e não substitui diagnóstico, tratamento ou aconselhamento de um profissional de saúde. Em situações urgentes, procura os serviços de emergência ou apoio adequados.",
        },
      ]
    : [
        {
          title: "Data we use",
          body: "We collect the data needed to create your account and provide NOVA: name, email, optional phone number, check-in data, preferences, and essential technical information for security and operation.",
        },
        {
          title: "Why we use it",
          body: "Check-in data is used to show metrics, identify well-being patterns, and generate insights inside your account. We do not use your records for personalized advertising or sell personal data.",
        },
        {
          title: "Sessions and access",
          body: "Private areas require an authenticated session. Session tokens are sent in HttpOnly cookies, protected with SameSite, and revoked on logout. Access is denied by default when a session is invalid or expired.",
        },
        {
          title: "Image uploads",
          body: "Avatars accept JPEG, PNG, and WebP only. Content is checked using real binary signatures, limited to 2 MB, and processed into 256x256 WebP. Sanitized output does not preserve EXIF, GPS, or other source metadata.",
        },
        {
          title: "Technical protection",
          body: "We apply input validation, parameterized ORM queries, restricted CORS, security headers, request limits, generic error messages, and protection against exposing tokens, passwords, internal paths, and other secrets.",
        },
        {
          title: "Retention and deletion",
          body: "We retain data while your account is active or as needed to provide the service and meet applicable obligations. You can request correction or deletion of your data through the contact below.",
        },
        {
          title: "Your rights",
          body: "You may request access, correction, updates, or deletion of your personal data, and ask how it is used. You can also sign out at any time and change your password in Settings.",
        },
        {
          title: "Responsible use",
          body: "NOVA is a well-being tracking tool and does not replace diagnosis, treatment, or advice from a health professional. In an urgent situation, contact appropriate emergency or support services.",
        },
      ];

  return (
    <div className="policy-page">
      <Navbar />
      <main className="policy-main">
        <div className="policy-header">
          <span className="policy-kicker">NOVA psychology</span>
          <h1>{isPt ? "Política de Segurança e Privacidade" : "Security and Privacy Policy"}</h1>
          <p>
            {isPt
              ? "Como protegemos os teus dados e mantemos a plataforma segura."
              : "How we protect your data and keep the platform secure."}
          </p>
        </div>

        <div className="policy-content">
          {sections.map((section) => (
            <section className="policy-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <div className="policy-contact">
          <h2>{isPt ? "Contacto" : "Contact"}</h2>
          <p>
            {isPt ? "Para questões sobre privacidade ou segurança, escreve para" : "For privacy or security questions, email"}{" "}
            <a href="mailto:info@novapsychology.ao">info@novapsychology.ao</a>.
          </p>
          <Link href={`/${isPt ? "pt" : "en"}`} className="back-link">
            {isPt ? "Voltar à página inicial" : "Back to home"}
          </Link>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .policy-page { min-height: 100vh; background: #060810; color: #fff; }
        .policy-main { max-width: 980px; margin: 0 auto; padding: 132px 24px 72px; }
        .policy-header { max-width: 720px; margin-bottom: 40px; }
        .policy-kicker { color: #00d2b5; font-size: .72rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        h1 { margin: 12px 0 10px; color: #fff; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; }
        .policy-header p { margin: 0; color: rgba(255,255,255,.62); font-size: 1rem; }
        .policy-content { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.08); }
        .policy-section { padding: 26px; background: #0a0e1a; }
        .policy-section h2, .policy-contact h2 { margin: 0 0 10px; color: #fff; font-size: 1.05rem; }
        .policy-section p, .policy-contact p { margin: 0; color: rgba(255,255,255,.65); font-size: .9rem; line-height: 1.75; }
        .policy-contact { margin-top: 24px; padding: 26px; border: 1px solid rgba(255,255,255,.08); background: #0a0e1a; }
        .policy-contact a { color: #00d2b5; }
        .back-link { display: inline-block; margin-top: 18px; color: #fff !important; font-size: .86rem; font-weight: 700; text-decoration: none; }
        @media (max-width: 700px) { .policy-main { padding: 112px 16px 48px; } .policy-content { grid-template-columns: 1fr; } .policy-section { padding: 22px; } }
      `}</style>
    </div>
  );
}
