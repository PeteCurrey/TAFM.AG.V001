import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('tafm_session')?.value

  // Protected paths
  const isAdminPath = pathname.startsWith('/admin')
  const isAccountPath = pathname.startsWith('/account')
  const isProviderPath = pathname.startsWith('/provider')

  if (isAdminPath || isAccountPath || isProviderPath) {
    if (!sessionToken) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/provider/:path*'],
}
