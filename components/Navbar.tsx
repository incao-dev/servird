"use client";

import Link from "next/link";
import { MTNavbar, MTIconButton } from "@/lib/mt";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  return (
    <MTNavbar className="sticky top-0 z-50 mx-auto max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-3 bg-[#1a1a1a] border-none shadow-none">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-white cursor-pointer">
            Servi<span className="text-[#FBBF24]">RD</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#how"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cómo funciona
          </Link>
          <Link
            href="/#categories"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Categorías
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="bg-[#FBBF24] text-[#1a1a1a] text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#f0a500] transition-colors"
          >
            Soy proveedor
          </Link>
        </div>
      </div>
    </MTNavbar>
  );
}