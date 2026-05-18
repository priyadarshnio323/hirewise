"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import FilterComponent from "@/components/ui/FilterComponent";

const InterviewControls = ({ basePath }: { basePath: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushWithParams = (params: URLSearchParams) => {
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    pushWithParams(params);
  };

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      params.set("type", value.toLowerCase());
    } else {
      params.delete("type");
    }
    pushWithParams(params);
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <SearchBar onSearch={handleSearch} />
      <FilterComponent onFilter={handleFilter} />
    </div>
  );
};

export default InterviewControls;

