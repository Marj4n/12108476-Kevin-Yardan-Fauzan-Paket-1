import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("id");

    if (bookId) {
      const borrow = await prisma.borrow.findMany({
        where: {
          bookId: Number(bookId),
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
          book: true,
        },
      });

      return NextResponse.json(
        {
          borrow,
        },
        {
          status: 200,
        }
      );
    }

    const borrows = await prisma.borrow.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        book: true,
      },
    });
    return NextResponse.json(
      {
        borrows,
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
