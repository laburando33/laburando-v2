// apps/web/app/admin/shop/page.tsx
"use client";

import styles from "./shop.module.css";
import { useState } from "react";

const plans = [
  {
    id: 1,
    name: "Plan Básico",
    price: 35000,
    credits: 150,
    clients: "6 a 8",
  },
  {
    id: 2,
    name: "Plan Intermedio",
    price: 50000,
    credits: 300,
    clients: "9 a 12",
    recommended: true,
  },
  {
    id: 3,
    name: "Plan Avanzado",
    price: 80000,
    credits: 500,
    clients: "16 a 25",
  },
];

export default function ShopPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleBuy = (planId: number) => {
    // Acá se puede conectar con MercadoPago o simular compra
    alert(`Plan seleccionado: ${planId}`);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>🛒 Comprar créditos</h1>
      <p className={styles.subtitle}>
        Elegí un plan para acceder a más consultas
      </p>

      <div className={styles.plans}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.card} ${
              plan.recommended ? styles.recommended : ""
            }`}
          >
            <h2>{plan.name}</h2>
            <p className={styles.price}>${plan.price.toLocaleString()}</p>
            <p>{plan.credits} créditos</p>
            <p>{plan.clients} posibles clientes</p>
            <button
              onClick={() => handleBuy(plan.id)}
              className={styles.buyBtn}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
