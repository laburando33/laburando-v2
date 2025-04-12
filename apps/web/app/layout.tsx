import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

import { Providers } from "./providers"; // 👈 Importante

export const metadata: Metadata = {
  title: "Laburando App",
  description: "Conectamos personas con profesionales del hogar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="layout">
        <Providers>
          <Header />
          <main className="main-content">
          {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
