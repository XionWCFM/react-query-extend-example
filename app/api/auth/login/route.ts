import { NextRequest, NextResponse } from "next/server";

const token = "hsfkmdlfmkldsmfklsfk3214324dfskml";
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ message: "Token generated" });
  response.headers.set("Authorization", `Bearer ${token}`);
  return response;
}
