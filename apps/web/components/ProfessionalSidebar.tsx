"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ProfessionalSidebar.module.css";

export default function ProfessionalSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    alert("Sesión cerrada");
  };

  return (
    <nav className={styles.bottomNav}>
      <Link href="/admin" className={pathname === "/admin" ? styles.navItemActive : styles.navItem}>
        📋<span>Solicitudes</span>
      </Link>
      <Link href="/admin/profile" className={pathname === "/admin/profile" ? styles.navItemActive : styles.navItem}>
        👤<span>Perfil</span>
      </Link>
      <Link href="/admin/credits" className={pathname === "/admin/credits" ? styles.navItemActive : styles.navItem}>
        💰<span>Créditos</span>
      </Link>
      <Link href="/admin/shop" className={pathname === "/admin/shop" ? styles.navItemActive : styles.navItem}>
        💡<span>Tienda</span>
      </Link>
      <button onClick={handleLogout} className={styles.navItemButton}>
        🔓<span>Salir</span>
      </button>
    </nav>
  );
}
