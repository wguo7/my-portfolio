"use client";

import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import Image from "next/image";
import Markdown from "react-markdown";
import Icon from "./Icon";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const { name, href, description, image, tags, links } = project;

  const cardContent = (
    <Card className={`group relative flex flex-col overflow-hidden${href ? " transition-all duration-300 hover:border-foreground/40 hover:shadow-lg hover:shadow-foreground/5" : ""}`}>
        {image && (
          <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover object-top blur-[2px]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        )}
        <CardHeader className="relative z-10">
        </CardHeader>
        <CardContent className="relative z-10 flex flex-col gap-2">
          <CardTitle>{name}</CardTitle>
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
            {description}
          </Markdown>
        </CardContent>
        <CardFooter className="relative z-10 flex h-full flex-col items-start justify-between gap-4">
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.toSorted().map((tag) => (
                <Badge
                  key={tag}
                  className="px-1 py-0 text-[10px]"
                  variant="secondary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {links && links.length > 0 && (
            <div className="flex flex-row flex-wrap items-center gap-2">
              {[...links]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm transition-colors hover:bg-muted hover:border-foreground/30"
                  >
                    <Icon name={link.icon} className="size-4" />
                    <span>{link.name}</span>
                  </a>
                ))}
            </div>
          )}
        </CardFooter>
    </Card>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
