import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vendor Management",
  description: "Vendor Management System",
  icons: {
    icon: "/narag.png",
    apple: "/narag.png",
  },
};

import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex-col bg-slate-50 overflow-x-clip">
        <Navbar />
        <div className="flex-1 flex flex-col min-h-0 w-full relative">
          {children}
        </div>
      </body>
    </html>
  );
}