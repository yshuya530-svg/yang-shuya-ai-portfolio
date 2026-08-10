"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./DepthCarousel.css";

export type DepthCarouselItem = {
  image: string;
  alt: string;
  caption: string;
};

type Props = {
  items: DepthCarouselItem[];
};

export default function DepthCarousel({ items }: Props) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(false);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useRef(false);

  const signedDistances = useMemo(() => items.map((_, index) => {
    let distance = index - active;
    if (distance > items.length / 2) distance -= items.length;
    if (distance < -items.length / 2) distance += items.length;
    return distance;
  }), [active, items]);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    cards.current.forEach((card, index) => {
      if (!card) return;
      const distance = signedDistances[index];
      const depth = Math.abs(distance);
      gsap.to(card, {
        xPercent: -50,
        yPercent: -50,
        x: distance * 92,
        z: -depth * 165,
        rotateY: distance * -8,
        scale: 1 - Math.min(depth * 0.06, 0.22),
        opacity: depth > 3 ? 0 : 1,
        filter: `brightness(${Math.max(0.48, 1 - depth * 0.16)})`,
        duration: reducedMotion.current ? 0 : 0.62,
        ease: "power3.out",
        overwrite: true,
      });
      card.style.zIndex = String(20 - depth);
      card.style.pointerEvents = depth > 3 ? "none" : "auto";
    });
  }, [signedDistances]);

  useEffect(() => {
    if (!preview) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(false);
      if (event.key === "ArrowLeft") setActive((value) => (value - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") setActive((value) => (value + 1) % items.length);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [items.length, preview]);

  const move = (step: number) => setActive((value) => (value + step + items.length) % items.length);

  return (
    <>
      <div
        className="depth-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="虚拟手机界面预览"
      >
        <div className="depth-carousel__stage">
          {items.map((item, index) => (
            <button
              className={`depth-carousel__card ${index === active ? "is-active" : ""}`}
              type="button"
              key={item.image}
              ref={(node) => { cards.current[index] = node; }}
              aria-label={`${index + 1} / ${items.length}：${item.caption}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => index === active ? setPreview(true) : setActive(index)}
            >
              <img src={item.image} alt={item.alt} draggable={false} />
            </button>
          ))}
        </div>
        <button className="depth-carousel__arrow depth-carousel__arrow--prev" type="button" aria-label="上一张" onClick={() => move(-1)}>←</button>
        <button className="depth-carousel__arrow depth-carousel__arrow--next" type="button" aria-label="下一张" onClick={() => move(1)}>→</button>
        <div className="depth-carousel__caption" aria-live="polite">
          <span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <p>{items[active]?.caption}</p>
          <button type="button" onClick={() => setPreview(true)}>查看完整界面 ↗</button>
        </div>
        <div className="depth-carousel__dots" aria-label="选择界面">
          {items.map((item, index) => (
            <button key={item.image} type="button" aria-label={`查看第 ${index + 1} 张`} className={index === active ? "is-active" : ""} onClick={() => setActive(index)} />
          ))}
        </div>
      </div>

      {preview && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="虚拟手机界面大图">
          <button className="lightbox-close" type="button" aria-label="关闭预览" onClick={() => setPreview(false)}>×</button>
          <button className="lightbox-arrow" type="button" aria-label="上一张" onClick={() => move(-1)}>←</button>
          <figure>
            <img src={items[active].image} alt={items[active].alt} />
            <figcaption><span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>{items[active].caption}</figcaption>
          </figure>
          <button className="lightbox-arrow" type="button" aria-label="下一张" onClick={() => move(1)}>→</button>
        </div>
      )}
    </>
  );
}
