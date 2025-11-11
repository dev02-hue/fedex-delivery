import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TawkScript from "./components/TawkScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FedEx - Shipping, Logistics, and Delivery Services",
  description: "FedEx offers shipping, logistics, and delivery services worldwide. Track packages, ship documents, and find business solutions.",
  keywords: "fedex, shipping, delivery, logistics, package tracking, courier services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
        <TawkScript />
      </body>
    </html>
  );
}