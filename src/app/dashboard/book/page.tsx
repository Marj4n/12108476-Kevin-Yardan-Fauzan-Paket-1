import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DataResponse from "./data-response";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Book Dashboard | Online Library",
};

export default async function BookPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "admin" && user?.role !== "operator") {
    return redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="items-start flex flex-col">
        <CardTitle className="text-3xl font-bold tracking-tight xs:hidden sm:block">
          Book Dashboard
        </CardTitle>
        <CardDescription className="xs:hidden sm:block">
          This page is only accessible to admin users, and will display book
          data.
        </CardDescription>
      </div>
      <div className="container mx-auto py-10 !px-0">
        <DataResponse />
      </div>
    </main>
  );
}
