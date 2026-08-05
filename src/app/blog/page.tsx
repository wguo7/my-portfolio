import PostsWithSearch from "@/components/PostsWithSearch";
import { getPosts } from "@/lib/posts";
import type { Metadata } from "next";
import path from "path";

export const metadata: Metadata = {
  title: "Writing",
  description: "Writing by Will Guo on ML research, AI safety, and building.",
};

const blogDirectory = path.join(process.cwd(), "content");

export default async function BlogPage() {
  const posts = await getPosts(blogDirectory);

  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title text-4xl sm:text-5xl">writing.</h1>

      {posts.length > 0 ? (
        <PostsWithSearch posts={posts} />
      ) : (
        <p className="text-muted-foreground">Nothing here yet. Soon.</p>
      )}
    </article>
  );
}
