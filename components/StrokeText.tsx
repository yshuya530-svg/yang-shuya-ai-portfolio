"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StrokeText.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type StrokeTextProps = {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  className?: string;
  delay?: number;
};

export default function StrokeText({
  text,
  strokeColor = "#191816",
  fillColor = "#191816",
  strokeWidth = 1.35,
  fontSize = 104,
  fontWeight = 900,
  letterSpacing = -5,
  className = "",
  delay = 0,
}: StrokeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const wipeRef = useRef<SVGRectElement>(null);
  const [box, setBox] = useState({ x: 0, y: -fontSize, width: fontSize * 7, height: fontSize * 1.28 });
  const rawId = useId();
  const clipId = `stroke-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const chars = useMemo(() => Array.from(text), [text]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!measureRef.current) return;
      const next = measureRef.current.getBBox();
      if (!next.width) return;
      const pad = Math.max(strokeWidth * 2, fontSize * 0.06);
      setBox({ x: next.x - pad, y: next.y - pad, width: next.width + pad * 2, height: next.height + pad * 2 });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
  }, [fontSize, fontWeight, letterSpacing, strokeWidth, text]);

  useEffect(() => {
    if (!rootRef.current || !wipeRef.current || !box.width) return;
    const strokes = rootRef.current.querySelectorAll("[data-stroke-char]");
    const dash = Math.max(fontSize * 8, 300);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reduced) {
        gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
        gsap.set(wipeRef.current, { attr: { width: box.width } });
        return;
      }
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      gsap.set(wipeRef.current, { attr: { width: 0 } });
      const timeline = gsap.timeline({ delay });
      timeline.to(strokes, { strokeDashoffset: 0, duration: 1.25, ease: "power2.out", stagger: 0.035 });
      timeline.to(wipeRef.current, { attr: { width: box.width }, duration: 0.72, ease: "power2.inOut" }, "-=.38");
    }, rootRef);
    return () => context.revert();
  }, [box.width, delay, fontSize]);

  const fontStyle = { fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` };

  return (
    <span ref={rootRef} className={`stroke-text ${className}`.trim()} role="img" aria-label={text}>
      <svg className="stroke-text__svg" viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`} preserveAspectRatio="xMinYMid meet" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect ref={wipeRef} x={box.x} y={box.y} width="0" height={box.height} />
          </clipPath>
        </defs>
        <text ref={measureRef} x="0" y="0" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" style={fontStyle}>
          {chars.map((char, index) => <tspan data-stroke-char key={`stroke-${index}`}>{char}</tspan>)}
        </text>
        <text x="0" y="0" fill={fillColor} style={fontStyle} clipPath={`url(#${clipId})`}>
          {chars.map((char, index) => <tspan key={`fill-${index}`}>{char}</tspan>)}
        </text>
      </svg>
    </span>
  );
}
