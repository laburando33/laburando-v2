"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase-web";
import Link from "next/link";
import "./admin-layout.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) return router.replace("/login");

      const role = user.user_metadata?.role;
      const isPro = user.user_metadata?.is_professional;

      if (!(role === "profesional" || isPro)) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p style={{ padding: "2rem" }}>Cargando...</p>;

  return (
    <>
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">🧑‍🔧 Menú del Usuario</h2>
        <nav>
          <ul>
            <li><Link href="/admin">📋 Solicitudes</Link></li>
            <li><Link href="/admin/profile">👤 Mi Perfil</Link></li>
            <li><Link href="/admin/credits">💰 Comprar Créditos</Link></li>
            <li><Link href="/admin/shop">💡 Tienda de LEDs</Link></li>
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

      <main className="admin-content">
        {children}
      </main>
    </>
  );
}
