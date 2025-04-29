import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoHammer,
  IoFlash,
  IoBrush,
  IoWaterOutline,
  IoColorPalette,
  IoCar,
} from "react-icons/io5";
import styles from "./CategoriesSection.module.css";

const categories = [
  {
    name: "Albañil",
    icon: "/icons/icon-albañil-laburandoapp.png",
    reactIcon: IoHammer,
    href: "/categoria/albanil",
  },
  {
    name: "Electricista",
    icon: "/icons/serviciosicon.png",
    reactIcon: IoFlash,
    href: "/categoria/electricista",
  },
  {
    name: "Pintor",
    icon: "/icons/servicios-pintor-laburandoapp.png",
    reactIcon: IoBrush,
    href: "/categoria/pintor",
  },
  {
    name: "Plomero",
    icon: "/icons/servicios-plomero-laburandoapp.png",
    reactIcon: IoWaterOutline,
    href: "/categoria/plomero",
  },
  {
    name: "Vidriero",
    icon: "/icons/tec-matriculados.png",
    reactIcon: IoColorPalette,
    href: "/categoria/vidriero",
  },
  {
    name: "Fletes",
    icon: "/icons/mudanzas-camion-laburandoapp.png",
    reactIcon: IoCar,
    href: "/categoria/fletes",
  },
];

export default function CategoriesSection() {
  const useCustomIcons = true;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Categorías Populares</h2>
        <div className={styles.grid}>
          {categories.map((category, i) => (
            <Link href={category.href} key={i} className={styles.link}>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  {useCustomIcons && category.icon ? (
                    <div className={styles.imageContainer}>
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={64}
                        height={64}
                        className={`${styles.image} ${styles.jewelEffect}`}
                      />
                    </div>
                  ) : (
                    <div className={styles.reactIconContainer}>
                      {React.createElement(category.reactIcon, {
                        size: 40,
                        color: "#fcd93f",
                      })}
                    </div>
                  )}
                </div>
                <span className={styles.categoryName}>{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
