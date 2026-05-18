import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className="dark">
      {/* Add h-full to html and body, and remove any potential margin */}
      <body
        className={`${monaSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
