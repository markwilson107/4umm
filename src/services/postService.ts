import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/Post";

export const getLatestPosts = unstable_cache(
  async () => {
    await dbConnect();

    const [total, posts] = await Promise.all([
      Post.countDocuments({}),
      Post.findAndPopulate({}, { sort: { createdAt: -1 }, limit: 10 }),
    ]);
    return { hasNext: total > 10, data: posts };
  },
  ["latest-posts"],
  {
    tags: ["latest-posts"],
    revalidate: 2880,
  }
);

export const getCategoryPosts = (id: string) =>
  unstable_cache(
    async () => {
      await dbConnect();

      const [total, posts] = await Promise.all([
        Post.countDocuments({ category: id }),
        Post.findAndPopulate(
          { category: id },
          { sort: { createdAt: -1 }, limit: 10 }
        ),
      ]);

      return { hasNext: total > 10, data: posts };
    },
    [`${id}-latest-posts`],
    {
      tags: [`${id}-latest-posts`],
      revalidate: 2880,
    }
  )();

export const getPost = (id: string) =>
  unstable_cache(
    async () => {
      await dbConnect();
      const post = await Post.findOneAndPopulate({ id });
      return post;
    },
    [`${id}-post`],
    {
      tags: [`${id}-post`],
      revalidate: 2880,
    }
  )();
