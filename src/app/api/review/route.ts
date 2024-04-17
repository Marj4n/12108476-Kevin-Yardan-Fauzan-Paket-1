import { prisma } from "@/lib/prisma";
import { collectionCreationSchema } from "@/schemas/collection";
import { reviewCreationSchema } from "@/schemas/review";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("bookId");

    const review = await prisma.review.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        book: true,
      },
    });

    return NextResponse.json(
      {
        review,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting borrows:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, bookId, rating, review } = reviewCreationSchema.parse(body);

    const createReview = await prisma.review.create({
      data: {
        userId,
        bookId,
        rating,
        review,
      },
    });

    return NextResponse.json(
      {
        createReview,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");

    const collection = await prisma.collection.deleteMany({
      where: {
        userId: Number(userId),
        bookId: Number(bookId),
      },
    });

    return NextResponse.json(
      {
        collection,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}
