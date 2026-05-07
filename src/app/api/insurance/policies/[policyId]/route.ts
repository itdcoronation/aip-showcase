import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(
  _request: Request,
  context: { params: Promise<{ policyId: string }> },
) {
  try {
    const { policyId } = await context.params;

    if (!policyId) {
      return NextResponse.json(
        { success: false, message: "Policy ID is required" },
        { status: 400 },
      );
    }

    const response = await axiosInstanceAuth.get(
      `/insurance-policies/${encodeURIComponent(policyId)}`,
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
    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while fetching policy",
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError.response?.status || 500,
      },
    );
  }
}
