// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Tentukan halaman-halaman yang membutuhkan autentikasi (Protected Routes)
const protectedRoutes = ["/profile", "/history", "/checkout", "/points/checkout", "/payment"];

// 2. Tentukan halaman publik/auth (user yang sudah login tidak perlu masuk ke sini lagi)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil token autentikasi dari cookies (sesuaikan key cookie dengan yang Anda gunakan saat login)
  const token = request.cookies.get("access_token")?.value;

  // Cek status halaman
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // KONDISI 1: User belum login & mencoba mengakses halaman terproteksi
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    const fullPath = pathname + (request.nextUrl.search || "");
    loginUrl.searchParams.set("from", fullPath);
    return NextResponse.redirect(loginUrl);
  }

  // KONDISI 2: User SUDAH login tapi mencoba mengakses halaman login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// 3. Matcher untuk menentukan route mana saja yang harus melewati Middleware
export const config = {
  matcher: [
    /*
     * Jalankan middleware pada semua request KECUALI:
     * - api routes (/api/*)
     * - static files (_next/static, _next/image, favicon.ico, images/assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
