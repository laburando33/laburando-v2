"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-web";
import "../app/admin/admin-layout.css"; // asegúrate de tener los estilos ya cargados

export default function ProfessionalSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // limpia la sesión del middleware
    router.replace("/login");
  };

  return (
    <aside className="admin-sidebar">
      <h2 className="sidebar-title">Mi Panel</h2>
      <nav>
        <ul>
          <li><Link href="/admin/profile">👤 Mi Perfil</Link></li>
          <li><Link href="/admin">📄 Solicitudes</Link></li>
          <li><Link href="/admin/shop">🛒 Comprar Créditos</Link></li>
          <li><Link href="/admin/verificacion">🪪 Verificación</Link></li>
        </ul>
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        🔓 Cerrar sesión
      </button>
    </aside>
  );
}
