"use client";

import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import axios from "axios";
import { DataTable } from "./data-table";
import { User } from "@prisma/client";

const DataResponse = () => {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/user");
        setData(response.data.users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  return <DataTable columns={columns} data={data} />;
};

export default DataResponse;
