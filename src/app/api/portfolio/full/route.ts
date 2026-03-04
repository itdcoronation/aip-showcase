"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET() {
  try {
    // Make the API request to get full portfolio data
    const response = await axiosInstanceAuth.get(
      `/customeraccount/portfolio?type=full`
    );

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status || 200 }
    );
  } catch (error: unknown) {
    // Log the error for debugging purposes
    console.error("Error during full portfolio retrieval:", error);

    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while fetching full portfolio."
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError?.response?.status || 500,
      }
    );
  }
}
