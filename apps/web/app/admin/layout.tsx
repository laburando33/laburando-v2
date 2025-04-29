import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import MobileNav from "@/components/MobileNav";
import styles from "./admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return redirect("/login?msg=auth");

  const { data: profile } = await supabase
    .from("professionals")
    .select("role, verificacion_status")
    .eq("user_id", user.id)
    .single();

  if (!profile) return <main className={styles.adminContent}><p>Error cargando perfil</p></main>;

  const isAdmin = profile.role === "administrador";
  const isVerified = profile.verificacion_status === "verificado";

  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebarWrapper}>
        {isAdmin ? <AdminSidebar /> : <ProfessionalSidebar />}
      </div>
      <main className={styles.adminContent}>
        {!isAdmin && !isVerified && (
          <div className={styles.alert}>🔒 Tu cuenta aún no está verificada.</div>
        )}
        {children}
        <MobileNav role={profile.role} />
      </main>
    </div>
  );
}
