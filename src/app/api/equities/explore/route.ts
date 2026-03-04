"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '100';
    const search = searchParams.get('search') || '';
    const sector = searchParams.get('sector') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build query parameters
    const params = new URLSearchParams({
      page,
      per_page,
    });

    // Add optional parameters if provided
    if (search) params.append('search', search);
    if (sector) params.append('sector', sector);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    // Make the API request to get stocks
    const response = await axiosInstanceAuth.get(`/market-data/stocks?${params.toString()}`);

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status || 200 }
    );
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during stock exploration:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching stocks."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}