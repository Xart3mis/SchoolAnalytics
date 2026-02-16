import { NextResponse } from "next/server";

import { isAdminBootstrapped } from "@/lib/auth/bootstrap";

export async function GET() {
  const bootstrapped = await isAdminBootstrapped();
  return NextResponse.json({ bootstrapped });
}
