
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MobileContactBar from "../components/MobileContactBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SONIA FURNITURE | Quality Furniture for Your Home",
    template: "%s | SONIA FURNITURE",
  },
  description:
    "Discover stylish, comfortable and practical furniture for your home with SONIA FURNITURE.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <MobileContactBar />
      </body>
    </html>
  );
}
