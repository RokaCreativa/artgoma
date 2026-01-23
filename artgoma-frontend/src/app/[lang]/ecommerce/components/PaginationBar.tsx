"use client";

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

const PaginationBar = ({ page = "1", totalArtWorks }: { page: string | undefined; totalArtWorks: number }) => {
  const router = useRouter();
  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalArtWorks / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPageNumbers = 5;

    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let start = Math.max(2, Number(page) - 1);
      let end = Math.min(start + 2, totalPages - 1);
      if (end === totalPages - 1) {
        start = end - 2;
      }
      if (start > 2) {
        pageNumbers.push("...");
      }
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <Pagination className="mt-8 p-1 bg-white/60 backdrop-blur-lg w-fit rounded-lg hidden md:block fixed z-50 bottom-4 right-0 left-0">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => Number(page) > 1 && handlePageChange(Number(page) - 1)}
            className={Number(page) <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        {getPageNumbers().map((pageNumber, index) => (
          <PaginationItem key={index}>
            {pageNumber === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(pageNumber as number)}
                isActive={Number(page) === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => Number(page) < totalPages && handlePageChange(Number(page) + 1)}
            className={Number(page) >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
