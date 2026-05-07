"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

const deleteDraftPolicy = async (
  _request: Request,
  context: { params: Promise<{ policyId: string }> },
) => {
  try {
    const { policyId } = await context.params;

    if (!policyId) {
      return NextResponse.json(
        { success: false, message: "Policy ID is required" },
        { status: 400 },
      );
    }

    const response = await axiosInstanceAuth.delete(
      `/insurance-policies/delete/${encodeURIComponent(policyId)}`,
    );

    return NextResponse.json(
      { success: true, data: response.data?.data ?? response.data },
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
          "An error occurred while deleting the insurance policy.",
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError?.response?.status || 500,
      },
    );
  }
};

export async function DELETE(
  request: Request,
  context: { params: Promise<{ policyId: string }> },
) {
  return deleteDraftPolicy(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ policyId: string }> },
) {
  return deleteDraftPolicy(request, context);
}
