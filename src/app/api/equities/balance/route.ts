"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET() {
  try {
    // Make the API request to get brokerage balance
    const response = await axiosInstanceAuth.get(`/customeraccount/balance`);

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during brokerage balance retrieval:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching brokerage balance."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}