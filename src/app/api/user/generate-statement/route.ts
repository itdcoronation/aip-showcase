"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Make the API request
    const response = await axiosInstanceAuth.post(
      `/customeraccount/sendstatement`,
      body
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during generate statement:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred during generate statement."
        ),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
