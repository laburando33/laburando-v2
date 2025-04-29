"use client";
import Image from 'next/image';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoSearch,
  IoCashOutline,
  IoScaleOutline,
  IoCheckmarkCircleOutline,
  IoHammer,
  IoSnow,
  IoBrush,
  IoFlash,
  IoLayers,
  IoRainy,
  IoColorPalette,
  IoApps,
  IoWifi,
  IoCar,
  IoFlame,
  IoWater,
  IoWaterOutline
} from "react-icons/io5";
import styles from "./page.module.css";
import { supabase } from "../lib/supabase-web";
import OneSignal from "react-onesignal";
import CategoriesSection from "@/components/CategoriesSection";
import HeroSection from "@/components/HeroSection";
import Modal from "@/components/Modal";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HeroSection />
        <CategoriesSection />

        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>¿Por qué elegir Laburando?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
            <Image src="/users/vanesa.png" alt="Vanesa"   width={150} height={150}  />
            <h3 className={styles.benefitTitle}>Es gratuito</h3>
              <p className={styles.benefitText}>
                Recibí presupuestos y contactá gratis con hasta 4 profesionales.
              </p>
            </div>
            <div className={styles.benefitItem}>
            <Image src="/users/german.png" alt="Vanesa"   width={150} height={150}  />
              <h3 className={styles.benefitTitle}>Compará precios</h3>
              <p className={styles.benefitText}>
                Recibí opciones y decidí desde tu celular o compu.
              </p>
            </div>
            <div className={styles.benefitItem}>
            <Image src="/users/carlos.png" alt="Vanesa"   width={150} height={150}  />
              <h3 className={styles.benefitTitle}>Contratá</h3>
              <p className={styles.benefitText}>
                Encuentra profesionales en tu zona y contratá
              </p>
            </div>
          </div>

        </section>

        <HowItWorks />
      </main>
    </div>
  );
}
