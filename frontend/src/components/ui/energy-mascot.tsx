import React from "react";

export type EnergyLevel =
  | "exaustao"
  | "cansaco-ligeiro"
  | "equilibrado"
  | "bom"
  | "excelente";

interface EnergyMascotProps {
  level: EnergyLevel;
  className?: string;
}

/**
 * Mascote animado que representa 5 níveis de energia.
 * Usa <animate>/<animateTransform> (SMIL) — funciona nativamente em Chrome,
 * Firefox e Edge. No Safari, animateTransform tem suporte parcial;
 * se precisares de 100% de compatibilidade, troca por CSS keyframes.
 */
export function EnergyMascot({ level, className = "w-40 h-40" }: EnergyMascotProps) {
  switch (level) {
    case "exaustao":
      return <MascotExaustao className={className} />;
    case "cansaco-ligeiro":
      return <MascotCansacoLigeiro className={className} />;
    case "equilibrado":
      return <MascotEquilibrado className={className} />;
    case "bom":
      return <MascotBom className={className} />;
    case "excelente":
      return <MascotExcelente className={className} />;
  }
}

function MascotExaustao({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 680 380" className={className} role="img" aria-label="Exaustão">
      <ellipse cx="340" cy="330" rx="90" ry="14" fill="#00000014" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 4; 0 0" dur="3.2s" repeatCount="indefinite" />
        <path d="M255 220 Q235 250 245 285" stroke="#9CA3AF" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M425 220 Q445 250 435 285" stroke="#9CA3AF" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M260 260 Q250 180 300 150 Q340 130 380 150 Q430 180 420 260 Q420 300 340 305 Q260 300 260 260 Z" fill="#9CA3AF" />
        <circle cx="340" cy="150" r="62" fill="#B0B7C1" />
        <g>
          <animate attributeName="opacity" values="1;1;0.1;1;1" keyTimes="0;0.85;0.9;0.95;1" dur="4s" repeatCount="indefinite" />
          <path d="M300 150 Q310 158 320 150" stroke="#4B5563" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M360 150 Q370 158 380 150" stroke="#4B5563" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        <path d="M312 182 Q340 172 368 182" stroke="#4B5563" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M296 108 Q310 96 326 104" stroke="#6B7280" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M354 104 Q370 96 384 108" stroke="#6B7280" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="300" cy="200" rx="14" ry="7" fill="#C4A6D1" opacity="0.5" />
        <ellipse cx="380" cy="200" rx="14" ry="7" fill="#C4A6D1" opacity="0.5" />
      </g>
    </svg>
  );
}

