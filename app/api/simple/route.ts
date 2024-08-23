import { NextRequest, NextResponse } from "next/server";

const db = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "umjoon" },
  { id: "3", name: "suke" },
  { id: "4", name: "flem" },
];

export async function GET(request: NextRequest) {
  return NextResponse.json(db);
}
