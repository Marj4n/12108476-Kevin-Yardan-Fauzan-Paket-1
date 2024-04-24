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

interface BookWithLending extends Book {
  isLending: boolean;
}

const ListBook = () => {
  const { toast } = useToast();

  const [books, setBooks] = useState<BookWithLending[]>([]);
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
        console.log(data.books);
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
              className="w-full h-80 object-cover"
            />
            <div className="p-4 justify-between">
              <h2 className="text-lg text-black font-semibold">{book.title}</h2>
              <p className="text-sm text-black mb-2">by {book.author}</p>
              <p className="text-sm text-black mb-2">
                Published: {!book.publication_year}
              </p>
              <p className="text-sm text-black">{book.description}</p>
              <div className="mt-4 space-x-4">
                <Link href={book.pdf} className="text-blue-500 hover:underline">
                  Read more
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {book.isLending ? (
                      <Button variant="secondary" disabled>
                        Borrowed
                      </Button>
                    ) : (
                      <Button variant="secondary">Borrow</Button>
                    )}
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
                        onClick={async () => {
                          try {
                            await axios.post("/api/lending", {
                              bookId: Number(book.id),
                              userId: Number(user.id),
                            });
                            toast({
                              title: "Book borrowed",
                              variant: "success",
                            });
                          } catch (error) {
                            toast({
                              title: "Book already borrowed",
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

                <Button
                  onClick={async () => {
                    try {
                      await axios.post("/api/collection", {
                        bookId: Number(book.id),
                        userId: Number(user.id),
                      });
                      toast({
                        title: "Book added to collection",
                        variant: "success",
                      });
                    } catch (error) {
                      toast({
                        title: "Book already added to collection",
                        variant: "destructive",
                      });
                    }
                  }}
                  variant="secondary"
                >
                  Add to collection
                </Button>

                <Button variant="secondary">
                  <Link href={`/borrow/${book.id}`}>Review</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListBook;
