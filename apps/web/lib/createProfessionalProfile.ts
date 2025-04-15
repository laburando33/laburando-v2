// apps/web/lib/createProfessionalProfile.ts
import { supabase } from "./supabase-web";

export async function createProfessionalProfile(user: any) {
  if (!user?.id) {
    console.warn("⚠️ Usuario inválido, no se puede crear el perfil.");
    return;
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (sessionError || !session || session.user.id !== user.id) {
    console.warn("⚠️ Usuario no autenticado o sesión inválida");
    return;
  }

  // Verificar si ya existe el perfil
  const { data: existing, error: selError } = await supabase
    .from("professionals")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (selError) {
    console.error("❌ Error verificando perfil:", selError.message);
    return;
  }

  if (!existing) {
    const { error: insertError } = await supabase.from("professionals").insert({
      user_id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "",
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("❌ Error creando perfil:", insertError.message);
    } else {
      console.log("✅ Perfil creado correctamente");
    }
  } else {
    console.log("✅ Perfil ya existe");
  }

  // Verificar y actualizar user_metadata si falta is_professional
  if (!user.user_metadata?.is_professional) {
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        is_professional: true,
      },
    });

    if (metaError) {
      console.warn("⚠️ No se pudo actualizar is_professional:", metaError.message);
    } else {
      console.log("✅ user_metadata actualizado: is_professional: true");
    }
  }
}
