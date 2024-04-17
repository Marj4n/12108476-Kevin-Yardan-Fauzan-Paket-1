"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const handleDelete = async (userId: number) => {
  try {
    await axios.delete(`/api/user?id=${userId}`);

    setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const { toast } = useToast();
      const router = useRouter();

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
              onClick={() => navigator.clipboard.writeText(user.username!)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Username
            </DropdownMenuItem>
            <DropdownMenuItem
              className="font-medium text-red-500"
              onClick={() => {
                handleDelete(user.id);
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
              <Link href={`/dashboard/user/update/${user.id}`}>Update</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
