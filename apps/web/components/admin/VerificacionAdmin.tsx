"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-web";
import styles from "../profesional/dashboardVerificacion.module.css";
import VerificacionEstado from "../profesional/VerificacionEstado";

export default function VerificacionAdmin({ userId }: { userId: string }) {
  const [verificacion, setVerificacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("verificaciones_profesionales")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("❌ Error cargando verificación:", error);
    }

    setVerificacion(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const actualizarEstado = async (nuevoEstado: string) => {
    if (!verificacion?.id) return;

    const { error } = await supabase
      .from("verificaciones_profesionales")
      .update({ estado: nuevoEstado })
      .eq("id", verificacion.id);

    if (error) {
      console.error("❌ Error actualizando estado:", error);
    } else {
      await fetchData();
    }
  };

  if (loading) return <p>Cargando verificación...</p>;
  if (!verificacion) return <p>No se encontró verificación.</p>;

  return (
    <div className={styles.container}>
      <h3>Verificación profesional</h3>
      <VerificacionEstado userId={userId} />

      <div className={styles.docsGrid}>
        <div>
          <p><strong>DNI:</strong></p>
          <img src={verificacion.dni_url} className={styles.image} />
        </div>
        <div>
          <p><strong>Certificado domicilio:</strong></p>
          <img src={verificacion.certificado_url} className={styles.image} />
        </div>
      </div>

      <div className={styles.trabajos}>
        <p><strong>Trabajos realizados:</strong></p>
        <div className={styles.trabajosGrid}>
          {verificacion.trabajos_urls?.map((url: string, i: number) => (
            <img key={i} src={url} className={styles.trabajoImg} />
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => actualizarEstado("aprobado")}>✅ Aprobar</button>
        <button onClick={() => actualizarEstado("rechazado")}>❌ Rechazar</button>
      </div>
    </div>
  );
}
