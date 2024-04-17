"use client";

import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type Props = {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
  };
};

const UserAccountNav = ({ user }: Props) => {
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="w-10 h-10"
          user={{
            name: user.name || null,
            image: "/identicon.png",
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && (
              <b className=" text-black">
                {user.name} || {user.role} || {user.email}
              </b>
            )}
            {user.username && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.username}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="sm:hidden" />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut().catch(console.error);
          }}
          className="text-red-600 cursor-pointer sm:hidden"
        >
          Sign out
          <LogOut className="w-4 h-4 ml-2 " />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
