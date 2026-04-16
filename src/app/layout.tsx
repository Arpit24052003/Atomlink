import type { Metadata, Viewport } from "next"; // Bas yahan Viewport add kar dijiye
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atomlink",
  description: "Advanced Engineering Node",
  manifest: "/manifest.json",
};
export const viewport: Viewport = {
  themeColor: "#00FFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
