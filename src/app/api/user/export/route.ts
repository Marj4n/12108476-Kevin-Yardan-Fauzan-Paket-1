import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "admin",
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Prepare worksheet data
    const worksheetData = users.map((user) => ({
      ID: user.id,
      Name: user.name,
      Username: user.username,
      Email: user.email,
      Address: user.address,
      Role: user.role,
      "Created At": user.createdAt,
      "Updated At": user.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `users-${new Date().toISOString().split("T")[0]}`
    );

    const fileName = `users-${new Date().toISOString().split("T")[0]}.xlsx`;
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
