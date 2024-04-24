import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLogin } from "@/lib/utils";
import { bookCreationSchema, bookUpdateSchema } from "@/schemas/book";

export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      include: {
        BookCategory: {
          select: {
            category: {
              select: {
                name: true, // Select only the category name
              },
            },
          },
          take: 1, // Take only one category
        },
      },
    });

    const booksWithCategoryNames = await Promise.all(
      books.map(async (book) => {
        const category =
          book.BookCategory.length > 0
            ? book.BookCategory[0].category.name
            : null;

        const lending = await prisma.lending.findFirst({
          where: {
            bookId: book.id,
            returnAt: null,
          },
        });

        const isLending = !!lending; // Convert lending to boolean

        return {
          ...book,
          category,
          isLending,
        };
      })
    );

    return NextResponse.json(
      {
        books: booksWithCategoryNames,
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
      categoryId,
    } = bookCreationSchema.parse(body);

    // Periksa apakah ID kategori yang diberikan ada dalam database
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    // Jika ID kategori tidak ditemukan, beri respons dengan status 400 (Bad Request)
    if (!existingCategory) {
      return NextResponse.json(
        {
          error: "Category ID not found.",
        },
        {
          status: 400,
        }
      );
    }

    // Buat buku baru dan hubungkan dengan kategori yang sudah ada berdasarkan ID
    const book = await prisma.book.create({
      data: {
        title,
        author,
        publisher,
        publication_year,
        description,
        pdf,
        cover,
        BookCategory: {
          create: {
            category: { connect: { id: categoryId } }, // Hubungkan dengan kategori berdasarkan ID
          },
        },
      },
      include: {
        BookCategory: true, // Sertakan data kategori dalam respons
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
    } = bookUpdateSchema.parse(body);

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

    // Convert publication_year to ISO-8601 DateTime format
    const formattedPublicationYear = publication_year
      ? new Date(publication_year).toISOString()
      : "";

    await prisma.book.update({
      where: {
        id: Number(bookId),
      },
      data: {
        title,
        author,
        publisher,
        publication_year: formattedPublicationYear,
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

    const bookCategory = await prisma.bookCategory.findFirst({
      where: {
        bookId: Number(bookId),
      },
    });

    const bookLending = await prisma.lending.findFirst({
      where: {
        bookId: Number(bookId),
      },
    });

    const bookCollection = await prisma.collection.findFirst({
      where: {
        bookId: Number(bookId),
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

    // delete all related data
    if (bookCategory) {
      await prisma.bookCategory.delete({
        where: {
          id: bookCategory.id,
        },
      });
    }

    if (bookLending) {
      await prisma.lending.delete({
        where: {
          id: bookLending.id,
        },
      });
    }

    if (bookCollection) {
      await prisma.collection.delete({
        where: {
          id: bookCollection.id,
        },
      });
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
