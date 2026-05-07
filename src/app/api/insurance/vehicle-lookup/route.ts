"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const license_number = searchParams.get("license_number");

    if (!license_number) {
      return NextResponse.json(
        { success: false, message: "license_number is required." },
        { status: 400 },
      );
    }

    const response = await axiosInstanceAuth.get(
      `/insurance-policies/vehicle-data?license_number=${encodeURIComponent(license_number)}`,
    );

    return NextResponse.json(
      { success: true, data: response.data.data },
      { status: response.status || 200 },
    );
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while fetching vehicle information.",
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError?.response?.status || 500,
      },
    );
  }
}
