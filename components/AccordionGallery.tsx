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
      <div className={`accordion-gallery accordion-${tone}`} aria-label="小红书证据手风琴画廊">
        {items.map((item, index) => (
          <button
            className={`accordion-panel${active === index ? " is-active" : ""}`}
            type="button"
            key={item.image}
            onClick={() => active === index ? setLightbox(index) : setActive(index)}
          >
            <span className="accordion-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="accordion-image"><img src={item.image} alt={item.alt} loading="lazy" /></span>
            <span className="accordion-caption">{item.caption}</span>
          </button>
        ))}
      </div>
      <MediaLightbox items={lightboxItems} active={lightbox} onChange={setLightbox} />
    </>
  );
}
