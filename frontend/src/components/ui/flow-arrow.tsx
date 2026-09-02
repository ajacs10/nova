"use client";

import { useId } from "react";

type FlowArrowProps = {
  /** Cor principal do traço (ex: roxo da marca) */
  color?: string;
  /** Cor secundária do gradiente (ponta mais clara) */
  colorLight?: string;
  /** Largura do SVG em px (mantém a proporção do viewBox) */
  width?: number;
  /** Altura do traço animado em px */
  height?: number;
  /** Classe extra para posicionamento (ex: absolute, top-x, right-y) */
  className?: string;
  /** Estilos inline adicionais */
  style?: React.CSSProperties;
};

/**
 * Seta guia animada: começa com um suporte em forma de colchete "]"
 * junto ao título e desce em curva orgânica até à secção seguinte.
 *
 * Uso:
 * <div style={{ position: "relative" }}>
 *   <h1>Compreende a tua mente. Cuida do teu ritmo.</h1>
 *   <FlowArrow className="absolute -right-10 top-0" />
 * </div>
 */
export default function FlowArrow({
  color = "#c084f5",
  colorLight = "#5a4fc4",
  width = 260,
  height = 280,
  className = "",
  style = {},
}: FlowArrowProps) {
  // useId garante que os IDs do <defs> não colidem se o componente
  // for usado mais de uma vez na mesma página
  const uid = useId();
  const arrowId = `flow-arrow-${uid}`;
  const gradId = `flow-grad-${uid}`;

  // Calcula as coordenadas do path dinamicamente com base na altura
  const pathHeight = height * 2.5;
  const curveHeight = pathHeight * 0.8;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 620 ${pathHeight}`}
      className={className}
      style={{ overflow: "visible", pointerEvents: "none", ...style }}
      aria-hidden="true"
    >
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="5"
          refY="8"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M1 2L5 8L9 2"
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      {/* Suporte inicial em forma de colchete "]" */}
      <path
        d="M460 -6 L478 -6 L478 24 L460 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Traço de fundo (estático, dá profundidade) */}
      <path
        d={`M478 9 C 590 9, 600 ${curveHeight * 0.15}, 580 ${curveHeight * 0.3} C 555 ${curveHeight * 0.5}, 470 ${curveHeight * 0.5}, 440 ${curveHeight * 0.7} C 420 ${curveHeight * 0.85}, 380 ${curveHeight * 0.8}, 340 ${curveHeight}`}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Traço animado (o que "flui") */}
      <path
        className="flow-arrow-path"
        d={`M478 9 C 590 9, 600 ${curveHeight * 0.15}, 580 ${curveHeight * 0.3} C 555 ${curveHeight * 0.5}, 470 ${curveHeight * 0.5}, 440 ${curveHeight * 0.7} C 420 ${curveHeight * 0.85}, 380 ${curveHeight * 0.8}, 340 ${curveHeight}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 6"
        markerEnd={`url(#${arrowId})`}
      />

      <circle cx="580" cy={curveHeight * 0.3} r="2.5" fill={color} opacity="0.7" />
      <circle cx="440" cy={curveHeight * 0.7} r="2.5" fill={color} opacity="0.7" />

      <style jsx>{`
        .flow-arrow-path {
          animation: flow-dash 1.4s linear infinite;
        }
        @keyframes flow-dash {
          to {
            stroke-dashoffset: -24;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-arrow-path {
            animation: none;
          }
        }
      `}</style>
    </svg>
  );
}
