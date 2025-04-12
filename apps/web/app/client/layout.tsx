// apps/web/app/client/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase-web";
import Link from "next/link";
import "./client-layout.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) return router.replace("/login");

      const role = user.user_metadata?.role;
      if (role !== "cliente" && role !== "usuario") {
        router.replace("/");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p style={{ padding: "2rem" }}>Cargando...</p>;

  return (
    <div className="client-layout">
      <aside className="sidebar">
        <h2 className="logo">Laburando 🧰</h2>
        <nav>
          <ul>
            <li><Link href="/client/home">🏠 Inicio</Link></li>
            <li><Link href="/client/requests">📋 Mis solicitudes</Link></li>
            <li><Link href="/client/favorites">⭐ Favoritos</Link></li>
          </ul>
        </nav>
        <button
          className="logout-button"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          🚪 Cerrar sesión
        </button>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
