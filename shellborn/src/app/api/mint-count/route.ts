import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: 10000,
    total: 10000,
    remaining: 0,
    status: "MINTED_OUT",
    percentage: 100,
  });
}
