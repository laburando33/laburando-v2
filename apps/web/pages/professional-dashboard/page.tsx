// apps/web/pages/professional-dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@repo/utils/supabaseClient";
import styles from "./professional-dashboard.module.css";

// Define interfaces para tus datos
interface Professional {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  description: string;
}

interface RequestType {
  id: number;
  description: string;
  category: string;
  location: string;
  created_at: string;
  status: string;
}

export default function ProfessionalDashboard() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del profesional usando la sesión actual
  const loadProfessionalInfo = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      setError("No estás logueado");
      return;
    }
    const userId = sessionData.session.user.id;
    const { data, error: proError } = await supabase
      .from("professionals")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (proError) {
      setError(proError.message);
    } else {
      setProfessional(data);
    }
  };

  // Cargar las solicitudes que tengan professional_id igual al id del usuario actual
  const loadRequests = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      setError("No estás logueado");
      return;
    }
    const userId = sessionData.session.user.id;
    const { data, error: reqError } = await supabase
      .from("requests")
      .select("*")
      .eq("professional_id", userId);
    if (reqError) {
      setError(reqError.message);
    } else {
      setRequests(data || []);
    }
  };

  useEffect(() => {
    loadProfessionalInfo();
    loadRequests();
  }, []);

  // Calcular estadísticas de solicitudes
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const assignedCount = requests.filter((r) => r.status === "assigned").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Bienvenido, {professional ? professional.full_name : "Profesional"}</h1>
        {error && <p className={styles.error}>{error}</p>}
      </header>

      <section className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{pendingCount}</span>
          <span className={styles.statLabel}>Pendientes</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{assignedCount}</span>
          <span className={styles.statLabel}>Asignados</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{completedCount}</span>
          <span className={styles.statLabel}>Completados</span>
        </div>
      </section>

      <section className={styles.actions}>
        <button className={styles.yellowButton}>Comprar Leads</button>
        <button className={styles.yellowButton}>Ver Solicitudes</button>
      </section>

      <section className={styles.requests}>
        <h2>Solicitudes Recientes</h2>
        {requests.length === 0 ? (
          <p>No hay solicitudes activas.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className={styles.requestCard}>
              <h3>{req.description}</h3>
              <p>Categoría: {req.category}</p>
              <p>Ubicación: {req.location}</p>
              <p>Estado: {req.status}</p>
              <p>Creado: {new Date(req.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
