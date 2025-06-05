import { IPost } from "@/types/post";
import mongoose, { Document, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "./User";
import { IComment } from "@/types/comment";

interface CommentDoc extends IComment, Document {
  id: string;
  toObject: () => any;
}

interface CommentModelExtended extends Model<CommentDoc> {
  findAndPopulate(
    filter: mongoose.RootFilterQuery<CommentDoc>,
    options?: any
  ): Promise<CommentDoc[]>;
}

const commentSchema = new mongoose.Schema<CommentDoc>(
  {
    id: { type: String, required: true, index: true, default: uuidv4 },
    user: { type: String, required: true },
    postId: { type: String, required: true, index: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

commentSchema.statics.findAndPopulate = async function (
  filter: mongoose.RootFilterQuery<any>,
  options?: any
): Promise<IPost[]> {
  const comments = await this.find(filter, null, options || {});
  const users = await User.find({
    id: { $in: comments.map((p: CommentDoc) => p.user) },
  });
  const userMap = new Map(users.map((u) => [u.id, u.sanitizeSafe()]));
  return comments.map((p: CommentDoc) => ({
    ...p.toObject(),
    user: userMap.get(p.user)
  }));
};

commentSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Comment =
  (mongoose.models.Comment as CommentModelExtended) ||
  mongoose.model<CommentDoc, CommentModelExtended>("Comment", commentSchema);

export default Comment;
