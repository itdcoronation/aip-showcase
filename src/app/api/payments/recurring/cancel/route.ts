"use server";
import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("=== CANCEL RECURRING PAYMENT API ===");
    console.log("Request body:", JSON.stringify(body, null, 2));
    console.log("Using axiosInstanceAuth for authentication");

    const response = await axiosInstanceAuth.post(
      "/payments/recurring/cancel",
      body
    );

    console.log("✅ Success! Status:", response.status);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
    console.log("=== END CANCEL API ===");
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("=== CANCEL RECURRING PAYMENT ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error status:", error.response?.status);
    console.error("Error response data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Full error:", error);
    console.error("=== END ERROR ===");

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while canceling the recurring payment."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
