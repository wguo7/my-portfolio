import { getPosts } from "@/lib/posts";
import Link from "next/link";
import path from "path";
import NavLink from "./NavLink";
import ThemeToggle from "./ThemeToggle";

const blogDirectory = path.join(process.cwd(), "content");

export default async function Header() {
  const posts = await getPosts(blogDirectory, 1);

  const navLinks = [
    { name: "projects", href: "/projects" },
    ...(posts.length > 0 ? [{ name: "writing", href: "/blog" }] : []),
    { name: "contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-3xl px-8 py-5">
        <nav aria-label="Main navigation" className="flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-base font-bold lowercase tracking-tight text-foreground transition-opacity duration-150 hover:opacity-70"
          >
            will guo
          </Link>
          <div className="flex items-center gap-5 sm:gap-7">
            <ul className="flex items-center gap-5 sm:gap-7">
              {navLinks.map((nav) => (
                <li key={nav.href}>
                  <NavLink name={nav.name} href={nav.href} />
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
