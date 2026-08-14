"use client";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import MediaLightbox from "./MediaLightbox";
import "./DepthCarousel.css";

export type DepthCarouselItem = {
  image: string;
  alt: string;
  caption: string;
};

type Props = {
  items: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  stageHeight?: number;
  depth?: number;
  spread?: number;
  tilt?: number;
  visibleCards?: number;
  fit?: "contain" | "cover";
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function DepthCarousel({
  items,
  cardWidth = 760,
  cardHeight = 390,
  stageHeight = 520,
  depth = 170,
  spread = 86,
  tilt = 12,
  visibleCards = 3,
  fit = "contain",
  className = "",
}: Props) {
  const data = useMemo(() => items ?? [], [items]);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const positionRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const scaleRef = useRef(1);
  const dragRef = useRef<{ x: number; start: number; id: number; moved: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const layout = useCallback(
    (position: number) => {
      const count = data.length;
      if (!count) return;

      cardRefs.current.forEach((element, index) => {
        if (!element) return;
        let distance = index - position;
        distance = ((distance % count) + count) % count;
        if (distance > count / 2) distance -= count;

        const absolute = Math.abs(distance);
        const shown = absolute <= visibleCards + 0.5;
        const translateX = spread * distance;
        const translateZ = -depth * absolute;
        const rotateY = tilt * clamp(distance, -1, 1);
        const opacity = shown ? clamp(1 - Math.max(0, absolute - visibleCards) * 2, 0, 1) : 0;
        const brightness = clamp(1 - absolute * 0.12, 0.55, 1);
        const blur = absolute > 2 ? Math.min(2.5, (absolute - 2) * 1.3) : 0;

        element.style.transform = `translate(-50%, -50%) scale(${scaleRef.current}) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
        element.style.opacity = String(opacity);
        element.style.filter = `brightness(${brightness}) blur(${blur}px)`;
        element.style.zIndex = String(1000 - Math.round(absolute * 20));
        element.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";
      });
    },
    [data.length, depth, spread, tilt, visibleCards],
  );

  const moveTo = useCallback(
    (rawIndex: number, animate = true) => {
      const count = data.length;
      if (!count) return;
      const index = ((rawIndex % count) + count) % count;
      let delta = index - positionRef.current;
      delta = ((delta % count) + count) % count;
      if (delta > count / 2) delta -= count;

      tweenRef.current?.kill();
      const proxy = { value: positionRef.current };
      tweenRef.current = gsap.to(proxy, {
        value: positionRef.current + delta,
        duration: animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.68 : 0,
        ease: "power3.out",
        onUpdate: () => {
          positionRef.current = proxy.value;
          layout(proxy.value);
        },
        onComplete: () => {
          positionRef.current = ((positionRef.current % count) + count) % count;
          layout(positionRef.current);
        },
      });
      focusRef.current = index;
      setActive(index);
    },
    [data.length, layout],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(([entry]) => {
      const needed = cardWidth + Math.abs(spread) * 2 + 120;
      scaleRef.current = clamp(entry.contentRect.width / needed, 0.26, 1);
      layout(positionRef.current);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [cardWidth, layout, spread]);

  useEffect(() => {
    layout(positionRef.current);
    return () => tweenRef.current?.kill();
  }, [layout]);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey;
    if (!horizontalIntent) return;
    event.preventDefault();
    const direction = (event.deltaX || event.deltaY) > 0 ? 1 : -1;
    moveTo(focusRef.current + direction);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: event.clientX, start: positionRef.current, id: event.pointerId, moved: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = event.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) > 5) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(drag.id);
    }
    if (!drag.moved) return;
    positionRef.current = drag.start - delta / Math.max(cardWidth * scaleRef.current * 0.55, 80);
    layout(positionRef.current);
  };

  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    if (event.currentTarget.hasPointerCapture(drag.id)) event.currentTarget.releasePointerCapture(drag.id);
    moveTo(Math.round(positionRef.current));
  };

  if (!data.length) return null;

  return (
    <>
      <div
        ref={rootRef}
        className={`depth-carousel ${className}`.trim()}
        style={{ height: stageHeight }}
      role="application"
        aria-label="景深图片轮播"
        tabIndex={0}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") moveTo(active - 1);
          if (event.key === "ArrowRight") moveTo(active + 1);
        }}
      >
        <div className="depth-carousel__stage">
          {data.map((item, index) => (
            <button
              type="button"
              key={item.image}
              className="depth-carousel__card"
              ref={(element) => { cardRefs.current[index] = element; }}
              style={{ width: cardWidth, height: cardHeight }}
              aria-label={`${index + 1} / ${data.length}：${item.caption}`}
              aria-current={active === index ? "true" : undefined}
              onClick={() => {
                if (index === active && !dragRef.current?.moved) setLightbox(index);
                else moveTo(index);
              }}
            >
              <img src={item.image} alt={item.alt} loading="lazy" decoding="async" draggable={false} style={{ objectFit: fit }} />
            </button>
          ))}
        </div>
        <button className="depth-carousel__arrow depth-carousel__arrow--prev" type="button" aria-label="上一张" onClick={() => moveTo(active - 1)}>←</button>
        <button className="depth-carousel__arrow depth-carousel__arrow--next" type="button" aria-label="下一张" onClick={() => moveTo(active + 1)}>→</button>
        <div className="depth-carousel__footer">
          <div className="depth-carousel__caption"><span>{String(active + 1).padStart(2, "0")}</span>{data[active].caption}</div>
          <button type="button" onClick={() => setLightbox(active)}>查看完整界面 ↗</button>
        </div>
      </div>
      <MediaLightbox items={data} active={lightbox} onChange={setLightbox} />
    </>
  );
}
