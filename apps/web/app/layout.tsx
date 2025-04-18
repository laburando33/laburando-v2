import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";
import { Providers } from "./providers";
import OneSignalInit from "../components/OneSignalInit";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Laburando App",
  description: "Conectamos personas con profesionales del hogar",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="es">
      <head>
        {/* ✅ CDN de OneSignal para producción */}
        <script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        />
      </head>
      <body className="layout">
        <Providers initialSession={session}>
          <OneSignalInit />
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
