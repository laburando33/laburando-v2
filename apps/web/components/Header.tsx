"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoClose } from "react-icons/io5";
import { isMobile } from "react-device-detect";
import { QRCodeSVG } from "qrcode.react";
import styles from "./Header.module.css";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleQuieroLaburar = () => {
    setIsMobileMenuOpen(false);
    if (isMobile) {
      window.location.href = "https://expo.dev/@tulaburando/laburando-app";
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <header className={styles.header}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Link href="/" legacyBehavior>
            <a>
              <Image
                src="/logo.png"
                alt="Laburando Logo"
                width={180}
                height={100}
              />
            </a>
          </Link>
        </div>

        {/* Navegación */}
        <nav
          className={`${styles.nav} ${
            isMobileMenuOpen ? styles.navMobileOpen : ""
          }`}
        >
          <Link href="/" legacyBehavior>
            <a className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
              Inicio
            </a>
          </Link>
          <Link href="/services" legacyBehavior>
            <a className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
              Nuestros servicios
            </a>
          </Link>
          
          <Link href="/login" legacyBehavior>
            <a className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
              Iniciar sesión
            </a>
          </Link>
          
          
          <button className={styles.ctaButton} onClick={handleQuieroLaburar}>
            Quiero laburar
          </button>
        </nav>

        {/* Botón menú móvil */}
        <div className={styles.mobileMenuIcon}>
          <button onClick={toggleMobileMenu} className={styles.menuButton}>
            {isMobileMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
          </button>
        </div>
      </header>

      {/* MODAL QR */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
              ×
            </button>
            <p className={styles.qrText}>
              Escaneá el código QR con la app Expo Go:
            </p>
            <QRCodeSVG
              value="https://expo.dev/@tulaburando/laburando-app"
              size={180}
              fgColor="#333"
              bgColor="#fff"
            />
            <p className={styles.qrHint}>
              También podés buscar “Laburando” en la app Expo Go.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
