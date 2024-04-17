"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export const UpdateForm = ({ userId }: { userId: number }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    role: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchingUsers() {
      try {
        const response = await axios.get(`/api/user/one?id=${userId}`);

        console.log("response", response.data.user);
        setFormValues({
          name: response.data.user.name,
          username: response.data.user.username,
          email: response.data.user.email,
          address: response.data.user.address,
          role: response.data.user.role,
          password: "",
        });
        console.log("formValues", formValues);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchingUsers();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.put(`/api/user?id=${userId}`, formValues);

      setLoading(false);

      if (res.data.success) {
        toast({
          title: "Success",
          description: "Account updated successfully.",
          variant: "success",
        });

        setTimeout(() => {
          router.push("/dashboard/user/");
          router.refresh();
        }, 500);
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error updated user:", error);
      toast({
        title: "Error",
        description: error.response.data.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          User's Name
        </label>
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="User's Name"
          required
        />
      </div>
      {/* Username */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          User's Username
        </label>
        <input
          type="text"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="User's Username"
          required
        />
      </div>
      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          User's Email
        </label>
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="User's Email"
          required
        />
      </div>
      {/* Address */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          User's Address
        </label>
        <textarea
          name="address"
          value={formValues.address}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="User's Address"
          required
        />
      </div>
      {/* Role */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Role
        </label>
        <select
          name="role"
          value={formValues.role}
          onChange={handleSelectChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="operator">Operator</option>
        </select>
      </div>
      {/* Password */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      {/* Submit Button */}
      <button
        style={loading ? { cursor: "not-allowed" } : { cursor: "pointer" }}
        type="submit"
        disabled={loading}
        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        {loading ? "loading..." : "Update"}
      </button>
    </form>
  );
};
