"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const Portrait = dynamic(() => import("./Portrait"), { ssr: false });

/**
 * Generative hero: a De Jong strange attractor traced by 30,000 live points —
 * assembles on load, swirls under the cursor, bursts apart on click. Falls
 * back to a static render on small screens, reduced-motion, or missing WebGL.
 */
export default function ParticlePortrait() {
  const [mode, setMode] = useState<"pending" | "canvas" | "static">("pending");

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setMode(wide && !reduced && webgl ? "canvas" : "static");
  }, []);

  return (
    <div className="relative aspect-square w-full">
      {mode === "canvas" ? (
        // canvas bleeds past the layout slot so scattered points fly free
        <div className="pointer-events-none absolute -inset-[24%] [&_canvas]:!pointer-events-auto">
          <Portrait />
        </div>
      ) : mode === "static" ? (
        <Image
          src="/img/attractor.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 768px) 80vw, 380px"
          className="object-contain"
          priority
        />
      ) : null}
    </div>
  );
}
