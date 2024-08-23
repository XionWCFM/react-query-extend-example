import { NextRequest, NextResponse } from "next/server";

const db = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "umjoon" },
  { id: "3", name: "suke" },
  { id: "4", name: "flem" },
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(db);
}
