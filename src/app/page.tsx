import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://github.com/Marj4n"
          target="_blank"
          rel="noopener noreferrer"
        >
          By{" "}
          <span className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
            Marj4n
          </span>
        </a>
      </div>

      <div
        className={`grid text-center lg:max-w-5xl lg:w-full lg:mb-0 ${
          user?.role === "admin" ? "lg:grid-cols-4" : "lg:grid-cols-3"
        } lg:text-left`}
      >
        {(user?.role === "admin" || user?.role === "operator") && (
          <Link
            href="/dashboard"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Dashboard{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Check out the dashboard page, where you can create, read, update
              and delete books and users.
            </p>
          </Link>
        )}

        {user?.role === "user" && (
          <Link
            href="/borrow"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Borrow{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Borrow books from our library
            </p>
          </Link>
        )}
      </div>
    </main>
  );
}
