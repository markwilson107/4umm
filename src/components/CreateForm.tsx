"use client";

import { useState } from "react";
import InputField from "./Input";
import Button from "./Button";
import { formatErrors } from "@/utils/formatErrors";
import { ErrorResponseIssues } from "@/types/error";
import { addPostSchema } from "@/validation/postSchemas";
import { useRouter } from "next/navigation";
import { ICategory } from "@/types/category";
import categoryIcons from "@/config/categoryIcons";

type Props = {
  categories: ICategory[];
};

function CreateForm({ categories }: Props) {
  const [category, setCategory] = useState<string>("general");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorResponseIssues>({});

  const router = useRouter();

  async function onSubmit(e: any) {
    e.preventDefault();
    if (loading) return;
    const result = addPostSchema.safeParse({
      category,
      title,
      body,
    });
    if (!result.success) {
      const formattedErrors = formatErrors(result.error);
      return setErrors(formattedErrors);
    }
    setLoading(true);
    try {
      const response = await fetch("/api/post/create", {
        method: "POST",
        body: JSON.stringify({ ...result.data }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        router.replace("/post/" + responseData.id);
      } else {
        if (responseData.issues) setErrors(responseData.issues);
      }
    } catch (error: any) {
      setErrors({ other: ["Network error"] });
      console.log(error);
    }

    setLoading(false);
  }

  function onChange(value: string, set: Function) {
    setErrors({});
    set(value);
  }
  return (
    <form className="flex flex-col w-full gap-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold mb-1">Create post</h1>
      <div>
        <div className=" rounded-full px-3 py-2 bg-gray-100 w-[140px]">
        <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full border-none outline-none cursor-pointer">
          {categories.map((c) => (
            <option key={`category-select-${c.id}`} value={c.id}>
              {c.title}
            </option>
          ))}
        </select></div>
      </div>
      <InputField
        id="title"
        value={title}
        onChange={(e) => onChange(e.target.value, setTitle)}
        placeholder="Title"
        errors={errors}
      />
      <InputField
        id="body"
        value={body}
        onChange={(e) => onChange(e.target.value, setBody)}
        placeholder="Body text"
        errors={errors}
        multiline={true}
      />
      <div className="flex justify-end gap-2 mt-3">
        <Button className="w-[90px]" size="sm" type="submit" disabled={loading}>
          {loading ? "Loading" : "Post"}
        </Button>
      </div>
    </form>
  );
}

export default CreateForm;
