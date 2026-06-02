"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";
import MenuButton from "./ui/MenuButton";
import { Button } from "./ui/Button";
import { ArrowLeft } from "lucide-react";

const InterviewNavbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const userName = "Priya";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <nav className="flex items-center gap-4 px-6 py-2 bg-gradient-to-b from-[#E3F8EF] to-white">
      
      <Link href="/">
        <h3 className="text-dark-100 font-sans font-extralight">HireWise</h3>
      </Link>

      <div className="text-light-400 hidden md:flex items-center gap-12 ml-auto">
        
        {/* <button onClick={() => router.push("/")} className="hover:text-dark-100 transition-colors cursor-pointer">
          Exit
        </button> */}

        {/* <Button variant="outline" className="w-fit" onClick={() => router.back()}>
        <ArrowLeft className="size-4" />
        Back
    </Button>  */}
        <div className="relative ml-auto">
          {/* Avatar */}

          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-gray-100  text-dark-100 flex items-center justify-center font-semibold"
          >
            {initial}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2">
              <button
                onClick={async () => {
                  await signOut();          // ✅ clear session
                  router.replace("/sign-in"); // ✅ redirect
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100/50 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          )}
          
        </div>
      </div>

          <div className="block md:hidden ml-auto">
            <MenuButton />
          </div>
    </nav>

      );
};

export default InterviewNavbar;