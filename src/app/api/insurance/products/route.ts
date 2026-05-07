"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET() {
  try {
    const response = await axiosInstanceAuth.get(`/insurance-policies/types`);

    return NextResponse.json(
      { success: true, data: response.data.data },
      { status: response.status || 200 },
    );
  } catch (error: unknown) {
    console.error("Error fetching insurance products:", error);

    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while fetching insurance products.",
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError?.response?.status || 500,
      },
    );
  }
}
