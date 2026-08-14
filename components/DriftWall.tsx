"use client";

import { useMemo, useState } from "react";
import MediaLightbox, { type LightboxItem } from "./MediaLightbox";
import "./DriftWall.css";

type DriftItem = { image: string; alt: string; caption: string };
type DriftSlot = { item: DriftItem | null; originalIndex: number | null };

const smartCrop = (image: string) => {
  if (image.endsWith("school-06.jpg") || image.endsWith("school-07.jpg")) return "signature";
  if (image.endsWith("school-09.jpg")) return "video-center";
  if (image.endsWith("school-13-womens-day.jpg")) return "womens-day";
  if (image.endsWith("school-15-gifts.jpg")) return "gifts";
  if (image.endsWith("school-16-shay-shooting.jpg")) return "shay-shooting";
  return undefined;
};

export default function DriftWall({ items }: { items: DriftItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const lightboxItems = useMemo<LightboxItem[]>(() => items, [items]);
  const rows = useMemo<DriftSlot[][]>(() => Array.from({ length: 3 }, (_, rowIndex) => {
    const row: DriftSlot[] = items
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter((_, itemIndex) => itemIndex % 3 === rowIndex);
    while (row.length < 4) row.push({ item: null, originalIndex: null });
    return row;
  }), [items]);

  return (
    <>
      <div className="drift-wall" aria-label="玉林新世纪实习影像墙">
        {rows.map((row, rowIndex) => (
          <div className={`drift-row drift-row-${rowIndex + 1}`} key={rowIndex}>
            <div className="drift-track">
              {[0, 1].map((copyIndex) => (
                <div className="drift-sequence" key={copyIndex} aria-hidden={copyIndex === 1 ? "true" : undefined}>
                  {row.map((slot, slotIndex) => slot.item && slot.originalIndex !== null ? (
                    <button
                      className="drift-card"
                      type="button"
                      key={`${copyIndex}-${slot.item.image}`}
                      data-smart-crop={smartCrop(slot.item.image)}
                      onClick={() => setActive(slot.originalIndex)}
                      aria-label={`查看原图：${slot.item.caption}`}
                      tabIndex={copyIndex === 1 ? -1 : 0}
                    >
                      <span className="drift-card__media"><img src={slot.item.image} alt={copyIndex === 0 ? slot.item.alt : ""} loading="lazy" decoding="async" /></span>
                      <span className="drift-card__caption">{slot.item.caption}</span>
                    </button>
                  ) : (
                    <span className="drift-card drift-card--empty" key={`${copyIndex}-empty-${slotIndex}`} aria-hidden="true"><i>待补充影像</i></span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="drift-wall__hint">移到单张图片上暂停 · 点击查看原图</p>
      </div>
      <MediaLightbox items={lightboxItems} active={active} onChange={setActive} />
    </>
  );
}
