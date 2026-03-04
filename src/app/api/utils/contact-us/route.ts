"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Make the API request
    const response = await axiosInstanceAuth.post(`/contact-us`, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during contact us:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred during contact us."
        ),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
