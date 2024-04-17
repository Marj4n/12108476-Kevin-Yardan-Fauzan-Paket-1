import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

export const ExportUserButton = () => {
  const router = useRouter();
  const handleClick = async () => {
    try {
      // redirect to /api/user/export
      router.push("/api/user/export");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="xs:ml-2 sm:ml-5 dark:bg-gray-700 shadow xs:p-2 sm:px-4 sm:py-2"
    >
      <Download className="xs:mr-0 sm:mr-2 w-5 h-5 sm:block xs:block" />
      <span className="sm:block xs:hidden">Export</span>
    </Button>
  );
};

export const ExportBookButton = () => {
  return (
    <Button
      //   onClick={}
      variant="outline"
      className="xs:ml-2 sm:ml-5 dark:bg-gray-700 shadow xs:p-2 sm:px-4 sm:py-2"
    >
      <Download className="xs:mr-0 sm:mr-2 w-5 h-5 sm:block xs:block" />
      <span className="sm:block xs:hidden">Export</span>
    </Button>
  );
};
