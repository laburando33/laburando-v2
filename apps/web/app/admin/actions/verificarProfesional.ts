// /admin/actions/verificarProfesional.ts
import { supabase } from "@/lib/supabase-web";

export async function verificarProfesional(user_id: string) {
  const { error } = await supabase
    .from("professionals")
    .update({ verificacion_status: "verificado", is_verified: true })
    .eq("user_id", user_id);

  if (error) {
    console.error("❌ Error al verificar profesional:", error.message);
    throw error;
  }

  console.log("✅ Profesional verificado:", user_id);
}
