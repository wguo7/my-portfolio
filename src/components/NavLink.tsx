"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  name: string;
  href: string;
}

export default function NavLink({ name, href }: Props) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "font-mono text-xs lowercase tracking-wide transition-colors duration-150",
        active
          ? "text-foreground underline decoration-foreground/40 underline-offset-[6px]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {name}
    </Link>
  );
}
