import { CardDescription, CardTitle } from "@/components/ui/card";
import React from "react";
import { UpdateForm } from "./form";

const UpdatePage = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="items-start flex flex-col">
        <CardTitle className="text-3xl font-bold tracking-tight xs:hidden sm:block">
          Update book
        </CardTitle>
        <CardDescription className="xs:hidden sm:block">
          Update book's information.
        </CardDescription>
      </div>
      <div className="container mx-auto py-10 !px-0">
        <UpdateForm bookId={id} />
      </div>
    </main>
  );
};

export default UpdatePage;
