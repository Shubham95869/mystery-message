'use client'
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4 md:grid-cols-3 md:px-6 md:py-4">
        {/* Left: title */}
        <Link
          href="/"
          className="whitespace-nowrap text-base font-bold sm:text-lg md:text-xl"
        >
          Mystery Message
        </Link>

        {/* Middle: welcome text */}
        <div className="min-w-0 text-center text-xs sm:text-sm md:text-base">
          {status === "loading" ? (
            <span className="text-gray-500">Loading...</span>
          ) : session ? (
            <span className="block truncate">
              Welcome, {user?.username || user?.email}
            </span>
          ) : null}
        </div>

        {/* Right: auth button */}
        <div className="justify-self-end">
          {session ? (
            <Button size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              Logout
            </Button>
          ) : status !== "loading" ? (
            <Link href="/sign-in">
              <Button size="sm">Login</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;