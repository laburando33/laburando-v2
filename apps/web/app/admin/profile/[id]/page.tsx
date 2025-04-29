// app/admin/profile/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase-web";
import styles from "@/app/admin/perfilAdmin.module.css";

export default function AdminProfileView() {
  const { id } = useParams();
  const router = useRouter();
  const [profesional, setProfesional] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", id)
        .single();

      if (error) {
        console.error("❌ Error:", error.message);
        return;
      }

      setProfesional(data);
      setLoading(false);
    };

    fetchPerfil();
  }, [id]);

  if (loading) return <p className={styles.loading}>🔄 Cargando perfil...</p>;
  if (!profesional) return <p>❌ Profesional no encontrado</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>👷 Perfil de {profesional.full_name}</h1>
      <div className={styles.data}>
        <p><strong>Email:</strong> {profesional.email}</p>
        <p><strong>Teléfono:</strong> {profesional.phone}</p>
        <p><strong>Categoría:</strong> {profesional.category}</p>
        <p><strong>Ubicación:</strong> {profesional.location}</p>
        <p><strong>Descripción:</strong> {profesional.job_description}</p>
        <p><strong>Verificación:</strong> {profesional.verificacion_status || "pendiente"}</p>
      </div>

      <div className={styles.purchases}>
        <h3>🧾 Historial de Compras (créditos)</h3>
        {/* A futuro: mostrar compras desde credit_purchases */}
        <p>(Próximamente)</p>
      </div>
    </div>
  );
}
