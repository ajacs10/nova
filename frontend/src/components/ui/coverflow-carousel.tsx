"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  youtubeId?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  cardWidth?: string;
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(260px, 38vw, 460px)",
  gap = 0.05,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);
  const [activeVideoSlide, setActiveVideoSlide] = React.useState<CoverflowSlide | null>(null);
  const [videoPosition, setVideoPosition] = React.useState({ x: 24, y: 24 });
  const videoDragRef = React.useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);

  // Fechar modal com ESC sem bloquear toda a página
  React.useEffect(() => {
    if (!activeVideoSlide) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideoSlide(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeVideoSlide]);

  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => {
      settle(clamp(Math.round(targetRef.current) + by));
    },
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeVideoSlide) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, iframe, input, textarea, select")) {
      return;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) {
      setSelected(index);
    }
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  const handleCardClick = (index: number, slide: CoverflowSlide) => {
    goTo(index);
    if (slide.youtubeId) {
      setActiveVideoSlide(slide);
    }
  };

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none active:cursor-grabbing select-none"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "calc(var(--cf-card) * 0.62)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="button"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(index, slide);
                  }}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-16/10 overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl will-change-transform border border-white/10 group cursor-pointer",
                    cardClassName
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  <div className="relative h-full w-full">
                    {/* Thumbnail do vídeo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        slide.youtubeId
                          ? `https://img.youtube.com/vi/${slide.youtubeId}/hqdefault.jpg`
                          : slide.src
                      }
                      alt={slide.alt}
                      draggable={false}
                      className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = slide.src;
                      }}
                    />

                    {/* Overlay com Botão de Play */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/20">
                      <button
                        type="button"
                        aria-label={`Reproduzir vídeo ${slide.title ?? "em destaque"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(index, slide);
                        }}
                        className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-2xl backdrop-blur-md transition-transform duration-300 hover:scale-105"
                      >
                        <Play className="ml-1 size-8 fill-white text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur border border-white/20 transition hover:bg-black/80 cursor-pointer"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur border border-white/20 transition hover:bg-black/80 cursor-pointer"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-4 flex flex-col items-center px-6 text-center duration-300 animate-in fade-in"
        >
          <p className="text-xl font-bold tracking-tight text-white">
            {active.title}
          </p>
          {active.subtitle && (
            <p className="mt-1 text-sm text-gray-300">
              {active.subtitle}
            </p>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                index === selected ? "w-8 bg-white opacity-100" : "w-2 bg-white opacity-30"
              )}
            />
          ))}
        </div>
      )}

      {/* Modal de Leitor de Vídeo em Alta Definição */}
      {activeVideoSlide && activeVideoSlide.youtubeId && (
        <div
          style={{
            position: "fixed",
            left: videoPosition.x,
            top: videoPosition.y,
            zIndex: 2147483647,
            width: "min(560px, calc(100vw - 24px))",
            maxWidth: "calc(100vw - 24px)",
            background: "rgba(10, 10, 15, 0.96)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "18px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            overflow: "hidden",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            onPointerDown={(event) => {
              const target = event.target as HTMLElement;
              if (target.closest("button")) return;
              videoDragRef.current = {
                pointerId: event.pointerId,
                offsetX: event.clientX - videoPosition.x,
                offsetY: event.clientY - videoPosition.y,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!videoDragRef.current || videoDragRef.current.pointerId !== event.pointerId) return;

              const nextX = Math.min(window.innerWidth - 320, Math.max(12, event.clientX - videoDragRef.current.offsetX));
              const nextY = Math.min(window.innerHeight - 220, Math.max(12, event.clientY - videoDragRef.current.offsetY));
              setVideoPosition({ x: nextX, y: nextY });
            }}
            onPointerUp={() => {
              videoDragRef.current = null;
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              gap: "12px",
              cursor: "grab",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {activeVideoSlide.title}
              </h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                {activeVideoSlide.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveVideoSlide(null)}
              style={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000" }}>
            <iframe
              key={activeVideoSlide.youtubeId}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              src={`https://www.youtube-nocookie.com/embed/${activeVideoSlide.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1&controls=1&enablejsapi=1`}
              title={activeVideoSlide.title ?? "Video"}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
