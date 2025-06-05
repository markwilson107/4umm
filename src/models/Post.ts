import { IPost } from "@/types/post";
import mongoose, { Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "./User";

interface PostDoc extends IPost, Document {
  id: string;
  toObject: () => any;
}

interface PostModelExtended extends Model<PostDoc> {
  findAndPopulate(
    filter: mongoose.RootFilterQuery<PostDoc>,
    options?: any
  ): Promise<PostDoc[]>;
  findOneAndPopulate(
    filter: mongoose.RootFilterQuery<PostDoc>,
    options?: any
  ): Promise<PostDoc>;
}

const postSchema = new mongoose.Schema<PostDoc>(
  {
    id: { type: String, required: true, index: true, default: uuidv4 },
    user: { type: String, required: true },
    category: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    commentCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

postSchema.statics.findAndPopulate = async function (
  filter: mongoose.RootFilterQuery<any>,
  options?: any
): Promise<IPost[]> {
  const posts = await this.find(filter, null, options || {});
  const users = await User.find({
    id: { $in: posts.map((p: PostDoc) => p.user) },
  });
  const userMap = new Map(users.map((u) => [u.id, u.sanitizeSafe()]));
  return posts.map((p: PostDoc) => ({
    ...p.toObject(),
    user: userMap.get(p.user)
  }));
};

postSchema.statics.findOneAndPopulate = async function (
  filter: mongoose.RootFilterQuery<any>,
  options?: any
): Promise<IPost | null> {
  const post = await this.findOne(filter, null, options || {});
  const user = await User.findOne({
    id: post.user,
  });
  if (!user || !post) return null;
  return { ...post.toObject(), user: user.sanitizeSafe() };
};

postSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Post =
  (mongoose.models.Post as PostModelExtended) ||
  mongoose.model<PostDoc, PostModelExtended>("Post", postSchema);

export default Post;
