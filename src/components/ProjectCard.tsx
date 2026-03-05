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
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const { name, href, description, image, tags, links } = project;

  return (
    <Card className="flex flex-col">
        <CardHeader>
          {image && (
            <Link href={href || image}>
              <Image
                src={image}
                alt={name}
                width={500}
                height={300}
                className="h-40 w-full object-cover object-top"
              />
            </Link>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardTitle>{name}</CardTitle>
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
            {description}
          </Markdown>
        </CardContent>
        <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
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
}
