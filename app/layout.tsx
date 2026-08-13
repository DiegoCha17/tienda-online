import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { STORE_DESCRIPTION, STORE_NAME } from "@/lib/constants";

const outfitFont = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${STORE_NAME} | Inicio`,
  description: STORE_DESCRIPTION,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${outfitFont.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-800 font-sans">
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
