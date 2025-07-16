import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/dashboard', '/hourly-report', '/daily-report', '/weekly-report', '/profile']
  return protectedRoutes.some(route => pathname.startsWith(route))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}