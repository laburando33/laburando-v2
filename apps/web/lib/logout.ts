// lib/logout.ts
import { supabase } from "@/lib/supabase-web";

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("❌ Error cerrando sesión:", error.message);
  else console.log("👋 Sesión cerrada correctamente");
};
