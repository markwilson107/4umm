import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: `.env.local` });

let seeded = false;

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: false, index: true },
    title: { type: String, required: false },
    postCount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default async function seedCategories() {
  try {
    if (seeded) return;
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
    await Category.deleteMany();
    await Category.insertMany(
      [
        { id: "general", title: "General" },
        { id: "tech", title: "Tech" },
        { id: "music", title: "Music" },
        { id: "gaming", title: "Gaming" },
      ],
      { ordered: false }
    ).catch(() => {});
    seeded = true;
    console.log("Finished seeding the database");
    await mongoose.disconnect();
  } catch (error) {
    console.log(
      "Please ensure your .env.local environment variables are set up correctly!"
    );
  }
  process.exit(0);
}

seedCategories();
