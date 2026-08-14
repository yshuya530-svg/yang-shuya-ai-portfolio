"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import MediaLightbox, { type LightboxItem } from "./MediaLightbox";
import "./BounceCards.css";

type BounceItem = { image: string; alt: string; caption: string };

export default function BounceCards({ items }: { items: BounceItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(Math.floor(items.length / 2));
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxItems = useMemo<LightboxItem[]>(() => items, [items]);

  useEffect(() => {
    if (!rootRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(".bounce-card", { y: 120, scale: .65, opacity: 0 }, {
        y: 0, scale: 1, opacity: 1, duration: .85, stagger: .055, ease: "elastic.out(1,.78)",
      });
    }, rootRef);
    return () => context.revert();
  }, []);

  return (
    <>
      <div className="bounce-cards" ref={rootRef} aria-label="微视河南实习证据弹跳卡片">
        <div className="bounce-cards__stage">
          {items.map((item, index) => {
            const offset = index - active;
            return (
              <button
                type="button"
                className={`bounce-card${index === active ? " is-active" : ""}`}
                key={item.image}
                style={{
                  "--bounce-offset": offset,
                  "--bounce-distance": Math.abs(offset),
                  zIndex: index === active ? items.length + 2 : items.length - Math.abs(offset),
                } as React.CSSProperties}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => index === active ? setLightbox(index) : setActive(index)}
              >
                <span className="bounce-card__image"><img src={item.image} alt={item.alt} loading="lazy" /></span>
                <span className="bounce-card__caption"><b>{String(index + 1).padStart(2, "0")}</b>{item.caption}</span>
              </button>
            );
          })}
        </div>
        <p>移动到卡片上展开 · 点击当前卡片查看完整大图</p>
      </div>
      <MediaLightbox items={lightboxItems} active={lightbox} onChange={setLightbox} />
    </>
  );
}
