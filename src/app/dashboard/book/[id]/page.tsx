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

        console.log(response.data.borrow);
        setBookBorrows(response.data.borrow);
      } catch (error) {
        console.error("Error fetching borrows:", error);
      }
    }

    fetchBorrows();
  }, [id]);

  if (!id) {
    return <div>No book ID provided.</div>;
  }

  if (bookBorrows.length === 0) {
    return <div>No borrow records found for this book.</div>;
  }

  return (
    <div>
      <h1>Borrowed Books</h1>
      <ExportLendingButton />
      <ul>
        {bookBorrows.map((borrow) => (
          <li key={borrow.id} className="border p-4 my-4">
            <h2>{borrow.book.title}</h2>
            <p>Borrowed by: {borrow.user.username}</p>
            <p>
              Borrowed at: {new Date(borrow.lendingAt).toLocaleDateString()}
            </p>
            {/* check if return is null then not return yet */}
            <p>
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
              >
                Return
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BorrowedPage;
