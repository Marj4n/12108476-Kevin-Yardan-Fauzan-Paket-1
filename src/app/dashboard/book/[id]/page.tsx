"use client";
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
  borrowAt: string;
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
        const response = await axios.get(`/api/borrow/?bookId=${id}`);

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
      {bookBorrows.map((borrow) => (
        <div key={borrow.id}>
          <h2>{borrow.book.title}</h2>
          <p>Borrowed by: {borrow.user.username}</p>
          <p>Borrowed at: {new Date(borrow.borrowAt).toLocaleDateString()}</p>
          <p>Return at: {new Date(borrow.returnAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default BorrowedPage;
