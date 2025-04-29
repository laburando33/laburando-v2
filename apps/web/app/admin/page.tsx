import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import dynamic from "next/dynamic";

const DashboardAdmin = dynamic(() => import("@/components/admin/DashboardAdmin"), { ssr: false });
const DashboardPro = dynamic(() => import("@/components/profesional/DashboardPro"), { ssr: false });

export default async function AdminPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        🚫 No hay sesión activa
      </main>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("professionals")
    .select("role, full_name")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        ❌ Perfil no encontrado
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      {profile.role === "administrador" ? (
        <DashboardAdmin />
      ) : (
        <DashboardPro userId={session.user.id} fullName={profile.full_name} />
      )}
    </main>
  );
}
