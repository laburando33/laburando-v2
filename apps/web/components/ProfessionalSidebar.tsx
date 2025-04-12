
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./ProfessionalSidebar.module.css";

export default function ProfessionalSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <>
      <button onClick={toggle} className={styles.hamburger}>☰</button>
      <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
        <nav className={styles.nav}>
          <Link href="/admin" className={pathname === "/admin" ? styles.active : styles.link}>
            📋 Solicitudes
          </Link>
          <Link href="/admin/profile" className={pathname === "/admin/profile" ? styles.active : styles.link}>
            👤 Mi Perfil
          </Link>
          <Link href="/admin/credits" className={pathname === "/admin/credits" ? styles.active : styles.link}>
            💰 Comprar Créditos
          </Link>
          <Link href="/admin/shop" className={pathname === "/admin/shop" ? styles.active : styles.link}>
            💡 Tienda de LEDs
          </Link>
        </nav>
      </aside>
    </>
  );
}
