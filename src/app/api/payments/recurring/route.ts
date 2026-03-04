"use server";
import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "scheduled";

    console.log("Fetch Recurring Payments - Status:", status);

    const response = await axiosInstanceAuth.get("/payments/recurring", {
      params: { status },
    });

    console.log("Fetch Recurring Payments - Success");
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching recurring payments:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error status:", error.response?.status);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching recurring payments."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
