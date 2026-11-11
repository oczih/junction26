import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json(
    { success: false, error: { message, ...(details ? { details } : {}) } },
    { status }
  );
}

export function notFoundResponse(resource = "Resource") {
  return errorResponse(`${resource} not found`, 404);
}

export function validationErrorResponse(zodError: ZodError) {
  return errorResponse("Validation failed", 400, zodError.flatten());
}
