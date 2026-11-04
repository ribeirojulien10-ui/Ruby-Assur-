import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { authReady, getAuth } from "@/lib/auth";
import { portalEnabled } from "@/lib/portal/config";

export const dynamic = "force-dynamic";

async function handler(method: "GET" | "POST", req: Request) {
  if (!portalEnabled()) return new NextResponse(null, { status: 404 });
  await authReady();
  const h = toNextJsHandler(getAuth());
  return method === "GET" ? h.GET(req) : h.POST(req);
}

export const GET = (req: Request) => handler("GET", req);
export const POST = (req: Request) => handler("POST", req);
