"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET() {
  try {
    // Make the API request
    const response = await axiosInstanceAuth.get("/banks/active", );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during fetching banks:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching banks."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
