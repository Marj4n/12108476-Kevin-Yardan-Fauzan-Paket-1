"use client";

import { Review } from "@prisma/client";
import axios from "axios";
import { getSession } from "next-auth/react";
import { userAgent } from "next/server";
import { useEffect, useState } from "react";

const ReviewPage = ({ params }: { params: { id: number } }) => {
  const [review, setReview] = useState<Review[]>([]);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    async function getUserSession() {
      const userSession = await getSession();
      setUser(userSession?.user);
    }

    getUserSession();
  }, []);

  const submithandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rating = formData.get("rating");
    const review = formData.get("review");
    try {
      const response = await axios.post("/api/review", {
        rating: Number(rating),
        review,
        bookId: Number(params.id),
        userId: Number(user.id),
      });
      // TypeError: prevReview is not iterable
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  useEffect(() => {
    async function fetchReview() {
      try {
        const response = await axios.get(
          `/api/review/?bookId=${params.id}`
        );
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    }

    fetchReview();
  }, [params.id]);
  return (
    <div>
      <form onSubmit={submithandler}>
        {/* check bookid ada apa ga */}
        {}
        <label>
          Rating:
          <input type="number" name="rating" />
        </label>
        <label>
          Review:
          <input type="text" name="review" />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h1>
        List of reviews for book {params.id}.
        {/* {review.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <h2>{review.rating}</h2>
            <p>{review.review}</p>
          </div>
        ))} */}
      </h1>
    </div>
  );
};

export default ReviewPage;
