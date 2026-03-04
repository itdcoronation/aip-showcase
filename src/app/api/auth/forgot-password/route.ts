"use server";

import { NextResponse } from "next/server";
import { axiosInstanceUnauth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Make the API request
    const response = await axiosInstanceUnauth.post(
      "/auth/forgot-password",
      body
    );

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during forgot password:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          apiErrorHandler(error, "An error occurred during password recovery."),
        error: error.response?.data,
      },
      {
        status:
          error?.response?.status === 401
            ? 400
            : error?.response?.status || 500,
      }
    );
  }
}
