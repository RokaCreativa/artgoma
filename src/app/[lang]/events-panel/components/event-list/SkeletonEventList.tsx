import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonEventList = () => {
  return (
    <div className="container space-y-4 mx-auto p-4 w-full md:w-3/4 lg:w-3/5 md:p-6 rounded-xl bg-white/30 backdrop-blur-3xl shadow-xl shadow-gray-800">
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
    </div>
  );
};

export default SkeletonEventList;
