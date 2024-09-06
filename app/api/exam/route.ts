import { delay } from "es-toolkit";
import { NextRequest, NextResponse } from "next/server";

let data = { message: "hello" };

export async function GET(request: NextRequest) {
  await delay(5000);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  await delay(500);
  data = { message: data.message === "hello" ? "world" : "hello" };
  return NextResponse.json({ message: "good" });
}
