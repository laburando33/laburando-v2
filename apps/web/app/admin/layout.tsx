import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import type { Database } from "@/types/supabase";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import "./admin-layout.css";
import styles from "./admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // ✅ Obtener usuario autenticado desde el servidor (seguro)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login?msg=auth");
  }

  const userId = user.id;

  // 🔍 Obtener perfil del profesional
  let { data: profile, error } = await supabase
    .from("professionals")
    .select("*")
    .eq("user_id", userId)
    .single();

  // Si no existe, lo creamos automáticamente
  if (!profile && error?.code === "PGRST116") {
    const rolPorDefecto = userId === "8fa285e9-9e8f-4f0e-800f-e192da5000eb" ? "administrador" : "profesional";
    const { error: insertError } = await supabase.from("professionals").insert([
      {
        user_id: userId,
        full_name: user.user_metadata?.full_name || "Nombre no definido",
        email: user.email,
        verificacion_status: rolPorDefecto === "administrador" ? "verificado" : "pendiente",
        role: rolPorDefecto,
      },
    ]);

    if (insertError) {
      console.error("❌ Error creando perfil automáticamente:", insertError.message);
      return (
        <main className={styles.adminContent}>
          <p>Error creando el perfil. Contactá a soporte.</p>
        </main>
      );
    }

    // Reintentar carga de perfil
    const retry = await supabase
      .from("professionals")
      .select("*")
      .eq("user_id", userId)
      .single();

    profile = retry.data;
  }

  // Si aún no se puede obtener el perfil, error
  if (!profile) {
    return (
      <main className={styles.adminContent}>
        <p>❌ No se pudo cargar tu perfil. Contactá a soporte.</p>
      </main>
    );
  }

  const isAdmin = profile.role === "administrador";
  const isVerified = profile.verificacion_status === "verificado";

  return (
    <div className={styles.adminLayout}>
      <ProfessionalSidebar />
      <main className={styles.adminContent}>
        {!isAdmin && !isVerified && (
          <div style={{ background: "#fff3cd", padding: "1rem", borderRadius: "4px", marginBottom: "1rem" }}>
            🔒 Tu cuenta aún no está verificada. No podés comprar leads ni recibir notificaciones.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
