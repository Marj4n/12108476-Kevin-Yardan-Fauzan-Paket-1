"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Category } from "@prisma/client";
import Link from "next/link";

const handleDelete = async (userId: number) => {
  try {
    await axios.delete(`/api/category?id=${userId}`);

    setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const category = row.original;
      return new Date(category.createdAt).toLocaleDateString();
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const category = row.original;
      return new Date(category.updatedAt).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      const { toast } = useToast();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(category.name!)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Title
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-medium text-red-500"
              onClick={() => {
                handleDelete(category.id);
                toast({
                  title: "Success",
                  description: "User deleted successfully",
                  variant: "success",
                });
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem className="font-medium text-blue-500">
              <Link href={`/dashboard/category/update/${category.id}`}>
                Update
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="h-8 w-8 p-0"
                href={`/dashboard/category/${category.id}`}
              >
                Borrowed
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
