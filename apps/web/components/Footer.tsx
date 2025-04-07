// apps/web/components/Footer.tsx
"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} Laburando. Todos los derechos reservados.</p>
        <p className={styles.footerLinks}>
  <Link href="/terminos">Términos y Condiciones</Link> ·{" "}
  <Link href="/politica-devoluciones">Política de Devoluciones</Link>
</p>

      </div>
    </footer>
  );
}
