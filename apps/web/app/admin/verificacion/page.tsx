"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-web";
import styles from "../admin.module.css";
import { verificarProfesional } from "@/app/admin/actions/verificarProfesional";

export default function VerificacionAdminPage() {
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendientes = async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("verificacion_status", "no_verificado");

      if (error) {
        console.error("❌ Error obteniendo profesionales pendientes:", error.message);
        return;
      }

      setPendientes(data || []);
      setLoading(false);
    };

    fetchPendientes();
  }, []);

  const handleVerificar = async (user_id: string) => {
    try {
      await verificarProfesional(user_id);
      setPendientes((prev) => prev.filter((p) => p.user_id !== user_id));
    } catch (err) {
      alert("❌ Error al verificar profesional");
    }
  };

  if (loading) return <p className={styles.loading}>Cargando...</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>🛂 Profesionales pendientes de verificación</h1>

      {pendientes.length === 0 ? (
        <p>No hay profesionales pendientes.</p>
      ) : (
        <ul className={styles.cardList}>
          {pendientes.map((pro) => (
            <li key={pro.user_id} className={styles.cardItem}>
              <strong>{pro.full_name}</strong> – {pro.email}
              <button
                onClick={() => handleVerificar(pro.user_id)}
                className={styles.secondaryButton}
              >
                ✅ Verificar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
