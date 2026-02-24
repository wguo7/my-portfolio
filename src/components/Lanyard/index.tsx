"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

interface LanyardOverlayProps {
  cardTextureFront?: string;
  cardTextureBack?: string;
}

export default function LanyardOverlay({
  cardTextureFront,
  cardTextureBack,
}: LanyardOverlayProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <div className="pointer-events-auto h-full w-full">
        <Suspense fallback={null}>
          <Lanyard
            cardTextureFront={cardTextureFront}
            cardTextureBack={cardTextureBack}
          />
        </Suspense>
      </div>
    </div>
  );
}
