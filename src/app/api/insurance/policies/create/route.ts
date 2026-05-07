"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

const requiredFields = [
  "license_number",
  "start_date",
  "type",
  "kind",
  "vehicle_type",
  "title",
  "first_name",
  "last_name",
  "birth_date",
  "phone",
  "email",
  "state",
  "city",
  "street",
  "house_number",
  "identification_document_media",
  "proof_of_ownership_media",
] as const;

export async function POST(request: Request) {
  try {
    const body = await request.formData();

    for (const field of requiredFields) {
      const value = body.get(field);
      if (!value) {
        return NextResponse.json(
          { success: false, message: `${field} is required.` },
          { status: 400 },
        );
      }
    }

    const response = await axiosInstanceAuth.post(
      "/insurance-policies/create",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return NextResponse.json(
      { success: true, data: response.data.data },
      { status: response.status || 200 },
    );
  } catch (error: unknown) {
    console.error("Error creating insurance policy:", error);

    const axiosError = error as {
      response?: { data?: unknown; status?: number };
    };

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(
          error,
          "An error occurred while creating the insurance policy.",
        ),
        error: axiosError.response?.data,
      },
      {
        status: axiosError?.response?.status || 500,
      },
    );
  }
}
