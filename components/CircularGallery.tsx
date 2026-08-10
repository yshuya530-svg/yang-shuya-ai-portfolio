"use client";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */

import { useCallback, useMemo, useRef, useState } from "react";
import MediaLightbox, { type LightboxItem } from "./MediaLightbox";
import "./CircularGallery.css";

type CircularItem = { image: string; alt: string; caption: string };

function shortestOffset(index: number, active: number, total: number) {
  let offset = index - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

export default function CircularGallery({ items }: { items: CircularItem[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const startX = useRef<number | null>(null);
  const lightboxItems = useMemo<LightboxItem[]>(() => items, [items]);
  const move = useCallback((step: number) => setActive((value) => (value + step + items.length) % items.length), [items.length]);

  return (
    <>
      <div
        className="circular-gallery"
        aria-label="微视河南实习证据环形画廊"
        role="application"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
        onWheel={(event) => {
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) {
            event.preventDefault();
            move(event.deltaX + event.deltaY > 0 ? 1 : -1);
          }
        }}
        onPointerDown={(event) => { startX.current = event.clientX; }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const delta = event.clientX - startX.current;
          if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
          startX.current = null;
        }}
      >
        <div className="circular-stage">
          {items.map((item, index) => {
            const offset = shortestOffset(index, active, items.length);
            const visible = Math.abs(offset) <= 3;
            return (
              <button
                className={`circular-card${offset === 0 ? " is-active" : ""}`}
                type="button"
                key={item.image}
                style={{
                  "--offset": offset,
                  "--distance": Math.abs(offset),
                  opacity: visible ? Math.max(.18, 1 - Math.abs(offset) * .22) : 0,
                  pointerEvents: visible ? "auto" : "none",
                } as React.CSSProperties}
                onClick={() => offset === 0 ? setLightbox(index) : setActive(index)}
              >
                <span className="circular-image"><img src={item.image} alt={item.alt} loading="lazy" /></span>
                <span className="circular-caption"><b>{String(index + 1).padStart(2, "0")}</b>{item.caption}</span>
              </button>
            );
          })}
        </div>
        <div className="circular-controls">
          <button type="button" onClick={() => move(-1)} aria-label="上一张">←</button>
          <span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => move(1)} aria-label="下一张">→</button>
        </div>
      </div>
      <MediaLightbox items={lightboxItems} active={lightbox} onChange={setLightbox} />
    </>
  );
}
