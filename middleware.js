import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const pathname = url.pathname

  // ⛔ Blokir akses ke route admin lama (jika masih ada yang pakai)
  if (pathname.startsWith('/admin')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // ✅ Tidak perlu rewrite apa pun, semua routing langsung ke /login, /dashboard, dll
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next|_vercel|static|favicon.ico|api/|laravel-api/).*)'],
}
