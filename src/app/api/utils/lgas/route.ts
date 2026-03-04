"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const state_code = url.searchParams.get("state_code");

    // Make the API request
    const response = await axiosInstanceAuth.get(`/states/${state_code}/lgas`);

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during fetching lgas:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error,"An error occurred while fetching lgas."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
