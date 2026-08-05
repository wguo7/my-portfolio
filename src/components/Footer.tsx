import Socials from "./Socials";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-border/60 pt-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 px-8 pb-16 sm:flex-row-reverse sm:justify-between">
        <Socials />
        <p className="font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} will guo &middot; chicago, il
        </p>
      </div>
    </footer>
  );
}