function MascotCansacoLigeiro({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 680 380" className={className} role="img" aria-label="Cansaço ligeiro">
      <ellipse cx="340" cy="330" rx="90" ry="14" fill="#00000014" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 3; 0 0" dur="3s" repeatCount="indefinite" />
        <path d="M257 218 Q240 245 250 278" stroke="#E7C873" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M423 218 Q440 245 430 278" stroke="#E7C873" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M262 258 Q252 175 302 148 Q340 128 378 148 Q428 175 418 258 Q418 300 340 305 Q262 300 262 258 Z" fill="#E7C873" />
        <circle cx="340" cy="148" r="62" fill="#F0D488" />
        <g>
          <animate attributeName="opacity" values="1;1;0.1;1;1" keyTimes="0;0.85;0.9;0.95;1" dur="4.5s" repeatCount="indefinite" />
          <path d="M300 148 Q310 154 320 148" stroke="#7A5C1E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M360 148 Q370 154 380 148" stroke="#7A5C1E" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        <path d="M314 180 Q340 176 366 180" stroke="#7A5C1E" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M298 106 Q312 98 326 104" stroke="#B08D2E" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M354 104 Q368 98 382 106" stroke="#B08D2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function MascotEquilibrado({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 680 380" className={className} role="img" aria-label="Equilibrado">
      <ellipse cx="340" cy="330" rx="90" ry="14" fill="#00000014" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 3; 0 0" dur="2.8s" repeatCount="indefinite" />
        <path d="M258 216 Q243 242 253 274" stroke="#6EA8DC" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M422 216 Q437 242 427 274" stroke="#6EA8DC" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M264 256 Q254 172 304 146 Q340 126 376 146 Q426 172 416 256 Q416 300 340 305 Q264 300 264 256 Z" fill="#6EA8DC" />
        <circle cx="340" cy="146" r="62" fill="#8CBCE8" />
        <g>
          <animate attributeName="ry" values="5;5;0.5;5;5" keyTimes="0;0.85;0.9;0.95;1" dur="4s" repeatCount="indefinite" />
          <circle cx="313" cy="148" r="5" fill="#1E3A5F" />
          <circle cx="367" cy="148" r="5" fill="#1E3A5F" />
        </g>
        <path d="M316 182 Q340 190 364 182" stroke="#1E3A5F" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M300 110 Q312 102 326 108" stroke="#3E6FA0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M354 108 Q368 102 380 110" stroke="#3E6FA0" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function MascotBom({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 680 380" className={className} role="img" aria-label="Bom">
      <ellipse cx="340" cy="330" rx="90" ry="14" fill="#00000014" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 3; 0 0" dur="2.6s" repeatCount="indefinite" />
        <path d="M258 214 Q244 240 253 270" stroke="#6BC08A" strokeWidth="16" fill="none" strokeLinecap="round" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 422 214; -25 422 214; 0 422 214" dur="1.3s" repeatCount="indefinite" />
          <path d="M422 214 Q444 195 448 160" stroke="#6BC08A" strokeWidth="16" fill="none" strokeLinecap="round" />
        </g>
        <path d="M264 254 Q254 168 304 144 Q340 124 376 144 Q426 168 416 254 Q416 300 340 306 Q264 300 264 254 Z" fill="#6BC08A" />
        <circle cx="340" cy="144" r="62" fill="#8FD1A6" />
        <g>
          <animate attributeName="ry" values="5;5;0.5;5;5" keyTimes="0;0.85;0.9;0.95;1" dur="4.2s" repeatCount="indefinite" />
          <circle cx="313" cy="146" r="5" fill="#1F4A31" />
          <circle cx="367" cy="146" r="5" fill="#1F4A31" />
        </g>
        <path d="M310 178 Q340 200 370 178" stroke="#1F4A31" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M298 106 Q312 96 328 104" stroke="#33805A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M352 104 Q368 96 382 106" stroke="#33805A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="300" cy="200" r="6" fill="#F4B8C4" opacity="0.6" />
        <circle cx="380" cy="200" r="6" fill="#F4B8C4" opacity="0.6" />
      </g>
    </svg>
  );
}

function MascotExcelente({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 680 380" className={className} role="img" aria-label="Excelente">
      <ellipse cx="340" cy="330" rx="90" ry="14" fill="#00000014" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -6; 0 0" dur="1.6s" repeatCount="indefinite" />
        <g opacity={0.9}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
          <line x1="230" y1="150" x2="205" y2="130" stroke="#F0A93E" strokeWidth="4" strokeLinecap="round" />
          <line x1="225" y1="180" x2="196" y2="180" stroke="#F0A93E" strokeWidth="4" strokeLinecap="round" />
          <line x1="450" y1="150" x2="475" y2="130" stroke="#F0A93E" strokeWidth="4" strokeLinecap="round" />
          <line x1="455" y1="180" x2="484" y2="180" stroke="#F0A93E" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d="M262 252 Q252 162 304 140 Q340 118 376 140 Q428 162 418 252 Q418 300 340 306 Q262 300 262 252 Z" fill="#F2A93A" />
        <path d="M262 210 Q235 190 232 155" stroke="#F2A93A" strokeWidth="20" fill="none" strokeLinecap="round" />
        <path d="M418 210 Q445 190 448 155" stroke="#F2A93A" strokeWidth="20" fill="none" strokeLinecap="round" />
        <circle cx="340" cy="140" r="62" fill="#F7C165" />
        <circle cx="313" cy="142" r="5" fill="#7A3E0A" />
        <circle cx="367" cy="142" r="5" fill="#7A3E0A" />
        <path d="M306 172 Q340 202 374 172" stroke="#7A3E0A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M296 102 Q312 90 330 98" stroke="#B8701A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M350 98 Q368 90 384 102" stroke="#B8701A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="300" cy="196" r="7" fill="#F4B8C4" opacity="0.7" />
        <circle cx="380" cy="196" r="7" fill="#F4B8C4" opacity="0.7" />
      </g>
    </svg>
  );
}

export default EnergyMascot;
