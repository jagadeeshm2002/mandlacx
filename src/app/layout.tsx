import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mandlacx",
  description: "mandlacx",
  icons: {
    icon: "/mandlacx.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} {${jakartaSans.variable} ${inter.variable}} antialiased `}
      >
        <div className="font-sans bg-gradient-to-b to-[#000000] from-[#151515] min-h-screen relative ">
          <div className="w-[800px] h-[100px] absolute bg-yellow-500 -top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-[500px]" />
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
