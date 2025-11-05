"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "@/lib/auth";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAuth(!!getToken());
  }, []);

  function logout() {
    clearToken();
    setIsAuth(false);
    window.location.href = "/";
  }

  const isActive = (path: string) =>
    pathname === path ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-500";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PostManager
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuth ? (
              <>
                <Link href="/auth/login" className={`px-3 py-2 text-sm rounded-md ${isActive("/auth/login")}`}>
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={`px-3 py-2 text-sm rounded-md ${isActive("/dashboard")}`}>
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-3 shadow-sm">
          {!isAuth ? (
            <div className="flex flex-col space-y-2 mt-2">
              <Link href="/auth/login" className={`block px-3 py-2 rounded-md ${isActive("/auth/login")}`}>
                Login
              </Link>
              <Link
                href="/auth/register"
                className="block px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-center"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 mt-2">
              <Link href="/dashboard" className={`block px-3 py-2 rounded-md ${isActive("/dashboard")}`}>
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="block px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md text-center"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
