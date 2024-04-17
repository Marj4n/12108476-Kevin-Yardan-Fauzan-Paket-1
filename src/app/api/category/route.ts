import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLogin } from "@/lib/utils";
import { categoryCreationSchema } from "@/schemas/category";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(
      {
        categories,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error getting categories:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", message: error },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  // if (!isLogin(req)) {
  //   return NextResponse.json(
  //     {
  //       error: "Unauthorized",
  //     },
  //     {
  //       status: 401,
  //     }
  //   );
  // }
  try {
    const body = await req.json();
    const { name } = categoryCreationSchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating :", error);
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
    const categoryId = searchParams.get("id");
    const { name } = categoryCreationSchema.parse(body);

    const category = prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

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

    await prisma.category.update({
      where: {
        id: Number(categoryId),
      },
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category updated.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating Category:", error);
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
    const categoryId = searchParams.get("id");
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

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

    await prisma.category.delete({
      where: {
        id: Number(categoryId),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", message: error },
      {
        status: 500,
      }
    );
  }
}
