"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST() {
  try {
    // Make the API request to get history trades
    const response = await axiosInstanceAuth.post(`/ngxmarketdata/viewtrades/executed`);

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during history trades retrieval:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching trade history."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}