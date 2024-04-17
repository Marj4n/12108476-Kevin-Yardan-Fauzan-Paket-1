import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLogin } from "@/lib/utils";
import { lendingCreationSchema } from "@/schemas/lending";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (bookId) {
      const borrow = await prisma.lending.findMany({
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

    const borrows = await prisma.lending.findMany({
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

export async function POST(req: NextRequest) {
  if (!isLogin(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const body = await req.json();
    const { userId, bookId } = lendingCreationSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });
    if (!book) {
      return NextResponse.json(
        {
          error: "Book not found.",
        },
        {
          status: 404,
        }
      );
    }

    // and not returned yet
    const existingBorrow = await prisma.lending.findFirst({
      where: {
        userId,
        bookId,
        status: false,
      },
    });

    if (existingBorrow) {
      return NextResponse.json(
        {
          error: "Already borrowed.",
        },
        {
          status: 400,
        }
      );
    }

    const borrow = await prisma.lending.create({
      data: {
        userId,
        bookId,
      },
    });

    return NextResponse.json(
      {
        borrow,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating borrow:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", message: error },
      {
        status: 500,
      }
    );
  }
}

// make the return of the book
export async function PUT(req: NextRequest) {
  if (!isLogin(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const borrowId = searchParams.get("id");

    const borrow = await prisma.lending.findUnique({
      where: {
        id: Number(borrowId),
      },
    });

    if (!borrow) {
      return NextResponse.json(
        {
          error: "Borrow not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.lending.update({
      where: {
        id: Number(borrowId),
      },
      data: {
        status: true,
        returnAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Book returned.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating borrow:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isLogin(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const borrowId = searchParams.get("id");
    const borrow = await prisma.lending.findUnique({
      where: {
        id: Number(borrowId),
      },
    });

    if (!borrow) {
      return NextResponse.json(
        {
          error: "Borrow not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.lending.delete({
      where: {
        id: Number(borrowId),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "borrow deleted.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting borrow:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}
