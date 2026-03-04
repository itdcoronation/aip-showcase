"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fund_filter = url.searchParams.get("fund_filter");

    if (!fund_filter) {
      return NextResponse.json(
        {
          success: false,
          message: "fund_filter parameter is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Make the API request
    const response = await axiosInstanceAuth.get(
      "/customeraccount/fundsfactsheet",
      {
        params: {
          fund_filter,
          view_type: "full",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during fund details fetch:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching fund details."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}