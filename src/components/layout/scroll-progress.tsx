"use client";

import { useEffect, useState } from "react";

/** Thin orange bar at the top of the viewport that tracks page scroll. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max <= 0 ? 0 : Math.min(1, el.scrollTop / max));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-white/10"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-brand-orange transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
