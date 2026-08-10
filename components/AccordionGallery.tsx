"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import MediaLightbox, { type LightboxItem } from "./MediaLightbox";
import "./AccordionGallery.css";

type AccordionItem = { image: string; alt: string; caption: string };

export default function AccordionGallery({ items, tone = "blue" }: { items: AccordionItem[]; tone?: "blue" | "orange" }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxItems = useMemo<LightboxItem[]>(() => items, [items]);

  const move = (step: number) => {
    setDirection(step);
    setActive((current) => (current + step + items.length) % items.length);
  };

  const goTo = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  return (
    <>
      <div
        className={`evidence-pager evidence-pager--${tone}`}
        aria-label="小红书公开证据翻页画廊"
      >
        <div className="evidence-pager__toolbar">
          <span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <p>{items[active].caption}</p>
          <div>
            <button type="button" aria-label="上一张" onClick={() => move(-1)}>←</button>
            <button type="button" aria-label="下一张" onClick={() => move(1)}>→</button>
          </div>
        </div>

        <div className="evidence-pager__viewport">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.button
              className="evidence-pager__image"
              type="button"
              key={items[active].image}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 34 : -34 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -34 : 34 }}
              transition={{ duration: .34, ease: [.22, .8, .2, 1] }}
              onClick={() => setLightbox(active)}
              aria-label={`查看大图：${items[active].caption}`}
            >
              <img src={items[active].image} alt={items[active].alt} loading="lazy" draggable="false" />
            </motion.button>
          </AnimatePresence>
        </div>

        <div className="evidence-pager__dots" aria-label="选择图片">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.image}
              className={active === index ? "is-active" : ""}
              onClick={() => goTo(index)}
              aria-label={`第 ${index + 1} 张：${item.caption}`}
              aria-current={active === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
      <MediaLightbox items={lightboxItems} active={lightbox} onChange={setLightbox} />
    </>
  );
}
