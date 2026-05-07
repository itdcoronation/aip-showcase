"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, policyId } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "reference is required." },
        { status: 400 },
      );
    }

    if (!policyId) {
      return NextResponse.json(
        { success: false, message: "policyId is required." },
        { status: 400 },
      );
    }

    const response = await axiosInstanceAuth.post(
      "/insurance-policies/paystack",
      { reference, policy_id: policyId },
    );

    return NextResponse.json(
      { success: true, data: response.data.data },
      { status: response.status || 200 },
    );
  } catch (error: unknown) {
    console.error("Error verifying insurance payment:", error);

    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while verifying the insurance payment.",
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError?.response?.status || 500,
      },
    );
  }
}
