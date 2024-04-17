"use client";

import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import axios from "axios";
import { DataTable } from "./data-table";
import { Category } from "@prisma/client";

const DataResponse = () => {
  const [data, setData] = useState<Category[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/category");
        setData(response.data.categories);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  return <DataTable columns={columns} data={data} />;
};

export default DataResponse;
