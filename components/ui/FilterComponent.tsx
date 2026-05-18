"use client";

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";

const options = ["All", "Technical", "Behavioural", "Mixed"];

const FilterComponent = ({ onFilter }: { onFilter?: (value: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All");

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    onFilter?.(option);
  };

  // close on outside click
useEffect(() => {
  const handleClickOutside = () => setOpen(false);
  if (open) document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, [open]);
  
  return (
    <div className="relative z-50">
      {/* Filter button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-black text-light-100 
                   rounded-full py-3 px-4 
                   hover:bg-dark-300 transition-colors cursor-pointer"
      >
        <Filter size={16} />
        <span className="text-sm">{selected}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-12 left-0 z-50 bg-[#1A1C20]  
                        rounded-2xl 
                        overflow-hidden shadow-lg min-w-[140px]">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors
                hover:bg-dark-300/10 cursor-pointer
                ${selected === option ? "text-dark-300 font-semibold" : "text-light-100"}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;