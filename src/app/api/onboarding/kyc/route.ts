"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    // Make the API request with a timeout (e.g., 10 seconds)
    const response = await axiosInstanceAuth.post(
      `/customer-staging/${id}/kyc`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      } 
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during onboarding - kyc info:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while submitting KYC info."),
        error: error.response?.data ?? "Internal Server Error",
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
