import { getServerSession } from "next-auth";
import { LoginForm } from "./form";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { LibraryBigIcon } from "lucide-react";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/");
  }

  return (
    <section>
      <div className="flex flex-col items-center justify-center gap-0 px-6 py-8 mx-auto md:flex-row md:items-center md:justify-center md:gap-16 h-[90vh]">
        <a
          href="#"
          className="flex items-center xs:mb-8 md:mb-0 text-2xl font-semibold text-gray-900"
        >
          <LibraryBigIcon
            className="dark:invert"
            width={320}
            height={120}
          />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
