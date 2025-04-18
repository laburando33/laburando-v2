"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-web";
import { createProfessionalProfile } from "@/lib/createProfessionalProfile";
import styles from "./callback.module.css";

export default function CallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("⏳ Procesando autenticación...");

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("type=recovery")) {
      setMessage("🔁 Redirigiendo para restablecer contraseña...");
      setTimeout(() => router.replace("/auth/reset-password"), 1000);
      return;
    }

    const handleLogin = async () => {
      try {
        await supabase.auth.refreshSession();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const user = session?.user;
        if (!user) {
          setMessage("❌ No se pudo obtener la sesión.");
          await supabase.auth.signOut();
          setTimeout(() => router.replace("/login?msg=auth"), 1500);
          return;
        }

        // ⚠️ Persistir sesión en cookies
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        // Crear perfil si no existe
        await createProfessionalProfile(user);

        // Verificar estado
        const { data: profile, error } = await supabase
          .from("professionals")
          .select("is_verified")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("❌ Error al obtener perfil:", error.message);
          setMessage("❌ Falló al verificar perfil.");
          return;
        }

        if (profile?.is_verified) {
          setMessage("✅ Bienvenido. Redirigiendo al panel...");
          setTimeout(() => router.replace("/admin/profile"), 1200);
        } else {
          setMessage("🕒 Tu cuenta está en revisión.");
          setTimeout(() => router.replace("/verificacion-pendiente"), 1500);
        }
      } catch (err) {
        console.error("Callback error:", err);
        setMessage("❌ Error en el login.");
        setTimeout(() => router.replace("/login?msg=error"), 2000);
      }
    };

    handleLogin();
  }, [router]);

  return (
    <div className={styles.callbackContainer}>
      <div className={styles.message}>{message}</div>
    </div>
  );
}
