import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLogin } from "@/lib/utils";
import { bookCreationSchema } from "@/schemas/book";

export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(
      {
        books,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting books:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", message: error },
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
    const {
      title,
      author,
      publisher,
      publication_year,
      description,
      pdf,
      cover,
    } = bookCreationSchema.parse(body);

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publisher,
        publication_year,
        description,
        pdf,
        cover,
      },
    });

    return NextResponse.json(
      {
        book,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", message: error },
      {
        status: 500,
      }
    );
  }
}

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
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("id");
    const {
      title,
      author,
      publisher,
      publication_year,
      description,
      pdf,
      cover,
    } = bookCreationSchema.parse(body);

    const book = prisma.book.findUnique({
      where: {
        id: Number(bookId),
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

    await prisma.book.update({
      where: {
        id: Number(bookId),
      },
      data: {
        title,
        author,
        publisher,
        publication_year,
        description,
        pdf,
        cover,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Book updated.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", message: error },
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
    const bookId = searchParams.get("id");
    const book = await prisma.book.findUnique({
      where: {
        id: Number(bookId),
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

    await prisma.book.delete({
      where: {
        id: Number(bookId),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Book deleted.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", message: error },
      {
        status: 500,
      }
    );
  }
}
