import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Online Library | Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "admin" && user?.role !== "operator") {
    return redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="items-start flex flex-col">
        <CardTitle className="text-3xl font-bold tracking-tight xs:hidden sm:block">
          Dashboard
        </CardTitle>
        <CardDescription className="xs:hidden sm:block">
          This page is only accessible to admin users, and will display user
          data.
        </CardDescription>
      </div>
      <div className="container mx-auto py-10 !px-0">
        <div
          className={`mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 ${
            user?.role === "admin" ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } lg:text-left`}
        >
          {user?.role === "admin" && (
            <Link
              href="/dashboard/user"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                User{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                Check out the user page, where you can create, read, update and
                delete users.
              </p>
            </Link>
          )}
          <Link
            href="/dashboard/book"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Book{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Check out the book page, where you can create, read, update and
              delete books.
            </p>
          </Link>
          <Link
            href={"/dashboard/category"}
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Category{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Check out the category page, where you can create, read, update
              and delete categories.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
