"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const search = url.searchParams.get("search");
    const per_page = url.searchParams.get("per_page");

    // Make the API request
    const response = await axiosInstanceAuth.get("/states", {
      params: { search, page, per_page },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during fetching states:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching states."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
