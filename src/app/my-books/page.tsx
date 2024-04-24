"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Book } from "@prisma/client";
import axios from "axios";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyCollectionPage = () => {
  const [collection, setCollection] = useState<any>([]);
  const [user, setUser] = useState<any>();
  const { toast } = useToast();

  useEffect(() => {
    async function getUserSession() {
      const userSession = await getSession();
      setUser(userSession?.user);
    }

    async function fetchCollection() {
      try {
        const response = await axios.get(`/api/collection?userId=${user?.id}`);
        setCollection(response.data.collection);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    }

    getUserSession();
    fetchCollection();
  }, [user?.id]);

  if (collection.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-8">
        <h1 className="text-3xl font-bold mb-4">My Collection</h1>
        <p className="text-gray-600">
          You don't have any books in your collection.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4">My Collection</h1>
      <ul>
        {collection.map((item: { book: Book }) => (
          <li
            key={item.book.id}
            className="border rounded-lg p-4 my-4 flex items-center"
          >
            <img
              src={item.book.cover}
              alt={item.book.title}
              className="w-24 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h2 className="text-lg font-semibold mb-2">{item.book.title}</h2>
              <p className="text-gray-600">Author: {item.book.author}</p>
              <p className="text-gray-600">Publisher: {item.book.publisher}</p>
              <p className="text-gray-600">
                Publication Year: {/* only display year */}
                {new Date(item.book.publication_year!).getFullYear()}
              </p>
              <p className="text-gray-600">{item.book.description}</p>
            </div>
            <Button
              onClick={async () => {
                try {
                  await axios.delete(
                    `/api/collection?bookId=${item.book.id}&userId=${user?.id}`
                  );
                  toast({
                    title: "Book removed",
                  });
                  setCollection(
                    collection.filter(
                      (collectionItem: any) =>
                        collectionItem.book.id !== item.book.id
                    )
                  );
                } catch (error) {
                  console.error("Error removing book:", error);
                }
              }}
              className="ml-auto"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyCollectionPage;
