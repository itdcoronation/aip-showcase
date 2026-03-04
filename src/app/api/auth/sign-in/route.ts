"use server";

import { NextResponse } from "next/server";
import { axiosInstanceUnauth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Make the API request
    const response = await axiosInstanceUnauth.post("/auth/login", body);
    console.log(response, "response");
    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status }
    );
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during sign-in:", error);

    // Adjust status code for 401 Unauthorized to 400 Bad Request
    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred during sign-in."),
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
