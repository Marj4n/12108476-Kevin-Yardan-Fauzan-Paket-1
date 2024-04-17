import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lendings = await prisma.lending.findMany({
      include: {
        book: true,
        user: true,
      },
    });

    const worksheetData = lendings.map((lending) => ({
      ID: lending.id,
      "Book Title": lending.book.title,
      "Borrowed By": lending.user.username,
      "Lending At": lending.lendingAt,
      "Return At": lending.returnAt,
      status: lending.returnAt ? "Returned" : "Not Returned",
      "Created At": lending.createdAt,
      "Updated At": lending.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Lending-${new Date().toISOString().split("T")[0]}`
    );

    const fileName = `Lending-${new Date().toISOString().split("T")[0]}.xlsx`;
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/vnd.ms-excel",
      },
    });
  } catch (error) {
    console.error("Error getting Lending:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
