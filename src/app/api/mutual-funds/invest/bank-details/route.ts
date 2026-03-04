"use server";

import { NextResponse } from "next/server";
import { axiosInstanceAuth } from "@/requests/processor";
import { apiErrorHandler } from "@/lib/error-sanitization";

export async function GET(req: Request) {
  try {
    console.log('=== BANK DETAILS API ROUTE HIT ===');
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    console.log('Bank details API called with productId:', productId);
    console.log('Full URL:', req.url);

    if (!productId) {
      console.log('Missing productId, returning 400');
      return NextResponse.json(
        {
          success: false,
          message: "Product ID parameter is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Make the API request to get customer account details including NUBAN
    console.log('Making request to /customeraccount/nuban...');
    const response = await axiosInstanceAuth.get('/customeraccount/nuban');

    // Find the investment account that matches the productId
    const investmentAccounts = response.data?.Data?.investment_accounts || [];
    const matchingAccount = investmentAccounts.find(
      (account: any) => account.ProductId === productId
    );

    if (!matchingAccount) {
      return NextResponse.json(
        {
          success: false,
          message: "No investment account found for this product.",
          productId,
        },
        {
          status: 404,
        }
      );
    }

    // Return the matching account details along with banking information
    return NextResponse.json({
      success: true,
      data: {
        investment_account: matchingAccount,
        banking_information: response.data?.Data?.banking_information || null,
        user_id: response.data?.user_id,
      },
    });

  } catch (error: any) {
    // Log the error for debugging purposes
    console.error("Error during bank details fetch:", error);

    return NextResponse.json(
      {
        success: false,
        message: apiErrorHandler(error, "An error occurred while fetching bank details."),
        error: error.response?.data,
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}