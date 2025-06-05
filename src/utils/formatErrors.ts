import { ZodError } from "zod";

export function formatErrors(error: ZodError) {
  return error.errors.reduce((acc: { [key: string]: string[] }, curr) => {
    const path = curr.path.join(".");
    if (!acc[path]) {
      acc[path] = [];
    }
    acc[path].push(curr.message);
    return acc;
  }, {});
}
