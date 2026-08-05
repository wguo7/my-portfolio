"use client";

import { m } from "framer-motion";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** "load" animates immediately (above the fold); "view" animates on scroll into view */
  mode?: "load" | "view";
}

const variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Reveal({
  children,
  className,
  delay = 0,
  mode = "view",
}: Props) {
  const shared = {
    variants,
    initial: "hidden" as const,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const, delay },
    className,
  };

  if (mode === "load") {
    return (
      <m.div {...shared} animate="show">
        {children}
      </m.div>
    );
  }

  return (
    <m.div
      {...shared}
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
    >
      {children}
    </m.div>
  );
}
