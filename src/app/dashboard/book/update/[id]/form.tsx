"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

export const UpdateForm = ({ bookId }: { bookId: number }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    author: "",
    publisher: "",
    publication_year: "",
    description: "",
    pdf: "",
    cover: "",
  });

  useEffect(() => {
    async function fetchingBooks() {
      try {
        const response = await axios.get(`/api/book/one?id=${bookId}`);

        setFormValues({
          title: response.data.book.title,
          author: response.data.book.author,
          publisher: response.data.book.publisher,
          publication_year: response.data.book.publication_year,
          description: response.data.book.description,
          pdf: response.data.book.pdf,
          cover: response.data.book.cover,
        });
      } catch (error) {
        console.error("Error fetching Book:", error);
      }
    }
    fetchingBooks();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.put(`/api/book?id=${bookId}`, formValues);

      setLoading(false);

      if (res.data.success) {
        toast({
          title: "Success",
          description: "Account updated successfully.",
          variant: "success",
        });

        setTimeout(() => {
          router.push("/dashboard/book/");
          router.refresh();
        }, 500);
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error updated book:", error);
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
  return (
    <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
      {/* Title */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Book's title
        </label>
        <input
          type="text"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Book's title"
          required
        />
      </div>
      {/* Author */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Book's Author
        </label>
        <input
          type="text"
          name="author"
          value={formValues.author}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Book's Author"
          required
        />
      </div>
      {/* Publisher */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Book's Publisher
        </label>
        <textarea
          name="publisher"
          value={formValues.publisher}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Book's Address"
          required
        />
      </div>
      {/* Publication Year */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Publication Year
        </label>
        <input
          type="date"
          name="publication_year"
          value={formValues.publication_year}
          defaultValue={formValues.publication_year}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      {/* Description */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Book's Description
        </label>
        <textarea
          name="address"
          value={formValues.description}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Books's Description"
          required
        />
      </div>
      {/* PDF */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Books's PDF
        </label>
        <input
          type="text"
          name="pdf"
          value={formValues.pdf}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter link PDF"
          required
        />
      </div>
      {/* Cover */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Books's Cover
        </label>
        <input
          type="text"
          name="cover"
          value={formValues.cover}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter link Cover"
          required
        />
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
