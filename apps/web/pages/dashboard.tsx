// apps/web/pages/dashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import styles from "../styles/Dashboard.module.css"; // Crea este archivo para estilos

interface Professional {
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  location: string;
  category: string;
  description: string;
  created_at: string;
}

interface RequestType {
  id: number;
  description: string;
  category: string;
  location: string;
  created_at: string;
  status: string;
}

export default function Dashboard() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      // Obtener sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user) {
        setError("Usuario no autenticado");
        return;
      }
      const userId = sessionData.session.user.id;

      // Cargar datos del profesional
      const { data: profData, error: profError } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profError) {
        setError(profError.message);
      } else {
        setProfessional(profData);
      }

      // Cargar solicitudes asignadas a este profesional
      const { data: reqData, error: reqError } = await supabase
        .from("requests")
        .select("*")
        .eq("professional_id", userId);

      if (reqError) {
        setError(reqError.message);
      } else {
        setRequests(reqData || []);
      }
    }

    loadData();
  }, []);

  const pendientesCount = requests.filter(r => r.status === "pending").length;
  const asignadosCount = requests.filter(r => r.status === "assigned").length;
  const completadosCount = requests.filter(r => r.status === "completed").length;

  return (
    <div className={styles.container}>
      <h1>Bienvenido, {professional?.full_name || "Profesional"}</h1>
      <h2>Panel de Profesionales</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.stats}>
        <div className={styles.statBox}>
          <p className={styles.statNumber}>{pendientesCount}</p>
          <p>Pendientes</p>
        </div>
        <div className={styles.statBox}>
          <p className={styles.statNumber}>{asignadosCount}</p>
          <p>Asignados</p>
        </div>
        <div className={styles.statBox}>
          <p className={styles.statNumber}>{completadosCount}</p>
          <p>Completados</p>
        </div>
      </div>
      <div className={styles.requests}>
        {requests.length === 0 ? (
          <p>No tienes solicitudes activas</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className={styles.requestCard}>
              <h3>{req.description}</h3>
              <p>Categoría: {req.category}</p>
              <p>Ubicación: {req.location}</p>
              <p>Estado: {req.status}</p>
              <p>
                Creado: {new Date(req.created_at).toLocaleDateString()}{" "}
                {new Date(req.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
