import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get('adminToken')?.value;

    // Protect admin routes
    if (pathname.startsWith('/admin') && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If logged in and trying to access login, redirect to admin home
    if (pathname === '/auth/login' && token) {
        return NextResponse.redirect(new URL('/admin/home', request.url));
    }

    return NextResponse.next();
}
