import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";

export const getInitalComments = (id: string) =>
  unstable_cache(
    async () => {
      await dbConnect();

      const [total, comments] = await Promise.all([
        Comment.countDocuments({ postId: id }),
        Comment.findAndPopulate(
          { postId: id },
          {
            sort: { createdAt: -1 },
            limit: 10,
          }
        ),
      ]);

      return { hasNext: total > 10, data: comments };
    },
    [`${id}-inital-comments`],
    {
      tags: [`${id}-inital-comments`],
      revalidate: 2880,
    }
  )();
