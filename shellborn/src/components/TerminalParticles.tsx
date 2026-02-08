"use client";

import { useEffect, useRef } from "react";

export function TerminalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; char: string }[] = [];
    const chars = "01{}[]<>/\\|=+-*&^%$#@!~`.,:;";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.5 + 0.1,
        size: Math.random() * 10 + 8,
        alpha: Math.random() * 0.15 + 0.02,
        char: chars[Math.floor(Math.random() * chars.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(0, 255, 65, ${p.alpha})`;
        ctx.fillText(p.char, p.x, p.y);

        p.x += p.vx;
        p.y += p.vy;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20 || p.x > canvas.width + 20) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
