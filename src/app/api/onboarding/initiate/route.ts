"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Make the API request
    const response = await axiosInstanceAuth.post(
      "/customer-staging/get-or-create",
      body
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during customer staging:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred during customer staging."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
