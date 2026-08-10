"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./FlowingMenu.css";

export type FlowingMenuItem = { title: string; detail: string; image?: string };

export default function FlowingMenu({ items }: { items: FlowingMenuItem[] }) {
  return (
    <div className="flowing-menu-wrap">
      <div className="flowing-menu" role="list">
        {items.map((item, index) => <FlowingMenuRow item={item} index={index} key={item.title} />)}
      </div>
    </div>
  );
}

function FlowingMenuRow({ item, index }: { item: FlowingMenuItem; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(5);

  useEffect(() => {
    const calculate = () => {
      const first = innerRef.current?.querySelector<HTMLElement>(".flowing-marquee__part");
      if (!first) return;
      setRepetitions(Math.max(5, Math.ceil(window.innerWidth / Math.max(first.offsetWidth, 1)) + 2));
    };
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [item.detail, item.title]);

  useEffect(() => {
    const first = innerRef.current?.querySelector<HTMLElement>(".flowing-marquee__part");
    if (!first || !innerRef.current) return;
    loopRef.current?.kill();
    loopRef.current = gsap.to(innerRef.current, { x: -first.offsetWidth, duration: 14, ease: "none", repeat: -1 });
    return () => loopRef.current?.kill();
  }, [repetitions]);

  const reveal = (event: React.PointerEvent) => {
    if (!rowRef.current || !marqueeRef.current || !innerRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const fromTop = event.clientY - rect.top < rect.height / 2;
    gsap.timeline({ defaults: { duration: .55, ease: "expo.out" } })
      .set(marqueeRef.current, { y: fromTop ? "-101%" : "101%" })
      .set(innerRef.current, { y: fromTop ? "101%" : "-101%" })
      .to([marqueeRef.current, innerRef.current], { y: "0%" });
  };

  const hide = (event: React.PointerEvent) => {
    if (!rowRef.current || !marqueeRef.current || !innerRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const toTop = event.clientY - rect.top < rect.height / 2;
    gsap.timeline({ defaults: { duration: .48, ease: "expo.inOut" } })
      .to(marqueeRef.current, { y: toTop ? "-101%" : "101%" }, 0)
      .to(innerRef.current, { y: toTop ? "101%" : "-101%" }, 0);
  };

  const revealFromCenter = () => {
    if (!marqueeRef.current || !innerRef.current) return;
    gsap.timeline({ defaults: { duration: .55, ease: "expo.out" } })
      .set(marqueeRef.current, { y: "101%" })
      .set(innerRef.current, { y: "-101%" })
      .to([marqueeRef.current, innerRef.current], { y: "0%" });
  };

  const hideToBottom = () => {
    if (!marqueeRef.current || !innerRef.current) return;
    gsap.timeline({ defaults: { duration: .48, ease: "expo.inOut" } })
      .to(marqueeRef.current, { y: "101%" }, 0)
      .to(innerRef.current, { y: "-101%" }, 0);
  };

  return (
    <div ref={rowRef} className="flowing-menu__item" role="button" aria-label={`${item.title}：${item.detail}`} tabIndex={0} onPointerEnter={reveal} onPointerLeave={hide} onFocus={revealFromCenter} onBlur={hideToBottom}>
      <div className="flowing-menu__base">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <b>{item.title}</b>
        <p>{item.detail}</p>
        <i>↗</i>
      </div>
      <div className="flowing-marquee" ref={marqueeRef} aria-hidden="true">
        <div className="flowing-marquee__inner" ref={innerRef}>
          {Array.from({ length: repetitions }).map((_, repeatIndex) => (
            <div className="flowing-marquee__part" key={repeatIndex}>
              <strong>{item.title}</strong><em>✦</em><span>{item.detail}</span><em>✦</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
