import { getPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";
import path from "path";

const SITE_URL = "https://www.williamguo.xyz";
const blogDirectory = path.join(process.cwd(), "content");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(blogDirectory);

  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/projects`, priority: 0.8 },
    { url: `${SITE_URL}/contact`, priority: 0.5 },
  ];

  if (posts.length > 0) {
    routes.push({ url: `${SITE_URL}/blog`, priority: 0.7 });
    for (const post of posts) {
      routes.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        priority: 0.6,
        lastModified: post.updatedAt ?? post.publishedAt,
      });
    }
  }

  return routes;
}
