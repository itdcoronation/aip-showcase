"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fund_filter = url.searchParams.get("fund_filter");
    const view_type = url.searchParams.get("view_type");
    const page = url.searchParams.get("page");
    const per_page = url.searchParams.get("per_page");

    // Make the API request
    const response = await axiosInstanceAuth.get(
      "/customeraccount/fundsfactsheet",
      {
        params: {
          fund_filter,
          view_type,
          page,
          per_page,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during fact sheet fetch:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching fact sheet."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
