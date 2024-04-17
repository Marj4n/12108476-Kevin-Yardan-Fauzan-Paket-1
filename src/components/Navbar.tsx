import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { LoginButton, LogoutButton } from "./AuthButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import { Book } from "lucide-react";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-900 z-[10] h-fit border-b border-zinc-500 py-3 ">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link
          href={"/"}
          className="flex items-center gap-2 transition-all hover:-translate-y-[2px] "
        >
          {/* <Image alt="logoaps" src="/favicon.ico" width={30} height={30} /> */}
          <p className="rounded-lg px-1 py-1 text-xl font-bold md:block dark:border-white font-montserrat tracking-normal">
            Online Library
          </p>
        </Link>
        <div className="flex items-center">
          <ThemeToggle className="mr-4" />
          {session?.user ? (
            <div className="flex items-center gap-8">
              <LogoutButton />
              <UserAccountNav user={session.user} />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
