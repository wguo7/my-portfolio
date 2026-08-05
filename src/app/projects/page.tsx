import Projects from "@/components/Projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Will Guo: Caisson AI, LLM agent security, prediction market microstructure, and more.",
};

export default function ProjectPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title text-4xl sm:text-5xl">projects.</h1>

      <Projects />
    </article>
  );
}
