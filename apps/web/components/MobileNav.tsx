"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileNav.module.css";

export default function MobileNav({ role }: { role: string }) {
  const pathname = usePathname();

  const links =
    role === "administrador"
      ? [
          { href: "/admin", label: "Dashboard" }, // ← corregido
          { href: "/admin/profesionales", label: "Profesionales" },
          { href: "/admin/verificacion", label: "Verificación" },
          { href: "/admin/shop", label: "Créditos" },
        ]
      : [
          { href: "/admin/profile", label: "Perfil" },
          { href: "/admin/verificacion", label: "Verificación" },
          { href: "/admin/shop", label: "Créditos" },
        ];

  return (
    <nav className={styles.mobileNav}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={pathname === link.href ? styles.active : ""}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
  