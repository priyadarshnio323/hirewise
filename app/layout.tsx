import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hirewise",
  description: "Interview practice with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      {/* Add h-full to html and body, and remove any potential margin */}
      <body
        className={`${monaSans.className}`}
      >
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
