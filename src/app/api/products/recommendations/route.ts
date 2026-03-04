"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET() {
  try {
    // Make the API request
    const response = await axiosInstanceAuth.get(
      "/customeraccount/personalised-products"
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during personalized recommendations fetch:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while fetching personalized recommendations."
        ),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
