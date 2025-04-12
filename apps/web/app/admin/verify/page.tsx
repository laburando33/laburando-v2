"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase-web";
import styles from "../admin.module.css";

export default function VerificacionesPage() {
  const router = useRouter();
  const [verificaciones, setVerificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchVerificaciones = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("❌ Error autenticación:", authError?.message);
        router.push("/login");
        return;
      }

      // Verificamos si tiene rol admin en la tabla professionals
      const { data: perfil, error: profileError } = await supabase
        .from("professionals")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError || !perfil || perfil.role !== "admin") {
        console.warn("🚫 Acceso denegado: no tiene rol admin");
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("verificaciones_profesionales")
        .select("*")
        .eq("estado", "pendiente");

      if (error) {
        console.error("❌ Error cargando verificaciones:", error.message);
      } else {
        setVerificaciones(data);
      }

      setLoading(false);
      setAuthChecked(true);
    };

    fetchVerificaciones();
  }, [router]);

  const handleAprobar = async (userId: string) => {
    const { error: error1 } = await supabase
      .from("verificaciones_profesionales")
      .update({ estado: "aprobado" })
      .eq("user_id", userId);

    const { error: error2 } = await supabase
      .from("professionals")
      .update({ is_verified: true, verificacion_status: "verificado" })
      .eq("user_id", userId);

    if (error1 || error2) {
      alert("❌ Error al aprobar verificación");
    } else {
      alert("✅ Verificación aprobada");
      setVerificaciones(prev => prev.filter(v => v.user_id !== userId));
    }
  };

  const handleRechazar = async (userId: string) => {
    const { error: error1 } = await supabase
      .from("verificaciones_profesionales")
      .update({ estado: "rechazado" })
      .eq("user_id", userId);

    const { error: error2 } = await supabase
      .from("professionals")
      .update({ is_verified: false, verificacion_status: "rechazado" })
      .eq("user_id", userId);

    if (error1 || error2) {
      alert("❌ Error al rechazar verificación");
    } else {
      alert("⛔ Verificación rechazada");
      setVerificaciones(prev => prev.filter(v => v.user_id !== userId));
    }
  };

  if (!authChecked) return <p>Cargando autenticación...</p>;
  if (loading) return <p>Cargando verificaciones...</p>;
  if (verificaciones.length === 0) return <p>No hay verificaciones pendientes.</p>;

  return (
    <div className={styles.profileContainer}>
      <h1>🔍 Verificaciones Pendientes</h1>

      {verificaciones.map((v) => (
        <div key={v.id} className={styles.verificacionBox}>
          <p><strong>ID Usuario:</strong> {v.user_id}</p>

          <div style={{ margin: "1rem 0" }}>
            <p><strong>DNI:</strong></p>
            <img src={v.dni_url} alt="DNI" style={{ maxWidth: "100%", borderRadius: "8px" }} />
          </div>

          <div>
            <p><strong>Certificado de domicilio:</strong></p>
            <img src={v.certificado_url} alt="Certificado" style={{ maxWidth: "100%", borderRadius: "8px" }} />
          </div>

          <div>
            <p><strong>Trabajos realizados:</strong></p>
            {v.trabajos_urls?.map((url: string, i: number) => (
              <img key={i} src={url} alt={`Trabajo ${i + 1}`} style={{ maxWidth: "100px", margin: "0.5rem", borderRadius: "6px" }} />
            ))}
          </div>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button className={styles.saveButton} onClick={() => handleAprobar(v.user_id)}>✅ Aprobar</button>
            <button className={styles.cancelButton} onClick={() => handleRechazar(v.user_id)}>❌ Rechazar</button>
          </div>
        </div>
      ))}
    </div>
  );
}