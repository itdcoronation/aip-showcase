"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Log the request body for debugging
    console.log("Initiate Payment API - Request body:", JSON.stringify(body, null, 2));

    // Make the API request
    const response = await axiosInstanceAuth.post(
      "/payments/initiate",
      body
    );

    console.log("Initiate Payment API - Success response:", JSON.stringify(response.data, null, 2));
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during payment initiation:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error status:", error.response?.status);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred during payment initiation."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
