"use client";

import Link from "next/link";
import "./admin-layout.css";
import SafeLink from "../../components/common/SafeLink"; // o la ruta correcta

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adminLayout">
      <aside className="adminSidebar">
        <h2>Panel</h2>
        <ul>
  <li>
    <SafeLink href="/admin">📋 Solicitudes</SafeLink>
  </li>
  <li>
    <SafeLink href="/admin/profile">👤 Mi Perfil</SafeLink>
  </li>
  <li>
    <SafeLink href="/admin/credits">💰 Comprar Créditos</SafeLink>
  </li>
  <li>
    <SafeLink href="/admin/shop">💡 Tienda de LEDs</SafeLink>
  </li>
</ul>

      </aside>

      <main className="adminContent">{children}</main>
    </div>
  );
}
