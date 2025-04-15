"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@lib/supabase-web";
import styles from "./profile.module.css";
import VerificacionProfesional from "@/components/profesional/VerificacionProfesional";

export default function AdminProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      // verificar que el usuario logueado sea admin
      const { data: currentUser } = await supabase
        .from("professionals")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (currentUser?.role !== "admin") return router.push("/unauthorized");

      // buscar perfil externo por ID
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Error al cargar perfil:", error?.message);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [id, router]);

  if (loading) return <p className={styles.loading}>Cargando perfil...</p>;
  if (!profile) return <p className={styles.error}>No se encontró el perfil.</p>;

  return (
    <main className={styles.profileContainer}>
      <h1 className={styles.title}>👤 Perfil Profesional</h1>

      <div className={styles.avatarSection}>
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className={styles.avatar} />
        ) : (
          <div className={styles.noAvatar}>Sin imagen</div>
        )}
      </div>

      <div className={styles.data}>
        <p><strong>Nombre:</strong> {profile.full_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Teléfono:</strong> {profile.phone || "No definido"}</p>
        <p><strong>Ubicación:</strong> {profile.location || "No definida"}</p>
        <p><strong>Descripción:</strong> {profile.job_description || "Sin descripción"}</p>
      </div>

      <VerificacionProfesional
        isVerified={!!profile.is_verified}
        verificationStatus={profile.verificacion_status}
        userId={profile.user_id}
      />
    </main>
  );
}
