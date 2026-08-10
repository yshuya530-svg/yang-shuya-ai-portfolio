"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useMemo, useState } from "react";
import MediaLightbox, { type LightboxItem } from "./MediaLightbox";
import "./StackGallery.css";

type StackItem = { image: string; alt: string; caption: string };

export default function StackGallery({ items }: { items: StackItem[] }) {
  const [order, setOrder] = useState(() => items.map((_, index) => index));
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxItems = useMemo<LightboxItem[]>(() => items, [items]);

  const sendToBack = (itemIndex: number) => {
    setOrder((current) => [itemIndex, ...current.filter((index) => index !== itemIndex)]);
  };

  return (
    <>
      <div className="stack-gallery" aria-label="智能体前端界面卡片堆">
        {order.map((itemIndex, orderIndex) => {
          const isTop = orderIndex === order.length - 1;
          return (
            <StackCard
              key={items[itemIndex].image}
              item={items[itemIndex]}
              depth={orderIndex}
              total={order.length}
              isTop={isTop}
              onSendBack={() => sendToBack(itemIndex)}
              onOpen={() => setLightbox(itemIndex)}
            />
          );
        })}
        <div className="stack-gallery__help"><span>拖动或点击翻下一张</span><b>STACK / {String(items.length).padStart(2, "0")}</b></div>
      </div>
      <MediaLightbox items={lightboxItems} active={lightbox} onChange={setLightbox} />
    </>
  );
}

function StackCard({ item, depth, total, isTop, onSendBack, onOpen }: {
  item: StackItem;
  depth: number;
  total: number;
  isTop: boolean;
  onSendBack: () => void;
  onOpen: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-120, 120], [10, -10]);
  const rotateY = useTransform(x, [-120, 120], [-10, 10]);
  const layer = total - depth - 1;

  return (
    <motion.article
      className={`stack-card${isTop ? " is-top" : ""}`}
      style={{ x, y, rotateX, rotateY, zIndex: depth + 1 }}
      drag={isTop}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={.65}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 70 || Math.abs(info.offset.y) > 70) onSendBack();
        else { x.set(0); y.set(0); }
      }}
      animate={{ rotateZ: (layer - 2) * 1.7, scale: 1 - layer * .025, y: layer * -4 }}
      transition={{ type: "spring", stiffness: 250, damping: 22 }}
      onClick={() => isTop ? onOpen() : onSendBack()}
      tabIndex={isTop ? 0 : -1}
      onKeyDown={(event) => {
        if (!isTop) return;
        if (event.key === "Enter") onOpen();
        if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); onSendBack(); }
      }}
    >
      <div className="stack-card__media"><img src={item.image} alt={item.alt} draggable="false" /></div>
      <div className="stack-card__caption"><span>{String(depth + 1).padStart(2, "0")}</span><p>{item.caption}</p><b>{isTop ? "查看大图 ↗" : ""}</b></div>
    </motion.article>
  );
}
