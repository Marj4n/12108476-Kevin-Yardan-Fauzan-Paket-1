import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        {
          status: 400,
        }
      );
    }

    const borrows = await prisma.lending.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
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
