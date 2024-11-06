import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    let cookie = request.cookies.get('token')

    if(cookie) {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('login', request.url))
}

export const config = {
    matcher: '/chat/:path*',
}