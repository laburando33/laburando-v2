"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/web-supabase";
import styles from "./admin.module.css";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const role = user.user_metadata?.role;
      if (role !== "profesional") {
        alert("Acceso solo para profesionales.");
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Error al cargar solicitudes.");
      } else {
        setRequests(data || []);
      }

      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) return <p className={styles.loading}>Cargando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Panel Profesional</h1>
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
    </main>
  );
}
