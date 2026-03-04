"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { symbol } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Make the API request to get stock details using GET with request body
    const response = await axiosInstanceAuth.request({
      method: 'GET',
      url: '/market-data/stocks/',
      data: {
        symbol: symbol.toUpperCase(),
      }
    });

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during stock details retrieval:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching stock details."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}