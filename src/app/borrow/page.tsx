import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { CardDescription, CardTitle } from "@/components/ui/card";
import ListBook from "./ListBook";

export const metadata = {
  title: "Online Library | Borrow",
};

export default async function BorrowPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "user") {
    return redirect("/");
  }
  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="items-start flex flex-col">
        <CardTitle className="text-3xl font-bold tracking-tight xs:hidden sm:block">
          Borrow book from us
        </CardTitle>
        <CardDescription className="xs:hidden sm:block">
          List of book at out library
        </CardDescription>
      </div>
      <div className="container mx-auto py-10 !px-0">
        <ListBook />
      </div>
    </main>
  );
}
