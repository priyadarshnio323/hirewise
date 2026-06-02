

"use client";

import Link from "next/link";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { RiLineChartFill } from "react-icons/ri";
import { PiChartPolar } from "react-icons/pi";
import { GoShieldCheck } from "react-icons/go";
import { FiHeart } from "react-icons/fi";
import { RxDotsHorizontal } from "react-icons/rx";


const Footer = () => {
  return (
    <div className="w-full bg-[#0f172a] text-white">

      {/* Top dots */}
      <div className="flex justify-center py-3 bg-gradient-to-r from-[#FF512F] to-[#DD2476]">
        <span className="tracking-widest text-white"><RxDotsHorizontal />
</span>
      </div>

      {/* Main footer content */}
      <div className="flex flex-col md:flex-row justify-between gap-10 px-12 py-10 max-sm:px-6">
        
        {/* Left — Logo and description */}
        <div className="flex flex-col gap-4 max-w-[220px]">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-2xl">HireWise</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            AI-powered mock interviews to help you practice, improve, and land your dream job.
          </p>
          
          <div className="flex flex-row gap-4 mt-2">
            <Link href="https://www.linkedin.com/in/priyadarshnim" target="_blank"
              className="text-gray-400 hover:text-white transition-colors text-lg">
              <FaLinkedin />
            </Link>
            <Link href="https://github.com/priyadarshnio323" target="_blank"
              className="text-gray-400 hover:text-white transition-colors text-lg">
              <FaGithub />
            </Link>
            <Link href="https://mail.google.com/mail/?view=cm&fs=1&to=priyamurali0414@gmail.com" target="_blank"
              className="text-gray-400 hover:text-white transition-colors text-lg">
              <IoMdMail />
            </Link>
          </div>
        </div>

        {/* Right — Feature highlights */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          
          <div className="flex flex-col gap-2">
            <span className="text-purple-400 text-2xl"><AiOutlineThunderbolt /></span>
            <h4 className="text-white font-semibold text-sm">Practice Smarter</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Realistic interviews with AI feedback to help you get better faster.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-green-400 text-2xl"><RiLineChartFill /></span>
            <h4 className="text-white font-semibold text-sm">Track Progress</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Monitor your performance over time and see how you improve.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-yellow-400 text-2xl"><PiChartPolar /></span>
            <h4 className="text-white font-semibold text-sm">Build Confidence</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Sharpen your skills, strengthen your answers, and interview with clarity.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-blue-400 text-2xl"><GoShieldCheck /></span>
            <h4 className="text-white font-semibold text-sm">Your Data, Safe</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              We prioritize your privacy and keep your data secure at all times.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="flex flex-row justify-between items-center px-12 py-4 border-t border-white/10 max-sm:px-6 max-sm:flex-col max-sm:gap-2">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HireWise. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <FiHeart className="text-red-400" /> Built to help you succeed.
        </p>
      </div>

    </div>
  );
};

export default Footer;