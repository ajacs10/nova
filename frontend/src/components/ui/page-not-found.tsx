'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Frown } from 'lucide-react';

// Combined component for 404 page (NOVA Psychology Platform)
export default function NotFoundPage() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden flex justify-center items-center relative select-none">
      <CircleAnimation />
      <CharactersAnimation />
      <MessageDisplay />
    </div>
  );
}

// 1. Message Display Component
function MessageDisplay() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isPt = locale === 'pt';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Botão de Regressar à Página Inicial no Canto Superior Esquerdo sem Ícone */}
      <div className="absolute top-7 left-7 z-[120]">
        <button
          onClick={() => router.push(`/${locale}`)}
          className="bg-black text-white hover:bg-gray-900 border-2 border-black transition-all duration-300 ease-in-out px-6 py-2.5 rounded-full text-sm font-extrabold hover:scale-105 shadow-xl cursor-pointer"
        >
          {isPt ? 'Página Inicial' : 'Go Home'}
        </button>
      </div>

      <div className="absolute flex flex-col justify-center items-center w-[90%] h-[90%] z-[100]">
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* 404 Grande com o Ícone de Cara Triste no lugar do 0 */}
          <div className="flex items-center justify-center text-[100px] md:text-[140px] font-black text-black leading-none tracking-tighter my-0 drop-shadow-xl select-none">
            <span>4</span>
            <Frown className="w-[75px] h-[75px] md:w-[110px] md:h-[110px] stroke-[2.8] text-black inline-block mx-1.5" />
            <span>4</span>
          </div>

        {/* Título de Acordo com a Plataforma NOVA Psychology */}
        <div className="text-[1.8rem] md:text-[2.3rem] font-black text-black tracking-tight mb-3 text-center drop-shadow-md">
          {isPt ? 'Caminho em Reorientação' : 'Path Under Reorientation'}
        </div>

        {/* Texto Especial sobre o Poder da Mente */}
        <div className="text-[0.98rem] md:text-[1.08rem] w-11/12 md:w-3/4 max-w-[560px] text-center text-black font-semibold opacity-95 leading-relaxed mb-4">
          {isPt
            ? 'A mente é um oceano de possibilidades infinitas. Por vezes, perder uma página é apenas o convite da tua consciência para um momento de pausa, reflexão e reorientação interior.'
            : 'The mind is an ocean of endless possibilities. Sometimes losing a page is simply an invitation from your awareness to pause, reflect, and reorient your focus.'}
        </div>

        <div className="text-xs font-extrabold text-black/70 tracking-wider uppercase mt-1">
          <span>NOVA Psychology</span>
        </div>
      </div>
    </div>
  </>
);
}

// 2. Characters Animation Component
type StickFigure = {
  top?: string;
  bottom?: string;
  svgData: string;
  transform?: string;
  speedX: number;
  speedRotation?: number;
};

function CharactersAnimation() {
  const charactersRef = useRef<HTMLDivElement>(null);

  const stickSVGs = useMemo(() => [
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="4"><circle cx="50" cy="20" r="10"/><path d="M50 30v35M50 40L25 55M50 40l25 15M50 65L30 90M50 65l20 25"/></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="4"><circle cx="50" cy="20" r="10"/><path d="M50 30v35M50 45L20 30M50 45l30-15M50 65L25 85M50 65l25 20"/></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="4"><circle cx="50" cy="20" r="10"/><path d="M50 30v35M50 50L15 65M50 50l35 15M50 65L35 95M50 65l15 30"/></svg>`,
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="black" stroke-width="4"><circle cx="50" cy="25" r="10"/><path d="M50 35v30M50 40L30 20M50 40l20 50M50 65L20 90M50 65l30 25"/></svg>`
  ], []);

  useEffect(() => {
    const charactersContainer = charactersRef.current;
    const stickFigures: StickFigure[] = [
      {
        top: '2%',
        svgData: stickSVGs[0],
        transform: 'rotateZ(90deg)',
        speedX: 1500,
      },
      {
        top: '12%',
        svgData: stickSVGs[1],
        speedX: 3000,
        speedRotation: 2000,
      },
      {
        top: '22%',
        svgData: stickSVGs[2],
        speedX: 5000,
        speedRotation: 1000,
      },
      {
        top: '28%',
        svgData: stickSVGs[0],
        speedX: 2500,
        speedRotation: 1500,
      },
      {
        top: '38%',
        svgData: stickSVGs[3],
        speedX: 2000,
        speedRotation: 300,
      },
      {
        bottom: '5%',
        svgData: stickSVGs[2],
        speedX: 0,
      },
    ];

    if (charactersContainer) {
      charactersContainer.innerHTML = '';
    }

    stickFigures.forEach((figure, index) => {
      const stick = document.createElement('img');
      stick.classList.add('characters');
      stick.style.position = 'absolute';
      stick.style.width = '14%';
      stick.style.height = '14%';

      if (figure.top) stick.style.top = figure.top;
      if (figure.bottom) stick.style.bottom = figure.bottom;

      stick.src = figure.svgData;

      if (figure.transform) stick.style.transform = figure.transform;

      charactersContainer?.appendChild(stick);

      if (index === 5) return;

      // Animação da esquerda para a direita (lado oposto)
      stick.animate(
        [{ left: '-20%' }, { left: '100%' }],
        { duration: figure.speedX, easing: 'linear', fill: 'forwards' }
      );

      if (index === 0) return;

      if (figure.speedRotation) {
        stick.animate(
          [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
          { duration: figure.speedRotation, iterations: Infinity, easing: 'linear' }
        );
      }
    });

    return () => {
      if (charactersContainer) {
        charactersContainer.innerHTML = '';
      }
    };
  }, [stickSVGs]);

  useEffect(() => {
    const handleResize = () => {
      if (charactersRef.current) {
        charactersRef.current.innerHTML = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={charactersRef}
      className="absolute w-[99%] h-[95%] pointer-events-none"
    />
  );
}

// 3. Circle Animation Component (Parte preta no outro lado / expansão invertida)
interface Circulo {
  x: number;
  y: number;
  size: number;
}

function CircleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number | undefined>(undefined);
  const timerRef = useRef(0);
  const circulosRef = useRef<Circulo[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initArr = () => {
      circulosRef.current = [];
      for (let index = 0; index < 300; index++) {
        const randomX = -Math.floor(Math.random() * ((canvas.width * 3) - (canvas.width * 1.2) + 1)) - (canvas.width * 0.2);
        const randomY = Math.floor(Math.random() * (canvas.height - (canvas.height * (-0.2) + 1))) + (canvas.height * (-0.2));
        circulosRef.current.push({ x: randomX, y: randomY, size: canvas.width / 1000 });
      }
    };

    const draw = () => {
      const context = canvas.getContext('2d');
      if (!context) return;
      timerRef.current++;
      const distanceX = canvas.width / 80;
      const growthRate = canvas.width / 1000;
      context.clearRect(0, 0, canvas.width, canvas.height);
      circulosRef.current.forEach((circulo) => {
        if (timerRef.current < 65) {
          circulo.x += distanceX;
          circulo.size += growthRate;
        } else if (timerRef.current < 500) {
          circulo.x += distanceX * 0.02;
          circulo.size += growthRate * 0.2;
        }
        context.beginPath();
        context.arc(circulo.x, circulo.y, circulo.size, 0, 360);
        context.fillStyle = 'white';
        context.fill();
      });
      if (timerRef.current <= 500) requestIdRef.current = requestAnimationFrame(draw);
    };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    timerRef.current = 0;
    initArr();
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      timerRef.current = 0;
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }

      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      initArr();
      draw();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />;
}
