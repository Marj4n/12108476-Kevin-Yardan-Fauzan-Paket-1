import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const books = await prisma.book.findMany();

    const worksheetData = books.map((book) => ({
      ID: book.id,
      Title: book.title,
      Author: book.author,
      Publisher: book.publisher,
      "Publication Year": book.publication_year,
      Description: book.description,
      PDF: book.pdf,
      Cover: book.cover,
      "Created At": book.createdAt,
      "Updated At": book.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Books-${new Date().toISOString().split("T")[0]}`
    );

    const fileName = `Books-${new Date().toISOString().split("T")[0]}.xlsx`;
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
