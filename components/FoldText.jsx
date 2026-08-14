"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import "./FoldText.css";

const HINGE_CONFIG = {
  top: { origin: "50% 0%", rotateX: -92, rotateY: 0 },
  bottom: { origin: "50% 100%", rotateX: 92, rotateY: 0 },
  left: { origin: "0% 50%", rotateX: 0, rotateY: 92 },
  right: { origin: "100% 50%", rotateX: 0, rotateY: -92 },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function FoldText({
  text,
  hinge = "top",
  duration = 0.65,
  stagger = 0.045,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.55,
  fontSize = 80,
  fontWeight = 800,
  color = "currentColor",
  className = "",
}) {
  const rootRef = useRef(null);
  const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const segments = useMemo(() => Array.from(text).map((char, index) => (
    <span
      className="fold-text-segment"
      key={`${char}-${index}`}
      style={{ "--fold-perspective": `${safePerspective}px` }}
    >
      <span
        className="fold-text-piece"
        data-fold-hinge={hinge}
        style={{ transformOrigin: hingeConfig.origin, "--fold-crease": 0 }}
      >
        {char === " " ? "\u00a0" : char}
      </span>
    </span>
  )), [text, hinge, hingeConfig.origin, safePerspective]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const pieces = Array.from(root.querySelectorAll(".fold-text-piece"));
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const animation = gsap.fromTo(pieces, {
      opacity: 0,
      rotateX: reduceMotion ? 0 : hingeConfig.rotateX,
      rotateY: reduceMotion ? 0 : hingeConfig.rotateY,
      "--fold-crease": reduceMotion ? 0 : safeCrease,
      transformOrigin: hingeConfig.origin,
      force3D: true,
    }, {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      "--fold-crease": 0,
      duration: reduceMotion ? Math.min(duration, 0.22) : duration,
      ease: reduceMotion ? "power1.out" : ease,
      stagger: reduceMotion ? Math.min(stagger, 0.02) : stagger,
      clearProps: "willChange",
    });

    return () => animation.kill();
  }, [duration, ease, hingeConfig, safeCrease, stagger, text]);

  return (
    <span
      ref={rootRef}
      className={`fold-text ${className}`.trim()}
      style={{
        "--fold-text-font-size": typeof fontSize === "number" ? `${fontSize}px` : fontSize,
        "--fold-text-font-weight": fontWeight,
        "--fold-text-color": color,
      }}
    >
      <span className="fold-text-sr-only">{text}</span>
      <span className="fold-text-visual" aria-hidden="true">{segments}</span>
    </span>
  );
}
