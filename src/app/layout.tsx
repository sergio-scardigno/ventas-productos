import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatwootClient from "@/components/ChatwootClient";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Tienda Online - Productos de Calidad",
  description: "Descubre nuestra selección de productos de alta calidad con envío rápido y pagos seguros.",
  keywords: "tienda online, productos, compras, ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        {children}
        <ChatwootClient />
      </body>
    </html>
  );
}
