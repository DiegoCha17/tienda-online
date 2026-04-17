import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import { Toaster } from "sonner";
const outfitFont = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Mi Tienda",
  description: "Tienda virtual con Next.js",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${outfitFont.variable} h-full antialiased selection:bg-indigo-500/30 selection:text-indigo-900`}
    >
      <body className="min-h-full flex flex-col pt-32 pb-8 sm:pt-36 bg-white text-gray-800 font-sans transition-colors duration-300">
        <Toaster position="top-center" richColors />
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Mi Tienda Virtual. Todos los
              derechos reservados.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
