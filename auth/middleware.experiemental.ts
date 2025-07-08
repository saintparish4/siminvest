'use server';

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function expMiddleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: "nodejs",
    matcher: ["/dashboard/:path*"], // Apply middleware to specific routes
};