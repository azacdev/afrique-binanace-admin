import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const neueMontreal = localFont({
  src: [
    {
      path: "./fonts/NeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal",
});

const RGStandardBook = localFont({
  src: [
    {
      path: "./fonts/RG-StandardBook.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/RG-StandardSemibold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-rg-standard-book",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Afrique Bitcoin Admin",
  description: "Admin portal for managing Afrique Bitcoin conference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={neueMontreal.variable}>
      <body
        className={`${RGStandardBook.variable} ${neueMontreal.variable} ${dmMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
