import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await prisma.category.findMany();

    const worksheetData = categories.map((category) => ({
      ID: category.id,
      Name: category.name,
      "Created At": category.createdAt,
      "Updated At": category.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Categories-${new Date().toISOString().split("T")[0]}`
    );

    const fileName = `Categories-${new Date().toISOString().split("T")[0]}.xlsx`;
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
