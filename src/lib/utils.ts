import { type ClassValue, clsx } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isLogin(request: NextRequest) {
  const cookie = request.cookies.has("next-auth.session-token");
  return cookie;
}