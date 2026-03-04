"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    // Make the API request
    const response = await axiosInstanceAuth.put(
      `/customer-staging/${id}/bank-info`,
      body
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during onboarding - bank info:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while submitting bank info."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
