"use client";

import { useState } from "react";

interface ToggleButtonGroupProps {
  buttons: { label: string; onClick: () => void }[];
}

const ToggleButtonGroup = ({ buttons }: ToggleButtonGroupProps) => {
  const [active, setActive] = useState(0); // first button active by default

  return (
   <div className="flex flex-row gap-4 max-sm:flex-col w-full">
  {buttons.map((btn, index) => (
    <button
      key={index}
      onClick={() => {
        setActive(index);
        btn.onClick();
      }}
      className={`flex-1 min-w-0 rounded-full px-6 py-2.5 font-bold transition-all duration-200
        active:scale-95 flex items-center justify-center cursor-pointer select-none
        ${active === index
          ? "bg-dark-300 text-white"
          : "bg-gray-100 text-dark-100"
        }`}
    >
      {btn.label}
    </button>
  ))}
</div>
  );
};

export default ToggleButtonGroup;