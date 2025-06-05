import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { sanitizeData } from "@/utils/sanitizeData";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "@/types/user";

interface UserDoc extends IUser, Document {
  id: string;
  sanitize(): Partial<IUser>;
  sanitizeSafe(): Partial<IUser>;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    id: { type: String, required: true, index: true, default: uuidv4 },
    username: { type: String, required: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    postCount: { type: Number, required: true, default: 0 },
    commentCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.sanitize = function () {
  return sanitizeData(this, [
    "id",
    "username",
    "email",
    "avatar",
    "postCount",
    "commentCount",
  ]);
};

userSchema.methods.sanitizeSafe = function () {
  return sanitizeData(this, [
    "username",
    "avatar",
    "postCount",
    "commentCount",
  ]);
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.password || !user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const User =
  mongoose.models.User as Model<UserDoc> || mongoose.model<UserDoc,Model<UserDoc>>("User", userSchema);

export default User;
