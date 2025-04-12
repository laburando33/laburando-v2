"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase-web";
import styles from "./admin.module.css";
import VerificacionEstado from "../../components/profesional/VerificacionEstado";

interface Request {
  id: number;
  job_description: string;
  category: string;
  location: string;
  user_email: string;
  created_at: string;
  status: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        return router.replace("/login");
      }

      setUserId(user.id); // ✅ Guardamos userId para usarlo fuera

      const { data: profileRole, error: roleError } = await supabase
        .from("professionals")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleError || !profileRole) {
        alert("No tenés perfil profesional.");
        return router.replace("/login");
      }

      if (profileRole.role === "admin") {
        return router.replace("/admin/verify");
      }

      const { data: profile, error: profileErr } = await supabase
        .from("professionals")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      if (profileErr || !profile) {
        setError("No se pudo cargar tu perfil.");
        return setLoading(false);
      }

      setFullName(profile.full_name);

      const { data: serviceData, error: serviceErr } = await supabase
        .from("professional_services")
        .select("service_id")
        .eq("professional_id", user.id);

      if (serviceErr || !serviceData) {
        setError("No se pudieron cargar tus servicios.");
        return setLoading(false);
      }

      const serviceIds = serviceData.map((s) => s.service_id);

      const { data: reqData, error: reqErr } = await supabase
        .from("requests")
        .select("*")
        .in("category", serviceIds)
        .order("created_at", { ascending: false });

      if (reqErr) {
        setError("Error al cargar las solicitudes.");
      } else {
        setRequests(reqData || []);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  if (loading) return <p className={styles.loading}>Cargando panel...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Hola, {fullName} 👷</h1>
      <p className={styles.subtitle}>Solicitudes relacionadas con tus servicios:</p>

      {requests.length === 0 ? (
        <p>No hay solicitudes por ahora.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Descripción</th>
                <th>Ubicación</th>
                <th>Email</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.category}</td>
                  <td>{req.job_description}</td>
                  <td>{req.location}</td>
                  <td>{req.user_email}</td>
                  <td>{new Date(req.created_at).toLocaleString()}</td>
                  <td>{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {userId && (
        <section style={{ marginTop: "2rem" }}>
          <h2 className={styles.title}>🛡 Estado de tu verificación</h2>
          <VerificacionEstado userId={userId} />
        </section>
      )}

      <section style={{ marginTop: "2rem" }}>
        <h2 className={styles.title}>💡 Comprar LEDs</h2>
        <p>Próximamente vas a poder adquirir materiales directamente desde este panel.</p>
      </section>
    </main>
  );
}