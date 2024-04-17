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
import { Book } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const handleDelete = async (userId: number) => {
  try {
    await axios.delete(`/api/book?id=${userId}`);

    setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "publisher",
    header: "Publisher",
  },
  {
    accessorKey: "publication_year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Publication Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const book = row.original;
      // turn to year only
      return (
        <div className="ml-14">
          {String(book.publication_year)?.split("-")[0]}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "cover",
    header: () => <div className="text-center">Cover</div>,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <a href={book?.cover} target="_blank" rel="noreferrer">
          <Button variant="ghost">View Cover</Button>
        </a>
      );
    },
  },
  {
    accessorKey: "pdf",
    header: () => <div className="text-center">PDF</div>,
    cell: ({ row }) => {
      const book = row.original;
      return (
        <a href={book?.pdf} target="_blank" rel="noreferrer">
          <Button variant="ghost">View PDF</Button>
        </a>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const book = row.original;
      return new Date(book.createdAt).toLocaleDateString();
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const book = row.original;
      return new Date(book.updatedAt).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
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
              onClick={() => navigator.clipboard.writeText(book.title!)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Title
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-medium text-red-500"
              onClick={() => {
                handleDelete(book.id);
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
              <Link href={`/dashboard/book/update/${book.id}`}>Update</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="h-8 w-8 p-0" href={`/dashboard/book/${book.id}`}>
                Borrowed
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
