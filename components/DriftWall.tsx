"use client";

import { useMemo, useState } from "react";
import MediaLightbox, { type LightboxItem } from "./MediaLightbox";
import "./DriftWall.css";

type DriftItem = {
  image: string;
  alt: string;
  caption: string;
};

export default function DriftWall({ items }: { items: DriftItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const lightboxItems = useMemo<LightboxItem[]>(() => items, [items]);
  const columns = [items.filter((_, index) => index % 2 === 0), items.filter((_, index) => index % 2 === 1)];

  return (
    <>
      <div className="drift-wall" aria-label="玉林新世纪实习影像墙">
        {columns.map((column, columnIndex) => (
          <div className={`drift-column drift-column-${columnIndex + 1}`} key={columnIndex}>
            <div className="drift-track">
              {[...column, ...column].map((item, index) => {
                const originalIndex = items.indexOf(item);
                return (
                  <button
                    className="drift-card"
                    type="button"
                    key={`${item.image}-${index}`}
                    onClick={() => setActive(originalIndex)}
                    aria-label={`查看原图：${item.caption}`}
                  >
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    <span>{item.caption}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <MediaLightbox items={lightboxItems} active={active} onChange={setActive} />
    </>
  );
}
