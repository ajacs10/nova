"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export interface MoodStep {
  id: string;
  title: string;
  description: string;
  emoji: string;
  image: string;
}

const CHECKIN_STEPS: MoodStep[] = [
  {
    id: "01",
    title: "Como se sente hoje?",
    description: "Selecione o estado emocional que melhor descreve a sua experiência no dia de hoje.",
    emoji: "😊",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200",
  },
  {
    id: "02",
    title: "Sono & Restabelecimento",
    description: "Indique as horas dormidas e a qualidade do seu descanso para avaliar a recuperação.",
    emoji: "🌙",
    image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?q=80&w=1200",
  },
  {
    id: "03",
    title: "Energia & Trabalho",
    description: "Avalie o seu nível de vitalidade e a intensidade das tarefas de estudo ou trabalho.",
    emoji: "⚡",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1200",
  },
];

const AUTO_PLAY_DURATION = 5000;

export interface VerticalTabsProps {
  steps?: MoodStep[];
  title?: string;
  subtitle?: string;
  onSelectStep?: (index: number) => void;
}

export function VerticalTabs({
  steps = CHECKIN_STEPS,
  title = "Registo de Bem-Estar",
  subtitle = "(CHECK-IN INTERATIVO)",
  onSelectStep,
}: VerticalTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => {
      const next = (prev + 1) % steps.length;
      if (onSelectStep) onSelectStep(next);
      return next;
    });
  }, [steps.length, onSelectStep]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => {
      const next = (prev - 1 + steps.length) % steps.length;
      if (onSelectStep) onSelectStep(next);
      return next;
    });
  }, [steps.length, onSelectStep]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    if (onSelectStep) onSelectStep(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, handleNext]);

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section className="w-full bg-background py-8 md:py-12">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-20 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Coluna da Esquerda: Conteúdo e Abas */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4">
            <div className="space-y-1 mb-8">
              <h2 className="tracking-tighter text-balance text-3xl font-medium md:text-4xl text-foreground">
                {title}
              </h2>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em] block ml-0.5">
                {subtitle}
              </span>
            </div>

            <div className="flex flex-col space-y-0">
              {steps.map((stepItem, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={stepItem.id}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex items-start gap-4 py-6 text-left transition-all duration-500 border-t border-border/50 first:border-0",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground/60 hover:text-foreground"
                    )}
                  >
                    <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px] bg-muted">
                      {isActive && (
                        <motion.div
                          key={`progress-${index}-${isPaused}`}
                          className="absolute top-0 left-0 w-full bg-cyan-400 origin-top"
                          initial={{ height: "0%" }}
                          animate={
                            isPaused ? { height: "0%" } : { height: "100%" }
                          }
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>

                    <span className="text-[12px] font-semibold mt-1 tabular-nums text-cyan-400">
                      /{stepItem.id}
                    </span>

                    <div className="flex flex-col gap-2 flex-1">
                      <span
                        className={cn(
                          "text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-500 flex items-center gap-3",
                          isActive ? "text-white" : "text-gray-400"
                        )}
                      >
                        <span>{stepItem.emoji}</span>
                        <span>{stepItem.title}</span>
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-300 text-sm font-normal leading-relaxed max-w-sm pb-2 mt-1">
                              {stepItem.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna da Direita: Card Interativo com Imagem e Cartão 'Como se sente hoje' sobreposto */}
          <div className="lg:col-span-7 flex flex-col justify-end h-full order-1 lg:order-2">
            <div
              className="relative group/gallery"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-4/3 md:aspect-16/10 rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl">
                <AnimatePresence
                  initial={false}
                  custom={direction}
                  mode="popLayout"
                >
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    onClick={handleNext}
                  >
                    {/* Imagem de Fundo em HD */}
                    <Image
                      src={steps[activeIndex].image}
                      alt={steps[activeIndex].title}
                      fill
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Overlay escuro com degradê elegante */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                    {/* Cartão estilo Vidro Fosco Flutuante "Como se sente hoje?" sobreposto à Imagem */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-black/60 backdrop-blur-xl border border-white/20 p-6 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
                          Passo {steps[activeIndex].id} · Check-in
                        </span>
                        <span className="text-2xl">{steps[activeIndex].emoji}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">
                        {steps[activeIndex].title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                        {steps[activeIndex].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Botões de Navegação flutuantes */}
                <div className="absolute top-6 right-6 flex gap-2 z-30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all active:scale-90"
                    aria-label="Previous"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all active:scale-90"
                    aria-label="Next"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
