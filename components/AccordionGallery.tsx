"use client";

import { useMemo, useState } from "react";
import MediaLightbox, { type LightboxItem } from "./MediaLightbox";
import "./AccordionGallery.css";

type AccordionItem = { image: string; alt: string; caption: string };

export default function AccordionGallery({ items, tone = "blue" }: { items: AccordionItem[]; tone?: "blue" | "orange" }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxItems = useMemo<LightboxItem[]>(() => items, [items]);

  return (
    <>
      <div className={`accordion-gallery accordion-gallery--${tone}`} aria-label="小红书公开证据手风琴画廊">
        <div className="accordion-gallery__rail">
          {items.map((item, index) => {
            const expanded = active === index;
            return (
              <button
                type="button"
                className={`accordion-gallery__panel${expanded ? " is-active" : ""}`}
                key={item.image}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => expanded ? setLightbox(index) : setActive(index)}
                aria-label={`${expanded ? "查看大图" : "展开图片"}：${item.caption}`}
                aria-expanded={expanded}
              >
                <span className="accordion-gallery__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="accordion-gallery__media"><img src={item.image} alt={item.alt} loading="lazy" draggable="false" /></span>
                <span className="accordion-gallery__caption"><b>{item.caption}</b></span>
              </button>
            );
          })}
        </div>
        <p className="accordion-gallery__hint">移到窄条上展开 · 点击完整图片查看原图</p>
      </div>
      <MediaLightbox items={lightboxItems} active={lightbox} onChange={setLightbox} />
    </>
  );
}
