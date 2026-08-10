"use client";

import { useEffect } from "react";

export type LightboxItem = {
  image: string;
  alt: string;
  caption: string;
};

type Props = {
  items: LightboxItem[];
  active: number | null;
  onChange: (index: number | null) => void;
};

export default function MediaLightbox({ items, active, onChange }: Props) {
  useEffect(() => {
    if (active === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onChange(null);
      if (event.key === "ArrowRight") onChange((active + 1) % items.length);
      if (event.key === "ArrowLeft") onChange((active - 1 + items.length) % items.length);
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, items.length, onChange]);

  if (active === null || !items[active]) return null;

  const item = items[active];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="完整图片预览">
      <button className="lightbox-close" type="button" aria-label="关闭预览" onClick={() => onChange(null)}>
        ×
      </button>
      <button
        className="lightbox-arrow lightbox-prev"
        type="button"
        aria-label="上一张"
        onClick={() => onChange((active - 1 + items.length) % items.length)}
      >
        ←
      </button>
      <figure>
        <img src={item.image} alt={item.alt} />
        <figcaption>
          <span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          {item.caption}
        </figcaption>
      </figure>
      <button
        className="lightbox-arrow lightbox-next"
        type="button"
        aria-label="下一张"
        onClick={() => onChange((active + 1) % items.length)}
      >
        →
      </button>
    </div>
  );
}
