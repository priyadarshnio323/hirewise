// "use client";
// import { RxHamburgerMenu } from "react-icons/rx";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signOut } from "@/lib/actions/auth.action";



// const menuItems = ["Home", "My Interviews", "Explore", "Logout"];

// const MenuButton =  () => {

// const router = useRouter();
// const [open, setOpen] = useState(false);
// const [selected, setSelected] = useState("Home");

// const handleSelect =  async(option: string) => {
//     setSelected(option);
//     setOpen(false);
//     if(option === "Logout") {
//                         await signOut();          // ✅ clear session
//                         router.replace("/sign-in");
//     }
//  else if(option === "Home") {
//       router.push("/");
// } else if(option === "My Interviews") {
//       router.push("/my-interviews");
// } else if(option === "Explore") {
//       router.push("/explore");
// }
// else{

// }
// }


//   return (
//     <div className=' cursor-pointer text-dark-100 relative'>
//         <button
//             onClick={() => setOpen(!open)}
//             className = "flex items-center gap-2 hover:bg-gray-100 transition duration-300 ease-in-out rounded-full p-2"
//         >
//            <RxHamburgerMenu size={24} />
//         </button>

//         {open && (
//             <div className = "absolute right-0 mt-2 w-40 bg-gray-100 shadow-lg rounded-lg p-2">
//                 {menuItems.map((item) => (
//                     <button
//                         key={item}
//                         onClick={() => handleSelect(item)}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-200 transition duration-300 ease-in-out"
//                     >
//                         {item}
//                     </button>
//                 ))}
//             </div>
//         )}

//     </div>
//   )
// }


// export default MenuButton


"use client";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";

const menuItems = [
  { label: "Home", icon: "🏠" },
  { label: "My Interviews", icon: "📋" },
  { label: "Explore", icon: "🔍" },
  { label: "Logout", icon: "🚪" },
];

const MenuButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const handleSelect = async (option: string) => {
    setOpen(false);
    if (option === "Logout") {
      await signOut();
      router.replace("/sign-in");
    } else if (option === "Home") {
      router.push("/");
    } else if (option === "My Interviews") {
      router.push("/my-interviews");
    } else if (option === "Explore") {
      router.push("/explore");
    }
  };

  return (
    <>
      {/* ✅ blur overlay — behind menu, above page content */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="cursor-pointer text-dark-100 relative z-[80]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="flex items-center gap-2 hover:bg-gray-100 transition duration-300 rounded-full p-2"
        >
          <RxHamburgerMenu size={24} />
        </button>

        {/* ✅ dropdown — z-50 so above blur overlay */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl p-2 z-[70] border border-gray-100">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(item.label);
                }}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl
                  transition duration-200 text-sm font-medium
                  ${item.label === "Logout"
                    ? "text-red-500 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MenuButton;