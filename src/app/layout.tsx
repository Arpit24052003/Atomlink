import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atomlink 2.0",
  description: "Advanced Engineering Node",
  manifest: "/manifest.json",
  themeColor: "#00FFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: undefined }}>
      <html lang="en" className={`${inter.variable} h-full antialiased`}>
        <body className="h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
