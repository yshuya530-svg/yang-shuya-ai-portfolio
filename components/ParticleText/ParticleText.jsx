"use client";
/* eslint-disable react/prop-types */

import { useEffect, useRef } from "react";
import "./ParticleText.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return { r: 25, g: 24, b: 22 };
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

const mixColor = (from, to, amount) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return `rgb(${Math.round(a.r + (b.r - a.r) * amount)}, ${Math.round(a.g + (b.g - a.g) * amount)}, ${Math.round(a.b + (b.b - a.b) * amount)})`;
};

export default function ParticleText({
  text,
  className = "",
  color = "#191816",
  highlightColor = "#c95d42",
  fontSize = "clamp(3rem, 6vw, 6.5rem)",
  fontWeight = 900,
  density = 4,
  particleSize = 2,
  scatter = 130,
  gatherDuration = 1500,
  pointerRepel = 34,
  repelRadius = 110,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let particles = [];
    let frame = 0;
    let resizeFrame = 0;
    let width = 0;
    let height = 0;
    let start = performance.now();
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const pointer = { active: false, x: 0, y: 0 };

    const resolveFontSize = () => {
      const probe = document.createElement("span");
      probe.style.cssText = `position:absolute;visibility:hidden;font-size:${fontSize};font-weight:${fontWeight};font-family:inherit`;
      probe.textContent = "M";
      container.appendChild(probe);
      const result = parseFloat(getComputedStyle(probe).fontSize) || 80;
      probe.remove();
      return result;
    };

    const build = async () => {
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const family = getComputedStyle(container).fontFamily || "sans-serif";
      let size = resolveFontSize();
      const lines = String(text).split("\n");
      const offscreen = document.createElement("canvas");
      const off = offscreen.getContext("2d", { willReadFrequently: true });
      if (!off) return;
      const maxLineWidth = width * 0.94;
      off.font = `${fontWeight} ${size}px ${family}`;
      const widest = Math.max(...lines.map((line) => off.measureText(line).width));
      if (widest > maxLineWidth) size *= maxLineWidth / widest;
      const lineHeight = size * 1.02;
      const blockHeight = lineHeight * lines.length;
      offscreen.width = Math.ceil(width);
      offscreen.height = Math.ceil(blockHeight + size * 0.3);
      off.font = `${fontWeight} ${size}px ${family}`;
      off.textAlign = "left";
      off.textBaseline = "top";
      off.fillStyle = "#fff";
      lines.forEach((line, index) => off.fillText(line, width * 0.02, index * lineHeight));

      const pixels = off.getImageData(0, 0, offscreen.width, offscreen.height);
      const targets = [];
      const step = Math.max(2, Math.floor(density));
      const yOffset = Math.max(0, (height - blockHeight) / 2);
      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const alpha = pixels.data[(y * offscreen.width + x) * 4 + 3];
          if (alpha > 45) targets.push({ x, y: y + yOffset, alpha: alpha / 255 });
        }
      }
      const maxParticles = Math.min(7600, Math.max(1600, Math.floor(width * height / 54)));
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      particles = targets.filter((_, index) => index % stride === 0).map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const angle = seed * Math.PI * 2;
        const distance = reducedMotion ? 0 : scatter * (0.35 + seed * 0.75);
        return {
          x: target.x + Math.cos(angle) * distance,
          y: target.y + Math.sin(angle) * distance,
          startX: target.x + Math.cos(angle) * distance,
          startY: target.y + Math.sin(angle) * distance,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.75, particleSize * (0.7 + target.alpha * 0.5)),
          color: target.y < height / 2
            ? mixColor(color, highlightColor, seed > .92 ? .22 : 0)
            : mixColor(color, highlightColor, seed > .9 ? .78 : 1),
          delay: reducedMotion ? 0 : seed * 380,
        };
      });
      start = performance.now();
    };

    const render = (now) => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        const progress = reducedMotion ? 1 : clamp((now - start - particle.delay) / gatherDuration, 0, 1);
        const eased = easeOutCubic(progress);
        let targetX = particle.startX + (particle.targetX - particle.startX) * eased;
        let targetY = particle.startY + (particle.targetY - particle.startY) * eased;
        if (pointer.active && !reducedMotion) {
          const dx = targetX - pointer.x;
          const dy = targetY - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 0 && distance < repelRadius) {
            const force = Math.pow(1 - distance / repelRadius, 2) * pointerRepel;
            targetX += dx / distance * force;
            targetY += dy / distance * force;
          }
        }
        particle.x += (targetX - particle.x) * (reducedMotion ? 1 : 0.22);
        particle.y += (targetY - particle.y) * (reducedMotion ? 1 : 0.22);
        context.globalAlpha = 0.35 + progress * 0.65;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      frame = requestAnimationFrame(render);
    };

    const queueBuild = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    };
    const move = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    const resizeObserver = new ResizeObserver(queueBuild);
    resizeObserver.observe(container);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    build();
    frame = requestAnimationFrame(render);
    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
    };
  }, [color, density, fontSize, fontWeight, gatherDuration, highlightColor, particleSize, pointerRepel, repelRadius, scatter, text]);

  return (
    <div ref={containerRef} className={`particle-text ${className}`} role="img" aria-label={text.replace("\n", " ")}>
      <canvas ref={canvasRef} className="particle-text__canvas" aria-hidden="true" />
      <span className="particle-text__sr">{text}</span>
    </div>
  );
}
