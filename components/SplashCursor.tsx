"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; radius: number; life: number; hue: number };

export default function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let particles: Particle[] = [];
    let frame = 0;
    let lastX = -100;
    let lastY = -100;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const addSplash = (x: number, y: number, force = 1) => {
      for (let index = 0; index < 3 + force * 2; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (.4 + Math.random() * 1.8) * force;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 9 + Math.random() * 20 * force,
          life: 1,
          hue: Math.random() > .28 ? 12 : 68,
        });
      }
      if (particles.length > 120) particles = particles.slice(-120);
    };

    const move = (event: PointerEvent) => {
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance > 9) addSplash(event.clientX, event.clientY, Math.min(1.45, .55 + distance / 60));
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const down = (event: PointerEvent) => addSplash(event.clientX, event.clientY, 2.2);

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.globalCompositeOperation = "multiply";
      particles = particles.filter((particle) => particle.life > .025);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= .95;
        particle.vy *= .95;
        particle.radius *= 1.008;
        particle.life *= .935;
        const color = particle.hue === 12 ? `rgba(211,91,61,${particle.life * .22})` : `rgba(172,181,83,${particle.life * .16})`;
        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
    };
  }, []);

  return <canvas ref={canvasRef} className="splash-cursor" aria-hidden="true" />;
}
