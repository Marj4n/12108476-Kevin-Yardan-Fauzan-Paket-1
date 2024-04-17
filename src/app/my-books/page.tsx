"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@prisma/client";
import axios from "axios";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const MyBookPage = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState<any>();
  const toast = useToast();

  useEffect(() => {
    async function getUserSession() {
      const userSession = await getSession();
      setUser(userSession?.user);
    }
    async function fetchBooks() {
      try {
        const response = await axios.get(`/api/collection?userId=${user?.id}`);
        setData(response.data.collection);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }

    getUserSession();
    fetchBooks();
  }, [user?.id]);

  return (
    <div>
      <h1>My collection Books</h1>
      <ul>
        {data.map((book) => (
          <li key={book.id} className="border p-4 my-4">
            <img
              src={book.book.cover}
              alt={book.book.title}
              className="w-24 h-24"
            />
            <p>{book.book.title}</p>
            <p>{book.book.author}</p>
            <p>{book.book.publisher}</p>
            <p>{book.book.published}</p>
            <p>{book.book.description}</p>
            <Button
              onClick={async () => {
                // delete with url param bookId and userId
                await axios.delete(
                  `/api/collection?bookId=${book.id}&userId=${user?.id}`
                );
                toast({
                  title: "Book removed",
                  message: `${book.book.title} has been removed from your collection`,
                });
                setData(data.filter((item) => item.id !== book.id));
              }}
            >
              remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookPage;
