"use client";

import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { EnergyMascot } from "@/components/ui/energy-mascot";

export interface MoodAvatarItem {
  id: number;
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
  desc: string;
  image: string;
  color: string;
  level: "exaustao" | "cansaco-ligeiro" | "equilibrado" | "bom" | "excelente";
}

export const MOOD_AVATARS: MoodAvatarItem[] = [
  {
    id: 1,
    value: 1,
    label: "Muito Baixo",
    desc: "Sensação de desgaste acentuado ou energia mínima.",
    image: "/mascotes/mascote_exaustao_v2.svg",
    color: "#ef4444",
    level: "exaustao",
  },
  {
    id: 2,
    value: 2,
    label: "Baixo",
    desc: "Ligeiro cansaço ou motivação reduzida.",
    image: "/mascotes/mascote_cansaco_ligeiro_v2.svg",
    color: "#f97316",
    level: "cansaco-ligeiro",
  },
  {
    id: 3,
    value: 3,
    label: "Equilibrado",
    desc: "Estado estável e ritmo normal de dia a dia.",
    image: "/mascotes/mascote_equilibrado_v2.svg",
    color: "#eab308",
    level: "equilibrado",
  },
  {
    id: 4,
    value: 4,
    label: "Bom",
    desc: "Boa disposição, foco e disposição física.",
    image: "/mascotes/mascote_bom_v2.svg",
    color: "#22c55e",
    level: "bom",
  },
  {
    id: 5,
    value: 5,
    label: "Excelente",
    desc: "Energia elevada, ótimo foco e sensação de realização.",
    image: "/mascotes/mascote_excelente_v2.svg",
    color: "#00d2b5",
    level: "excelente",
  },
];

interface MoodAvatarSelectorProps {
  selected: number | null;
  onSelect: (value: 1 | 2 | 3 | 4 | 5 | null) => void;
}

