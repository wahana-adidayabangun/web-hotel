
// app/layout.tsx
import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Transportasi",
  description: "Sistem transportasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${firaSans.variable} h - full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        {/* Global Navbar */}
        <Navbar />

        {/* Konten Halaman */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

