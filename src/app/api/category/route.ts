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
    const { name } = categoryCreationSchema.parse(body);

    // Convert name to lowercase for case-insensitive search
    const lowercaseName = name.toLowerCase();

    // Check if a category with the lowercase name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: lowercaseName,
        },
      },
    });

    // If category already exists, return 400 error
    if (existingCategory) {
      return NextResponse.json(
        {
          error: "Category with this name already exists.",
        },
        {
          status: 400,
        }
      );
    }

    // If category does not exist, create a new one
    const category = await prisma.category.create({
      data: {
        name: lowercaseName,
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
    console.error("Error creating category:", error);
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

    // Convert name to lowercase for case-insensitive search
    const lowercaseName = name.toLowerCase();

    // Check if any category with the lowercase name already exists, except the one being updated
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: lowercaseName,
        },
        NOT: {
          id: Number(categoryId),
        },
      },
    });

    // If category already exists, return 400 error
    if (existingCategory) {
      return NextResponse.json(
        {
          error: "Category with this name already exists.",
        },
        {
          status: 400,
        }
      );
    }

    // If category does not exist, or if it only exists for the category being updated, update the category
    await prisma.category.update({
      where: {
        id: Number(categoryId),
      },
      data: {
        name: lowercaseName,
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
    console.error("Error updating category:", error);
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
