"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Log the request body for debugging
    console.log("Redeem API - Request body:", JSON.stringify(body, null, 2));

    // Transform the body to match expected API format
    const apiBody = {
      fundCode: body.fundCode, // API expects camelCase, not snake_case
      amount: body.amount,
      narration: body.narration,
      reference: body.reference
    };

    console.log("Redeem API - Transformed body:", JSON.stringify(apiBody, null, 2));

    // Make the API request
    const response = await axiosInstanceAuth.post(
      "/customeraccount/redeem",
      apiBody
    );

    console.log("Redeem API - Success response:", JSON.stringify(response.data, null, 2));
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during fund redemption:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error status:", error.response?.status);

    // Preserve the original error structure for better error handling
    const originalError = error.response?.data;
    
    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred during fund redemption."),
        // Preserve original error structure completely
        ...originalError,
        // Also add our own fields for fallback
        error: originalError,
        statusMessage: originalError?.Data?.api_response?.statusMessage || 
                      originalError?.api_response?.statusMessage || 
                      originalError?.statusMessage || 
                      originalError?.Message || 
                      error.message,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}