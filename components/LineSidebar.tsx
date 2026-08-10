"use client";

import { useState } from "react";
import "./LineSidebar.css";

export type LineSidebarItem = { label: string; value: string; href?: string; copy?: string };

export default function LineSidebar({ items }: { items: LineSidebarItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const activate = async (item: LineSidebarItem, index: number) => {
    setActive(index);
    if (item.copy) await navigator.clipboard?.writeText(item.copy).catch(() => undefined);
  };

  return (
    <nav className="line-sidebar" aria-label="联系方式">
      <ul
        className="line-sidebar__list"
        onPointerMove={(event) => {
          const elements = event.currentTarget.querySelectorAll<HTMLElement>(".line-sidebar__item");
          elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
            const proximity = Math.max(0, 1 - distance / 115);
            element.style.setProperty("--effect", (proximity * proximity * (3 - 2 * proximity)).toFixed(4));
          });
        }}
        onPointerLeave={(event) => event.currentTarget.querySelectorAll<HTMLElement>(".line-sidebar__item").forEach((element, index) => element.style.setProperty("--effect", active === index ? "1" : "0"))}
      >
        {items.map((item, index) => {
          const content = <><span className="line-sidebar__index">{String(index + 1).padStart(2, "0")}</span><span><b>{item.label}</b><em>{item.value}</em></span></>;
          return (
            <li className="line-sidebar__item" style={{ "--effect": active === index ? 1 : 0 } as React.CSSProperties} key={item.label}>
              <span className="line-sidebar__marker" aria-hidden="true" />
              {item.href ? <a className="line-sidebar__label" href={item.href} onClick={() => activate(item, index)}>{content}</a> : <button className="line-sidebar__label" type="button" onClick={() => activate(item, index)}>{content}</button>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
