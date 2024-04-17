"use client";
import { Book } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const ListBook = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    async function getUserSession() {
      const userSession = await getSession();
      setUser(userSession?.user);
    }

    async function fetchBooks() {
      try {
        const response = await fetch("/api/book");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error(error);
      }
    }

    getUserSession();
    fetchBooks();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 justify-between">
              <h2 className="text-lg font-semibold">{book.title}</h2>
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-600 mb-2">
                Published: {!book.published}
              </p>
              <p className="text-sm">{book.description}</p>
              <div className="mt-4 space-x-4">
                <Link href={book.pdf} className="text-blue-500 hover:underline">
                  Read more
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary">Borrow</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure wanna borow this book?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          try {
                            axios.post("/api/borrow", {
                              bookId: Number(book.id),
                              userId: Number(user.id),
                              returnAt: new Date(
                                Date.now() + 2 * 24 * 60 * 60 * 1000
                              ),
                            });
                            toast({
                              title: "Book borrowed",
                              variant: "success",
                            });
                          } catch (error) {
                            console.error("Error borrowing book:", error);
                            toast({
                              title: "Error borrowing book",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Yes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListBook;
