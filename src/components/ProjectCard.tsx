import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Icon from "./Icon";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const { name, href, description, image, tags, links } = project;

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-secondary/40 shadow-none transition-colors duration-200 hover:border-foreground/30">
      {image && (
        <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover object-top blur-[1px]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-card/10" />
        </div>
      )}
      <CardContent className="relative z-10 flex flex-col gap-2 p-6 pb-0">
        <CardTitle className="text-base">
          {href ? (
            // stretched link: whole card clickable, no nested anchors
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="after:absolute after:inset-0 after:content-['']"
            >
              <span className="inline-flex items-center gap-1 underline decoration-transparent decoration-[1.5px] underline-offset-4 transition-colors duration-150 group-hover:decoration-foreground/50">
                {name}
                <ArrowUpRightIcon
                  className="size-3.5 text-muted-foreground transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>
          ) : (
            name
          )}
        </CardTitle>
        <p className="prose max-w-full text-pretty font-sans text-xs leading-relaxed text-muted-foreground dark:prose-invert">
          {description}
        </p>
      </CardContent>
      <CardFooter className="relative z-10 flex h-full flex-col items-start justify-between gap-4 p-6 pt-0">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="rounded-md px-1.5 py-0 font-mono text-[10px] font-normal"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="relative z-20 flex flex-row flex-wrap items-center gap-2">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs transition-colors duration-150 hover:border-foreground/40"
              >
                <Icon name={link.icon} className="size-3.5" />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
