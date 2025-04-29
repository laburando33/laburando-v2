"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser, FaCreditCard, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa"; // ← Agregamos ícono de cerrar
import { supabase } from "@/lib/supabase-web";
import styles from "./ProfessionalSidebar.module.css";

export default function ProfessionalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Botón de hamburguesa solo visible en mobile */}
      <button onClick={() => setVisible(!visible)} className={styles.menuButton}>
        {visible ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.sidebar} ${visible ? styles.visible : ""}`}>
        <h2 className={styles.logo}>💼 Profesional</h2>
        <ul className={styles.navList}>
          <li className={pathname === "/admin/profile" ? styles.active : ""}>
            <Link href="/admin/profile" onClick={() => setVisible(false)}>
              <FaUser /> <span>Mi Perfil</span>
            </Link>
          </li>
          <li className={pathname === "/admin/shop" ? styles.active : ""}>
            <Link href="/admin/shop" onClick={() => setVisible(false)}>
              <FaCreditCard /> <span>Comprar Créditos</span>
            </Link>
          </li>
          <li>
            <button onClick={async () => { await handleLogout(); setVisible(false); }} className={styles.logoutButton}>
              <FaSignOutAlt /> <span>Salir</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
