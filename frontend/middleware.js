import { NextResponse } from "next/server";

export function middleware(request) {
    if (request.nextUrl.pathname === "/auth/login") {
        return NextResponse.redirect(new URL("/admin/home", request.url));
    }
    return NextResponse.next();
}
