import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const getUser = (username: string) =>
  unstable_cache(
    async () => {
      await dbConnect();

      const user = await User.findOne({ username });
      return user?.sanitizeSafe();
    },
    [`${username}-user`],
    {
      tags: [`${username}-user`],
      revalidate: 2880,
    }
  )();