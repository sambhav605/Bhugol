import { NextResponse, NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }
}

export const config = {
  matcher: ['/((?!maintenance|_next|favicon.ico|.*\\.png).*)'],
}