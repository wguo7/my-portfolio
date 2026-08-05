import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import ParticlePortrait from "@/components/ParticlePortrait";
import Posts from "@/components/Posts";
import Projects from "@/components/Projects";
import Publications from "@/components/Publications";
import Reveal from "@/components/Reveal";
import Socials from "@/components/Socials";
import { getPosts } from "@/lib/posts";
import { ArrowRightIcon } from "lucide-react";
import path from "path";

const blogDirectory = path.join(process.cwd(), "content");
const POST_LIMIT = 2;
const PROJECT_LIMIT = 2;

export default async function Home() {
  const posts = await getPosts(blogDirectory, POST_LIMIT);

  return (
    <article className="flex flex-col gap-20 pb-16">
      <section className="grid min-h-[calc(100svh-14rem)] grid-cols-1 content-center items-center gap-10 py-10 md:grid-cols-[1fr_300px] lg:-mx-16 lg:grid-cols-[1fr_380px] lg:gap-14">
        <Reveal mode="load">
          <h1 className="title text-4xl sm:text-5xl">hey, i&apos;m will.</h1>

          <p className="mt-5 max-w-[52ch] text-pretty leading-relaxed">
            I study math &amp; CS at the{" "}
            <a
              href="https://www.uchicago.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="fancy-link"
            >
              University of Chicago
            </a>
            . I&apos;m an AI Risk Fellow at{" "}
            <a
              href="https://xlab.uchicago.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="fancy-link"
            >
              XLab
            </a>{" "}
            and I&apos;m building{" "}
            <a
              href="https://caisson-mvp-mu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="fancy-link"
            >
              Caisson AI
            </a>
            , offline AI assistants for field technicians. I first-authored the{" "}
            <a
              href="https://arxiv.org/abs/2511.13722"
              target="_blank"
              rel="noopener noreferrer"
              className="fancy-link"
            >
              IEEE ICDM Best Paper
            </a>{" "}
            on LLM watermark detection.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-6">
            <Socials />
            <span className="font-mono text-xs text-muted-foreground">
              chicago, il
            </span>
          </div>
        </Reveal>

        <Reveal mode="load" delay={0.15} className="mx-auto w-full max-w-[380px]">
          <ParticlePortrait />
        </Reveal>
      </section>

      <section className="flex flex-col gap-5">
        <Reveal>
          <h2 className="section-label">research</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <Publications />
        </Reveal>
      </section>

      <section className="flex flex-col gap-5">
        <Reveal>
          <h2 className="section-label">experience</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <Experience />
        </Reveal>
      </section>

      <section className="flex flex-col gap-5">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <h2 className="section-label">selected projects</h2>
            <LinkWithIcon
              href="/projects"
              position="right"
              icon={<ArrowRightIcon className="size-4" />}
              text="view all"
            />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <Projects limit={PROJECT_LIMIT} />
        </Reveal>
      </section>

      {posts.length > 0 && (
        <section className="flex flex-col gap-5">
          <Reveal>
            <div className="flex items-baseline justify-between">
              <h2 className="section-label">writing</h2>
              <LinkWithIcon
                href="/blog"
                position="right"
                icon={<ArrowRightIcon className="size-4" />}
                text="view all"
              />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <Posts posts={posts} />
          </Reveal>
        </section>
      )}

      <section className="flex flex-col gap-5">
        <Reveal>
          <h2 className="section-label">contact</h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="max-w-[52ch] text-pretty leading-relaxed">
            The fastest way to reach me is email:{" "}
            <a href="mailto:wguo4@uchicago.edu" className="fancy-link">
              wguo4@uchicago.edu
            </a>
            . For anything longer, there&apos;s a{" "}
            <a href="/contact" className="fancy-link">
              form
            </a>
            .
          </p>
        </Reveal>
      </section>
    </article>
  );
}
