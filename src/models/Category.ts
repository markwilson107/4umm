import { ICategory } from "@/types/category";
import mongoose, { Document, Model } from "mongoose";

interface CategoryDoc extends ICategory, Document {
  id: string;
  toObject: () => any;
}

const categorySchema = new mongoose.Schema<CategoryDoc>(
  {
    id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    postCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

categorySchema.set("toObject", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Category =
  (mongoose.models.Category as Model<CategoryDoc>) ||
  mongoose.model<CategoryDoc>("Category", categorySchema);

export default Category;
