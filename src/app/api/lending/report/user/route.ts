import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Replace with your Prisma client path
import * as XLSX from "xlsx";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url!);
    const userId = searchParams.get("id");

    if (!userId) {
      return res.status(400).json({ error: "User id is required." });
    }

    const borrows = await prisma.borrow.findMany({
      where: {
        userId: Number(userId),
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

    // Prepare worksheet data
    const worksheetData = borrows.map((borrow) => ({
      id: borrow.id,
      book: borrow.book.title,
      user: borrow.user.name,
      borrowedAt: borrow.borrowAt,
      returnedAt: borrow.returnAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Users ${userId} id's Borrows`
    );

    const fileName = `users-${userId}-borrows.xlsx`;
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/vnd.ms-excel",
      },
    });
  } catch (error) {
    console.error("Error getting borrows:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
