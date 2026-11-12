"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let hideTimer = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let tx = x;
    let ty = y;

    const place = () => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    const step = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      place();
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(step);
    };
    // Touch screens: tapping lights the grid around the finger for a moment.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      x = tx = e.clientX;
      y = ty = e.clientY;
      place();
      el.style.opacity = "1";
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        el.style.opacity = "0";
      }, 900);
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.clearTimeout(hideTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="grid-spot pointer-events-none fixed inset-0 -z-10 opacity-0 transition-opacity duration-500"
    />
  );
}