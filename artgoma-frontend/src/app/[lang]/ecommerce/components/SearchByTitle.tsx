"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SearchByTitle = () => {
  const { register, handleSubmit } = useForm<{ title: string }>();
  const router = useRouter();

  const onSubmit = (data: { title: string }) => {
    router.push(`?title=${data.title}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center relative">
      <input
        type="text"
        {...register("title")}
        name="title"
        placeholder="Search by title"
        className="max-w-72 p-1 md:p-2 pr-8 border rounded-lg bg-white/80"
      />
      <button type="submit" className="absolute right-2 hover:scale-125">
        <Search height={15} width={15} />
      </button>
    </form>
  );
};

export default SearchByTitle;
