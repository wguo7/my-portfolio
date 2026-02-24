import Experience from "@/components/Experience";
import LanyardOverlay from "@/components/Lanyard";
import LinkWithIcon from "@/components/LinkWithIcon";
import Posts from "@/components/Posts";
import Projects from "@/components/Projects";
import Socials from "@/components/Socials";
import { Button } from "@/components/ui/Button";
import { getPosts } from "@/lib/posts";
import { ArrowRightIcon, FileDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";

const blogDirectory = path.join(process.cwd(), "content");
const LIMIT = 2; // max show 2

export default async function Home() {
  const posts = await getPosts(blogDirectory, LIMIT);

  return (
    <article className="mt-8 flex flex-col gap-16 pb-16">
      <section className="relative flex flex-col items-start gap-8">
        <div className="relative z-20 flex max-w-[640px] flex-col rounded-2xl bg-background/35 p-4 pr-[300px] backdrop-blur-sm md:pr-[320px]">
          <h1 className="title whitespace-nowrap text-4xl sm:text-5xl">
            hey, i&apos;m will. 👋
          </h1>

          <p className="mt-4 max-w-[38ch] text-balance text-sm sm:text-base">
            AI Risk Fellow at XLab and researcher at the Chicago Human+AI Lab.
            Previously, I worked on AI watermark detection at MIT Lincoln
            Laboratory and built large-scale education data tooling at
            Northwestern.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">Chicago, IL</p>

          <section className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="/resume.pdf" target="_blank">
              <Button variant="outline">
                <span className="font-semibold">Resume</span>
                <FileDown className="ml-2 size-5" />
              </Button>
            </Link>
            <Socials />
          </section>
        </div>

        <Image
          src="/img/avatar.png"
          alt="Will Guo"
          width={260}
          height={260}
          className="absolute right-0 top-10 z-20 hidden h-[260px] w-[260px] rounded-2xl border border-border object-cover md:block"
        />

        <LanyardOverlay
          cardTextureFront="/img/lanyard-card-front.png"
          cardTextureBack="/img/lanyard-card-back.png"
        />
      </section>

      <Experience />

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-2xl sm:text-3xl">featured projects</h2>
          <LinkWithIcon
            href="/projects"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view more"
          />
        </div>
        <Projects limit={LIMIT} />
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h2 className="title text-3xl">recent posts</h2>
          <LinkWithIcon
            href="/blog"
            position="right"
            icon={<ArrowRightIcon className="size-5" />}
            text="view more"
          />
        </div>
        <Posts posts={posts} />
      </section>
    </article>
  );
}
