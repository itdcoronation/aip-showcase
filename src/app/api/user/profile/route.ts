"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth2 } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET() {
  try {
    // Make the API request
    const response = await axiosInstanceAuth2.get(`/auth/profile`);

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during user info retrieval:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while fetching user profile."
        ),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
