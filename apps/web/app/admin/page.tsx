"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase-web";
import styles from "./admin.module.css";
import { useRouter } from "next/navigation";

export default function ProfessionalDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.replace("/login");

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("professionals")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      setName(profile?.full_name || "Profesional");

      const { data: reqs } = await supabase
        .from("requests")
        .select("*")
        .contains("paid_professionals", [user.id])
        .order("created_at", { ascending: false });

      setRequests(reqs || []);
    };

    load();
  }, [router]);

  const totalPendientes = requests.filter(r => r.status === "pending").length;
  const totalEnviados = requests.filter(r => r.status === "in_progress").length;
  const totalCompletados = requests.filter(r => r.status === "done").length;

  return (
    <main className={styles.profileContainer}>
      <div className={styles.heroBanner}>
        <h2>👋 Bienvenido, {name}</h2>
        <p>Panel de profesional</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <strong>{totalPendientes}</strong>
          <span>Disponibles</span>
        </div>
        <div className={styles.statCard}>
          <strong>{totalEnviados}</strong>
          <span>Presupuestados</span>
        </div>
        <div className={styles.statCard}>
          <strong>{totalCompletados}</strong>
          <span>Completados</span>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button onClick={() => router.push("/admin/shop")}>🛒 Comprar Créditos</button>
        <button onClick={() => router.push("/admin")}>🔍 Ver Solicitudes</button>
      </div>

      <h3 style={{ marginTop: "2rem" }}>🗂 Tus solicitudes recientes</h3>
      <ul className={styles.requestList}>
        {requests.length === 0 ? (
          <p>No hay solicitudes desbloqueadas todavía.</p>
        ) : (
          requests.slice(0, 5).map((r) => (
            <li key={r.id} className={styles.requestItem}>
              <strong>📝 {r.category}</strong>
              <p>{r.job_description}</p>
              <span>📅 {new Date(r.created_at).toLocaleDateString()}</span>
              <span>📌 Estado: {r.status}</span>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
