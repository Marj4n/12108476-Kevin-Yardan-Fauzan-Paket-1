import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { CopyIcon, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { ToastAction } from "@radix-ui/react-toast";
import { bookCreationSchema } from "@/schemas/book";

const ModalCreateBook = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof bookCreationSchema>>({
    resolver: zodResolver(bookCreationSchema),
  });

  function onSubmit(data: z.infer<typeof bookCreationSchema>) {
    try {
      console.log(data);
      axios.post("/api/book", {
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        published: data.published,
        description: data.description,
        pdf: data.pdf,
        cover: data.cover,
      });

      toast({
        title: "Book created successfully.",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
        action: (
          <ToastAction
            onClick={() =>
              navigator.clipboard.writeText(
                JSON.stringify(
                  {
                    data,
                  },
                  null,
                  2
                )
              )
            }
            altText="Copy JSON"
          >
            <CopyIcon />
          </ToastAction>
        ),
      });

      setTimeout(() => {
        location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error creating book:", error);
      toast({
        title: "Error",
        description: "Failed to create account.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="xs:ml-2 sm:ml-5 dark:bg-gray-700 shadow xs:p-2 sm:px-4 sm:py-2"
        >
          <Plus className="xs:mr-0 sm:mr-2 w-5 h-5 sm:block xs:block" />
          <span className="sm:block xs:hidden">Create Book</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Book</DialogTitle>
          <DialogDescription>
            Insert a new book by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Title</Label>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter title"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Author</Label>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter author"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Publisher</Label>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter publisher"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Published</Label>
                  <Input
                    type="date"
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="w-[150px]"
                    placeholder="Enter published"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Description</Label>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter description"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="pdf"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">PDF</Label>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter link PDF"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Cover</Label>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter link cover"
                    required
                  />
                </div>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateBook;
