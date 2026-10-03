// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cek apakah user sedang login setiap kali route berubah
  useEffect(() => {
    const token = getCookie("access_token");
    const name = getCookie("user_name");
    setIsAuth(!!token);
    setUserName((typeof name === "string" ? name : "") || "");
  }, [pathname]);

  const handleLogout = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    deleteCookie("user_name");
    setIsAuth(false);
    setUserName("");
    router.push("/login");
  };

  const navItemClass = (href: string) =>
    `block text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Toztel
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`${pathname === "/" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"} text-sm font-medium transition-colors`}
            >
              Beranda
            </Link>
            <Link
              href="/privacy"
              className={`${pathname === "/privacy" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"} text-sm font-medium transition-colors`}
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/term-of-service"
              className={`${pathname === "/term-of-service" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"} text-sm font-medium transition-colors`}
            >
              Syarat dan Ketentuan
            </Link>
            <Link
              href="/about-us"
              className={`${pathname === "/about-us" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"} text-sm font-medium transition-colors`}
            >
              Tentang Kami
            </Link>
            <Link
              href="/schedule"
              className={`${pathname === "/schedule" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"} text-sm font-medium transition-colors`}
            >
              Cek Jadwal
            </Link>

            {!isAuth && (
              <>
                <Link
                  href="/login"
                  className={`${pathname === "/login" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"} text-sm font-medium transition-colors`}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className={`${pathname === "/register" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"} text-sm font-medium transition-colors`}
                >
                  Daftar
                </Link>
              </>
            )}

            {isAuth && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  {userName || "Akun"}
                  <svg
                    className={`ml-2 -mr-1 h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className={navItemClass("/profile")}
                    >
                      Profile Saya
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setDropdownOpen(false)}
                      className={navItemClass("/history")}
                    >
                      Riwayat Booking
                    </Link>
                    <Link
                      href="/points"
                      onClick={() => setDropdownOpen(false)}
                      className={navItemClass("/points")}
                    >
                      Top Up Point
                    </Link>
                    <Link
                      href="/transaction"
                      onClick={() => setDropdownOpen(false)}
                      className={navItemClass("/transaction")}
                    >
                      Riwayat Transaksi
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-600 hover:text-blue-600 p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={navItemClass("/")}
          >
            Beranda
          </Link>
          <Link
            href="/privacy"
            onClick={() => setIsOpen(false)}
            className={navItemClass("/privacy")}
          >
            Kebijakan Privasi
          </Link>
          <Link
            href="/term-of-service"
            onClick={() => setIsOpen(false)}
            className={navItemClass("/term-of-service")}
          >
            Syarat dan Ketentuan
          </Link>
          <Link
            href="/about-us"
            onClick={() => setIsOpen(false)}
            className={navItemClass("/about-us")}
          >
            Tentang Kami
          </Link>
          <Link
            href="/schedule"
            onClick={() => setIsOpen(false)}
            className={navItemClass("/schedule")}
          >
            Cek Jadwal
          </Link>

          {!isAuth ? (
            <>
              <div className="border-t border-gray-100 my-1" />
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className={navItemClass("/login")}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className={navItemClass("/register")}
              >
                Daftar
              </Link>
            </>
          ) : (
            <>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span>{userName || "Akun"}</span>
                <svg
                  className={`ml-2 -mr-1 h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="mt-1 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={navItemClass("/profile")}
                  >
                    Profile Saya
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={navItemClass("/history")}
                  >
                    Riwayat Booking
                  </Link>
                  <Link
                    href="/points"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={navItemClass("/points")}
                  >
                    Top Up Point
                  </Link>
                  <Link
                    href="/transaction"
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsOpen(false);
                    }}
                    className={navItemClass("/transaction")}
                  >
                    Riwayat Transaksi
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
};
