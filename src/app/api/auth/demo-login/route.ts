import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Demo login is disabled",
    },
    {
      status: 404,
    },
  );
}
