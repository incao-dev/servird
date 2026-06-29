"use client";

import Link from "next/link";
import { MTNavbar, MTInput, MTIconButton } from "@/lib/mt";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  return (
    <MTNavbar className="sticky top-0 z-50 mx-auto max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-3">
      <div className="flex items-center justify-between text-blue-gray-900">
        {/* Logo - left */}
        <Link href="/home" className="flex items-center">
          <span className="text-xl font-bold cursor-pointer">
            YourLogo
          </span>
        </Link>

        {/* Search bar - center */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="w-full max-w-md">
            <MTInput
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* About + User - right */}
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="font-medium text-sm hover:text-blue-500 transition-colors"
          >
            About
          </Link>

          <Link href="/profile">
            <MTIconButton variant="text" className="rounded-full">
              <UserCircleIcon className="h-7 w-7" />
            </MTIconButton>
          </Link>
        </div>
      </div>
    </MTNavbar>
  );
}