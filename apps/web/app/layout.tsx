import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Metadata } from "next";
import { Providers } from "./providers";
import OneSignalInit from "../components/OneSignalInit"; // ✅ Integración de OneSignal

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
      <head>
        {/* 👉 Para precargar la librería de OneSignal vía CDN (opcional pero recomendado) */}
        <script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        ></script>
      </head>
      <body className="layout">
        <Providers>
          <OneSignalInit /> {/* 🚀 Inicializa OneSignal */}
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
