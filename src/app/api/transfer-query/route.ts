"use server";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { axiosInstanceAuth } from "@/requests/processor";

export async function POST(req: NextRequest) {
  try {
    const { vnuban, amount } = await req.json();

    if (!vnuban || !amount) {
      return NextResponse.json(
        { message: "Missing vnuban or amount" },
        { status: 400 }
      );
    }

    const KEY1 = process.env.KEY1;
    const KEY2 = process.env.KEY2;
    

    if (!KEY1 || !KEY2) {
      console.error("Missing env vars for VNUBAN query", {
        KEY1,
        KEY2,
      });
      return NextResponse.json(
        { message: "Internal server configuration error" },
        { status: 500 }
      );
    }
    const now = new Date();

    const utcYear   = now.getUTCFullYear();
    const utcMonth  = String(now.getUTCMonth() + 1).padStart(2, "0");
    const utcDay    = String(now.getUTCDate()).padStart(2, "0");
    const utcHour   = String(now.getUTCHours()).padStart(2, "0");

    const timestampUtc = `${utcYear}${utcMonth}${utcDay}${utcHour}`
    const timestamp = timestampUtc;
    const currentTimestamp = Math.floor(Date.now() / 1000).toString();
    const hashInput = `${timestamp}${vnuban}${amount}${KEY2}`;
    const hash = crypto.createHash("sha512").update(hashInput).digest("hex");

    console.log("VNUBAN Request Payload:", {
      vnuban,
      amount,
      currentTimestamp,
      hash,
    });

    // Use axiosInstanceAuth instead of fetch()
    const response = await axiosInstanceAuth.post(
      "/vnuban-webhooks/query",
      {
        vnuban,
        amount,
        timestamp,
        hash,
        key1: KEY1,
      }
    );

    console.log("VNUBAN API Response:", response.data);

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error("VNUBAN Query Error:", error);
    console.error("API Error Response:", error.response?.data);

    return NextResponse.json(
      {
        message: "Failed to query bank transfer.",
        error: error.response?.data,
      },
      {
        status: error.response?.status || 500,
      }
    );
  }
}
