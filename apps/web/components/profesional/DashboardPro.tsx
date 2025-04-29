"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-web";
import SolicitudItem from "@/components/SolicitudItem";
import styles from "./DashboardPro.module.css";
import Link from "next/link";

interface Solicitud {
  id: number;
  job_description: string;
  location: string;
  category: string;
  created_at: string;
}

export default function DashboardPro({ userId }: { userId: string }) {
  const [credits, setCredits] = useState<number>(0);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [motivationalPhrase, setMotivationalPhrase] = useState("Cada crédito es una oportunidad. ¡No dejes pasar a tus futuros clientes!");

  const frases = [
    "Cada crédito es una oportunidad. ¡No dejes pasar a tus futuros clientes!",
    "¡El éxito empieza con un sí! Aprovechá tus créditos.",
    "Hoy es un gran día para hacer crecer tu negocio.",
  ];

  useEffect(() => {
    fetchCredits();
    fetchSolicitudes();

    const interval = setInterval(() => {
      setMotivationalPhrase((prev) => {
        const nextIndex = (frases.indexOf(prev) + 1) % frases.length;
        return frases[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchCredits = async () => {
    const { data, error } = await supabase
      .from("credits")
      .select("total_credits")
      .eq("user_id", userId)
      .single();

    if (!error && data) {
      setCredits(data.total_credits);
    }
  };

  const fetchSolicitudes = async () => {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setSolicitudes(data);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>👋 ¡Hola, profesional!</h1>

      <div className={styles.infoBox}>
        <h2>⭐ Créditos disponibles: {credits}</h2>
      </div>

      <div className={styles.motivationalBox}>
        <p>{motivationalPhrase}</p>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/shop" className={styles.shopButton}>
          🛒 Comprar más créditos
        </Link>
      </div>

      <h2 className={styles.subTitle}>📋 Últimas solicitudes</h2>
      <div className={styles.solicitudesGrid}>
        {solicitudes.map((s) => (
          <SolicitudItem key={s.id} solicitud={s} />
        ))}
      </div>
    </div>
  );
}
