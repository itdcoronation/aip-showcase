"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const statuses = searchParams.getAll("status[]");
    const page = Number(searchParams.get("page") || "1");
    const perPage = Number(searchParams.get("per_page") || "10");

    const finalStatuses = statuses.length ? statuses : ["active"];

    const query = new URLSearchParams();
    finalStatuses.forEach((s) => query.append("status[]", s));
    query.append("page", String(Number.isNaN(page) || page < 1 ? 1 : page));
    query.append(
      "per_page",
      String(Number.isNaN(perPage) || perPage < 1 ? 10 : perPage),
    );

    const response = await axiosInstanceAuth.get(
      `/insurance-policies/search?${query.toString()}`,
    );

    return NextResponse.json(
      {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      },
      { status: response.status || 200 },
    );
  } catch (error: unknown) {
    console.error("Error fetching insurance policies:", error);

    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while fetching insurance policies.",
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError?.response?.status || 500,
      },
    );
  }
}
