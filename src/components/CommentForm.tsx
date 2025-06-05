"use client";

import { useState } from "react";
import InputField from "./Input";
import Button from "./Button";
import { formatErrors } from "@/utils/formatErrors";
import { ErrorResponseIssues } from "@/types/error";
import { IPost } from "@/types/post";
import { addCommentSchema } from "@/validation/commentSchemas";
import { IComment } from "@/types/comment";

type Props = {
  post?: IPost;
  callback: (comment: IComment) => void;
};

function CommentForm({ post, callback }: Props) {
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorResponseIssues>({});

  async function onSubmit(e: any) {
    e.preventDefault();
    if (loading) return;
    const result = addCommentSchema.safeParse({
      postId: post?.id,
      body,
    });
    if (!result.success) {
      const formattedErrors = formatErrors(result.error);
      return setErrors(formattedErrors);
    }
    setLoading(true);
    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        body: JSON.stringify({ ...result.data }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        callback(responseData.comment);
        setBody("");
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
      <InputField
        id="body"
        value={body}
        onChange={(e) => onChange(e.target.value, setBody)}
        placeholder="Write a comment..."
        errors={errors}
        multiline={true}
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button className="w-[90px]" size="sm" type="submit" disabled={loading}>
          {loading ? "Loading" : "Comment"}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
