import { ErrorResponse } from "@/types/error";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

type Handler = (req: NextRequest) => Promise<NextResponse>;

export default function tryWrapResponse(handler: Handler): Handler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error(error);

      if (error instanceof ErrorResponse) {
        return NextResponse.json(error, { status: 400 });
      }

      if (error instanceof ZodError) {
        const errorResponse = new ErrorResponse(
          "Validation error",
          error.flatten().fieldErrors
        );
        return NextResponse.json(errorResponse, { status: 400 });
      }
      return NextResponse.json({ success: false, message: error.message || "Something went wrong" }, { status: 400 });
    }
  };
}
