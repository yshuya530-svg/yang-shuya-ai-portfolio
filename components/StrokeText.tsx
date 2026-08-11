"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StrokeText.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type StrokeTextProps = {
  text?: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: "mount" | "scroll" | "hover" | "loop";
  fillMode?: "wipe" | "fade" | "none";
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
};

type TextBox = { x: number; y: number; width: number; height: number };

export default function StrokeText({
  text = "Draw Attention",
  strokeColor = "#191816",
  fillColor = "#191816",
  strokeWidth = 1.4,
  drawDuration = 1.35,
  fillDelay = .12,
  stagger = .05,
  ease = "power2.out",
  trigger = "mount",
  fillMode = "wipe",
  fontSize = 128,
  fontWeight = 900,
  letterSpacing = -4,
  reverse = false,
  className = "",
  style = {},
}: StrokeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const strokeTextRef = useRef<SVGTextElement>(null);
  const wipeRectRef = useRef<SVGRectElement>(null);
  const [box, setBox] = useState<TextBox | null>(null);
  const rawId = useId();
  const wipeId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const characters = useMemo(() => Array.from(String(text ?? "")), [text]);
  const dash = Math.max(fontSize * 7, 200);
  const fontStyle = useMemo(() => ({
    fontSize: `${fontSize}px`,
    fontWeight,
    letterSpacing: `${letterSpacing}px`,
  }), [fontSize, fontWeight, letterSpacing]);

  useLayoutEffect(() => {
    if (!strokeTextRef.current) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled || !strokeTextRef.current) return;
      let bounds: DOMRect;
      try {
        bounds = strokeTextRef.current.getBBox();
      } catch {
        return;
      }
      if (!bounds.width) return;
      const pad = Math.max(Number(strokeWidth) || 1, fontSize * .1);
      const next = {
        x: bounds.x - pad,
        y: bounds.y - pad,
        width: bounds.width + pad * 2,
        height: bounds.height + pad * 2,
      };
      setBox((previous) => previous
        && Math.abs(previous.x - next.x) < .5
        && Math.abs(previous.width - next.width) < .5
        && Math.abs(previous.y - next.y) < .5
        ? previous
        : next);
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => { cancelled = true; };
  }, [characters, fontSize, fontWeight, letterSpacing, strokeWidth]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !box) return;
    const strokes = gsap.utils.toArray<Element>(root.querySelectorAll("[data-stroke-char]"));
    const fills = gsap.utils.toArray<Element>(root.querySelectorAll("[data-fill-char]"));
    const wipe = wipeRectRef.current;
    if (!strokes.length) return;
    const fillEnabled = fillMode !== "none";
    const useWipe = fillEnabled && fillMode === "wipe";
    const fillDuration = Math.max(.4, drawDuration * .5);
    const staggerConfig = reverse ? { each: stagger, from: "end" as const } : stagger;
    const targets = [...strokes, ...fills, ...(wipe ? [wipe] : [])];

    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      gsap.set(fills, { opacity: useWipe ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: 0 } });
    };
    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
      gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: fillEnabled ? box.width : 0 } });
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setEnd();
      return () => gsap.killTweensOf(targets);
    }

    const build = () => {
      setStart();
      const timeline = gsap.timeline({
        paused: true,
        repeat: trigger === "loop" ? -1 : 0,
        repeatDelay: trigger === "loop" ? 1.15 : 0,
        defaults: { overwrite: "auto" },
      });
      timeline.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);
      if (useWipe && wipe) {
        timeline.to(wipe, { attr: { width: box.width }, duration: fillDuration, ease: "power2.inOut" }, drawDuration + fillDelay);
      } else if (fillEnabled) {
        timeline.to(fills, { opacity: 1, duration: fillDuration, ease: "power2.out", stagger: staggerConfig }, drawDuration + fillDelay);
      }
      return timeline;
    };

    let timeline: gsap.core.Timeline | null = null;
    let scrollTrigger: ScrollTrigger | null = null;
    let removeHover: (() => void) | null = null;
    if (trigger === "hover") {
      setEnd();
      const play = () => {
        timeline?.kill();
        timeline = build();
        timeline.play(0);
      };
      root.addEventListener("pointerenter", play);
      removeHover = () => root.removeEventListener("pointerenter", play);
    } else {
      timeline = build();
      if (trigger === "scroll") {
        scrollTrigger = ScrollTrigger.create({ trigger: root, start: "top 82%", once: true, onEnter: () => timeline?.play(0) });
      } else {
        timeline.play(0);
      }
    }
    return () => {
      removeHover?.();
      scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf(targets);
    };
  }, [box, dash, drawDuration, fillDelay, stagger, ease, trigger, fillMode, reverse]);

  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-fontSize} 600 ${fontSize * 1.3}`;
  const customStyle = { ...style, "--stroke-text-height": `${Math.round(fontSize * 1.3)}px` } as CSSProperties;

  return (
    <span ref={rootRef} className={`stroke-text ${trigger === "hover" ? "stroke-text--hover" : ""} ${className}`.trim()} style={customStyle} role="img" aria-label={String(text ?? "")}>
      <svg className="stroke-text__svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {fillMode === "wipe" && box && (
          <defs><clipPath id={wipeId} clipPathUnits="userSpaceOnUse"><rect ref={wipeRectRef} x={box.x} y={box.y} width="0" height={box.height} /></clipPath></defs>
        )}
        <text ref={strokeTextRef} className="stroke-text__stroke" x="0" y="0" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" style={fontStyle}>
          {characters.map((character, index) => <tspan data-stroke-char key={`s-${index}`}>{character}</tspan>)}
        </text>
        <text className="stroke-text__fill" x="0" y="0" fill={fillColor} stroke="none" style={fontStyle} clipPath={fillMode === "wipe" && box ? `url(#${wipeId})` : undefined}>
          {characters.map((character, index) => <tspan data-fill-char key={`f-${index}`}>{character}</tspan>)}
        </text>
      </svg>
    </span>
  );
}
