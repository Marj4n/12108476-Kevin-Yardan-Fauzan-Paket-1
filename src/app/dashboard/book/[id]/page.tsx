"use client";
import { ExportLendingButton } from "@/components/dashboard/ExportButton";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

interface BorrowedPageProps {
  params: {
    id: string;
  };
}

interface Borrow {
  id: number;
  userId: number;
  bookId: number;
  lendingAt: string;
  returnAt: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
  book: {
    id: number;
    title: string;
    author: string;
    publisher: string;
    published: string;
    description: string;
    pdf: string;
    cover: string;
    createdAt: string;
    updatedAt: string;
  };
}

const BorrowedPage: React.FC<BorrowedPageProps> = ({ params }) => {
  const { id } = params;
  const [bookBorrows, setBookBorrows] = useState<Borrow[]>([]);

  useEffect(() => {
    async function fetchBorrows() {
      try {
        const response = await axios.get(`/api/lending/?bookId=${id}`);
        setBookBorrows(response.data.borrow);
      } catch (error) {
        console.error("Error fetching borrows:", error);
      }
    }

    fetchBorrows();
  }, [id]);

  if (!id) {
    // center the text
    return (
      <div className="text-red-500 flex justify-center items-center h-96">
        No book ID provided.
      </div>
    );
  }

  if (bookBorrows.length === 0) {
    return (
      // tengahin text pake align center gimana sih biar di tengah page
      <div className="flex justify-center items-center h-96">
        No borrow records found for this book.
      </div>
    );
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">Borrowed Books</h1>
      <ExportLendingButton />
      <ul>
        {bookBorrows.map((borrow) => (
          <li key={borrow.id} className="border p-4 my-4">
            <h2 className="text-xl font-semibold mb-2">{borrow.book.title}</h2>
            <p className="text-gray-400">Borrowed by: {borrow.user.username}</p>
            <p className="text-gray-400">
              Borrowed at: {new Date(borrow.lendingAt).toLocaleDateString()}
            </p>
            <p className="text-gray-400">
              Return at:{" "}
              {borrow.returnAt
                ? new Date(borrow.returnAt).toLocaleDateString()
                : "Not returned yet"}
            </p>
            {!borrow.returnAt && (
              <Button
                onClick={async () => {
                  try {
                    await axios.put(`/api/lending/?id=${borrow.id}`);
                    const updatedBorrows = bookBorrows.map((b) => {
                      if (b.id === borrow.id) {
                        return {
                          ...b,
                          returnAt: new Date().toISOString(),
                        };
                      }
                      return b;
                    });
                    setBookBorrows(updatedBorrows);
                  } catch (error) {
                    console.error("Error returning book:", error);
                  }
                }}
                variant="outline"
                className="mt-2"
              >
                Return
              </Button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default BorrowedPage;
