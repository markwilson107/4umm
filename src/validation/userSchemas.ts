import { z } from "zod";

export const avatarSchema = z.enum(
  ["marble", "beam", "pixel", "sunset", "ring", "bauhaus"],
  {
    message: "Avatar is not valid",
  }
);


export const userDataSchema =  z.object({
  username: z.string().min(1, "Username is required")
});