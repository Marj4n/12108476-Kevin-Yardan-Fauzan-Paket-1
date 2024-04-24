import { prisma } from "@/lib/prisma";
import { isLogin } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    const categoryId = searchParams.get("id");

    // Temukan kategori dengan ID yang diberikan
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
      include: {
        BookCategory: {
          // Sertakan relasi BookCategory
          include: {
            book: true, // Sertakan data buku
          },
        },
      },
    });

    // Jika kategori tidak ditemukan, kirim respons 404
    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Ekstrak informasi buku dari hasil pencarian
    const books = category.BookCategory.map(
      (bookCategory) => bookCategory.book
    );

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
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}
