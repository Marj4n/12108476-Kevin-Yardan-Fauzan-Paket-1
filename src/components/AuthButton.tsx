"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
  return (
    <button
      onClick={() => signIn()}
      className="xs:px-2.5 sm:px-4 xs:py-2 sm:py-1.5 font-bold text-white bg-black rounded-md hover:bg-gray-900 dark:bg-gray-700"
    >
      <div className="flex flex-row gap-2 items-center">
        <span className="xs:hidden sm:block">Sign In</span>
        <LogIn className="xs:block md:block sm:hidden" />
      </div>
    </button>
  );
};

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="xs:hidden sm:block xs:px-2.5 sm:px-4 xs:py-2 sm:py-1.5 font-bold text-white bg-black rounded-md hover:bg-gray-900 dark:bg-gray-700"
    >
      <div className="flex flex-row gap-2 items-center">
        <span className="xs:hidden sm:block">Sign Out</span>
        <LogOut className="xs:block md:block sm:hidden" />
      </div>
    </button>
  );
};
