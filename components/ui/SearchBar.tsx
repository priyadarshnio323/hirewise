"use client";

import { useState } from "react";
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch }: { onSearch?: (value: string) => void }) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    onSearch?.(value);  // ✅ trigger search on icon click
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(value);  // ✅ trigger search on Enter key too
    }
  };

  return (
    <div className="relative w-full max-w-md max-sm:max-w-[180px]">
      <input
        type="text"
        placeholder="Search by role or tech..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch?.(e.target.value);  // ✅ still dynamic as user types
        }}
        onKeyDown={handleKeyDown}  // ✅ Enter key support
        className="w-full bg-transparent text-dark-100 placeholder:text-light-400 
                   rounded-full py-3 pl-4 pr-12 outline-none 
                   min-w-[300px] max-sm:min-w-[150px] border border-gray-300
                   hover:border-gray-300/50 transition-colors"
      />
      <div 
        onClick={handleSearch}  // ✅ click icon to search
        className="absolute right-2 top-1/2 -translate-y-1/2 
                   bg-transparent p-2 rounded-full cursor-pointer
                   hover:bg-gray-100/20 transition-colors"  // ✅ hover effect
      >
        <FaSearch className="text-black text-sm" />
      </div>
    </div>
  );
};

export default SearchBar;