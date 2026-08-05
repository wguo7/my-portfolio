import { FileTextIcon, ImageIcon } from "lucide-react";

const paper = {
  title:
    "Signature vs. Substance: Evaluating the Balance of Adversarial Resistance and Linguistic Quality in Watermarking Large Language Models",
  authors: ["William Guo", "Adaku Uchendu", "Ana Smith"],
  venue: "IEEE International Conference on Data Mining (ICDM) 2025",
  award: "Best Paper Award",
  summary:
    "How well do LLM watermarks survive paraphrase and back-translation attacks, and what do they cost in linguistic quality? A systematic evaluation across watermarking schemes, from work at MIT Lincoln Laboratory.",
  links: [
    {
      name: "arXiv",
      href: "https://arxiv.org/abs/2511.13722",
      icon: FileTextIcon,
    },
    {
      name: "Poster",
      href: "/poster-watermarking.pdf",
      icon: ImageIcon,
    },
  ],
};

export default function Publications() {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-6">
      <p className="font-mono text-xs text-muted-foreground">
        {paper.venue} &middot;{" "}
        <span className="font-medium text-foreground">{paper.award}</span>
      </p>

      <h3 className="mt-3 text-balance font-heading text-lg font-bold leading-snug">
        {paper.title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {paper.authors.map((author, i) => (
          <span key={author}>
            <span
              className={
                author === "William Guo" ? "font-semibold text-foreground" : ""
              }
            >
              {author}
            </span>
            {i < paper.authors.length - 1 && ", "}
          </span>
        ))}
      </p>

      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        {paper.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {paper.links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs transition-colors duration-150 hover:border-foreground/40"
          >
            <link.icon className="size-3.5" aria-hidden="true" />
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}
