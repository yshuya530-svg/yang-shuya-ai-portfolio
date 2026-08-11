"use client";

import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import "./DepthText.css";

const MAX_LAYERS = 64;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type Props = {
  text: string;
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  fontSize?: string;
  fontWeight?: number;
  shadow?: boolean;
  className?: string;
  style?: CSSProperties;
};

const layerColor = (faceColor: string, depthColor: string, index: number, total: number) => {
  const progress = total <= 1 ? 1 : index / total;
  const eased = progress * progress;
  const faceMix = Math.round((1 - eased) * 72 + 4);
  return `color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor})`;
};

const rotation = (x: number, y: number) => `rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg)`;

export default function DepthText({
  text,
  layers = 18,
  depth = .72,
  faceColor = "#191816",
  depthColor = "#9b8877",
  tilt = 3.2,
  pointerTracking = true,
  smoothing = .14,
  perspective = 1100,
  autoOrbit = false,
  orbitSpeed = .25,
  fontSize = "clamp(3.25rem, 6.6vw, 7rem)",
  fontWeight = 900,
  shadow = false,
  className = "",
  style = {},
}: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS);
  const safeDepth = clamp(Number(depth) || 0, 0, 12);
  const safeTilt = clamp(Number(tilt) || 0, 0, 12);
  const safeSmoothing = clamp(Number(smoothing) || .14, .02, .35);
  const safePerspective = clamp(Number(perspective) || 900, 300, 2000);
  const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2);
  const base = useMemo(() => ({ x: -safeTilt * .22, y: safeTilt * .3 }), [safeTilt]);

  const depthLayers = useMemo(() => Array.from({ length: safeLayers }, (_, layerIndex) => {
    const index = safeLayers - layerIndex;
    return {
      index,
      color: layerColor(faceColor, depthColor, index, safeLayers),
      transform: `translateZ(${-index * safeDepth}px)`,
    };
  }), [depthColor, faceColor, safeDepth, safeLayers]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const canTrack = pointerTracking && finePointer && !reducedMotion;
    const current = { ...base };
    const target = { ...base };
    let frame = 0;
    let activePointer = false;
    const started = performance.now();

    const pointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      activePointer = true;
      const x = clamp((event.clientX - rect.left - rect.width / 2) / (rect.width * .8), -1, 1);
      const y = clamp((event.clientY - rect.top - rect.height / 2) / (rect.height * .8), -1, 1);
      target.x = base.x - y * safeTilt;
      target.y = base.y + x * safeTilt;
    };
    const pointerLeave = () => {
      activePointer = false;
      target.x = base.x;
      target.y = base.y;
    };

    if (canTrack) {
      window.addEventListener("pointermove", pointerMove);
      window.addEventListener("pointerleave", pointerLeave);
      window.addEventListener("blur", pointerLeave);
    }

    const tick = (now: number) => {
      if ((!canTrack || !activePointer) && autoOrbit) {
        const orbit = ((now - started) / 1000) * safeOrbitSpeed * Math.PI * 2;
        target.x = base.x + Math.sin(orbit) * safeTilt * .18;
        target.y = base.y + Math.cos(orbit * .85) * safeTilt * .18;
      }
      current.x += (target.x - current.x) * safeSmoothing;
      current.y += (target.y - current.y) * safeSmoothing;
      stage.style.transform = rotation(current.x, current.y);
      frame = requestAnimationFrame(tick);
    };

    stage.style.transform = rotation(base.x, base.y);
    if (!reducedMotion) frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("blur", pointerLeave);
      cancelAnimationFrame(frame);
    };
  }, [autoOrbit, base, pointerTracking, safeOrbitSpeed, safeSmoothing, safeTilt]);

  const variables = {
    ...style,
    "--depth-text-perspective": `${safePerspective}px`,
    "--depth-text-font-size": fontSize,
    "--depth-text-font-weight": fontWeight,
    "--depth-text-face-color": faceColor,
    "--depth-text-shadow": shadow
      ? `0 16px 28px color-mix(in srgb, ${depthColor} 28%, transparent), 0 3px 7px rgba(0,0,0,.18)`
      : "none",
  } as CSSProperties;

  return (
    <span ref={rootRef} className={`depth-text ${className}`.trim()} style={variables}>
      <span ref={stageRef} className="depth-text__stage">
        {depthLayers.map((layer) => (
          <span aria-hidden="true" className="depth-text__layer" key={layer.index} style={{ color: layer.color, transform: layer.transform }}>
            {text}
          </span>
        ))}
        <span className="depth-text__face">{text}</span>
      </span>
    </span>
  );
}