export function MoodAvatarSelector({ selected, onSelect }: MoodAvatarSelectorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-20, 20]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-20, 20]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget as HTMLElement;
    const halfWidth = target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const selectedMood = MOOD_AVATARS.find((m) => m.value === selected);

  // Parábola de altura uniforme
  const getParabolaOffset = (idx: number) => {
    const offsets = [48, 18, 0, 18, 48];
    return offsets[idx] || 0;
  };

  return (
    <div className="mood-avatar-selector">
      <div className="mood-avatar-row">
        {MOOD_AVATARS.map((item, idx) => {
          const isHovered = hoveredIndex === item.id;
          const isSelected = selected === item.value;
          const translateYParabola = getParabolaOffset(idx);

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(item.id)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() =>
                onSelect(isSelected ? null : (item.value as 1 | 2 | 3 | 4 | 5))
              }
              onMouseMove={handleMouseMove}
              className={`mood-avatar-item mood-avatar-item-${idx}`}
              style={{
                position: "relative",
                cursor: "pointer",
                transform: `translateY(${translateYParabola}px)`,
                transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
                zIndex: isSelected || isHovered ? 50 : 10,
              }}
            >
              {/* Tooltip */}
              <AnimatePresence mode="popLayout">
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.7 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 260, damping: 12 },
                    }}
                    exit={{ opacity: 0, y: 12, scale: 0.7 }}
                    style={{
                      translateX,
                      rotate,
                      position: "absolute",
                      bottom: "calc(100% + 16px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 100,
                      background: "rgba(12, 15, 22, 0.96)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(20px)",
                      borderRadius: "14px",
                      padding: "10px 18px",
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                      width: "max-content",
                      maxWidth: 220,
                      whiteSpace: "normal",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        bottom: -1,
                        left: "25%",
                        right: "25%",
                        height: 1,
                        background:
                          "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)",
                      }}
                    />
                    <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9rem" }}>
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.75rem",
                        marginTop: 2,
                        maxWidth: 160,
                      }}
                    >
                      {item.desc}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Círculo */}
              <div
                className={`mood-avatar-circle-wrapper ${
                  isSelected || isHovered ? "is-active" : ""
                }`}
                style={{ position: "relative" }}
              >
                <div
                  className={`mood-avatar-circle ${
                    isSelected ? "is-selected" : isHovered ? "is-hovered" : ""
                  }`}
                >
                  <div className="mood-avatar-image">
                    <EnergyMascot level={item.level} className="h-full w-full" />
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    className="mood-avatar-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Descrição Centralizada */}
      <div className="mood-avatar-description">
        <AnimatePresence mode="wait">
          {selectedMood ? (
            <motion.div
              key={selectedMood.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="mood-avatar-description-content"
            >
              <span className="mood-avatar-label">{selectedMood.label}</span>
              <p className="mood-avatar-desc">{selectedMood.desc}</p>
            </motion.div>
          ) : (
            <div className="mood-avatar-placeholder">
              Selecione uma opção de humor acima
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .mood-avatar-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          width: 100%;
        }

        .mood-avatar-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-top: 52px;
          padding-bottom: 24px;
          width: 100%;
          flex-wrap: nowrap;
        }

        .mood-avatar-item {
          flex-shrink: 0;
        }

        /* ===== DESKTOP (telas grandes) ===== */
        .mood-avatar-circle {
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          background: rgba(255, 255, 255, 0.08);
        }

        /* Centro maior */
        .mood-avatar-item-2 .mood-avatar-circle {
          width: 240px;
          height: 240px;
        }

        /* Laterais */
        .mood-avatar-item-1 .mood-avatar-circle,
        .mood-avatar-item-3 .mood-avatar-circle {
          width: 210px;
          height: 210px;
        }

        .mood-avatar-circle.is-selected {
          border-color: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08),
            0 10px 28px rgba(0, 0, 0, 0.55);
          background: rgba(255, 255, 255, 0.08);
        }

        .mood-avatar-circle.is-hovered {
          border-color: rgba(255, 255, 255, 0.45);
        }

        .mood-avatar-circle-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .mood-avatar-circle-wrapper.is-active {
          transform: scale(1.1) translateY(-8px);
        }

        .mood-avatar-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(2.0);
        }

        .mood-avatar-item-2 .mood-avatar-image {
          transform: scale(2.1);
        }

        .mood-avatar-check {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #00d2b5;
          color: #060810;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
          border: 2px solid #060810;
          z-index: 60;
        }

        .mood-avatar-description {
          min-height: 70px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin: 0 auto;
        }

        .mood-avatar-description-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          width: 100%;
        }

        .mood-avatar-label {
          font-size: 0.95rem;
          font-weight: 700;
          padding: 7px 22px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.06);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.12);
          line-height: 1.3;
        }

        .mood-avatar-desc {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.55);
          max-width: 360px;
          margin: 0 auto;
          line-height: 1.5;
          padding-top: 2px;
        }

        .mood-avatar-placeholder {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.25);
          text-align: center;
        }

        /* ===== TABLETS ===== */
        @media (max-width: 900px) {
          .mood-avatar-row {
            gap: 14px;
            padding-top: 40px;
          }

          .mood-avatar-circle {
            width: 120px;
            height: 120px;
          }

          .mood-avatar-item-1 .mood-avatar-circle,
          .mood-avatar-item-3 .mood-avatar-circle {
            width: 140px;
            height: 140px;
          }

          .mood-avatar-item-2 .mood-avatar-circle {
            width: 165px;
            height: 165px;
          }

          .mood-avatar-image {
            transform: scale(1.55);
          }

          .mood-avatar-check {
            width: 26px;
            height: 26px;
            font-size: 0.8rem;
            bottom: 6px;
            right: 6px;
          }
        }

        /* ===== TELEMÓVEIS ===== */
        @media (max-width: 560px) {
          .mood-avatar-selector {
            gap: 20px;
          }

          .mood-avatar-row {
            gap: 2px;
            padding-top: 32px;
            padding-bottom: 14px;
          }

          .mood-avatar-item {
            min-width: 0;
            flex: 1 1 0;
          }

          .mood-avatar-description-content {
            gap: 10px;
          }

          .mood-avatar-label {
            font-size: 0.82rem;
            padding: 6px 16px;
          }

          .mood-avatar-desc {
            font-size: 0.76rem;
            line-height: 1.4;
            max-width: 280px;
          }

          .mood-avatar-circle {
            width: 12vw;
            height: 12vw;
          }

          .mood-avatar-item-1 .mood-avatar-circle,
          .mood-avatar-item-3 .mood-avatar-circle {
            width: 15vw;
            height: 15vw;
          }

          .mood-avatar-item-2 .mood-avatar-circle {
            width: 18vw;
            height: 18vw;
          }

          .mood-avatar-image {
            transform: scale(1.3);
          }

          .mood-avatar-check {
            width: 22px;
            height: 22px;
            font-size: 0.7rem;
            bottom: 4px;
            right: 4px;
          }
        }

        /* ===== TELEMÓVEIS MUITO PEQUENOS ===== */
        @media (max-width: 400px) {
          .mood-avatar-row {
            gap: 1px;
            padding-top: 26px;
          }

          .mood-avatar-circle {
            width: 12vw;
            height: 12vw;
          }

          .mood-avatar-item-1 .mood-avatar-circle,
          .mood-avatar-item-3 .mood-avatar-circle {
            width: 15vw;
            height: 15vw;
          }

          .mood-avatar-item-2 .mood-avatar-circle {
            width: 18vw;
            height: 18vw;
          }

          .mood-avatar-image {
            transform: scale(1.2);
          }

          .mood-avatar-check {
            width: 18px;
            height: 18px;
            font-size: 0.6rem;
            bottom: 2px;
            right: 2px;
          }
        }
      `}</style>
    </div>
  );
}