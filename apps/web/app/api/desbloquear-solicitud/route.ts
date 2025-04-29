import { NextResponse } from "next/server";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export async function POST(req: Request) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { solicitudId, userId } = await req.json();

  if (!solicitudId || !userId) {
    return NextResponse.json({ error: { message: "Faltan parámetros." } }, { status: 400 });
  }

  // 🔍 Obtener créditos del profesional
  const { data: creditsData, error: creditsError } = await supabase
    .from("credits")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (creditsError || !creditsData) {
    return NextResponse.json({ error: { message: "Error obteniendo tus créditos." } }, { status: 400 });
  }

  const availableCredits = creditsData.total_credits - creditsData.used_credits;

  if (availableCredits <= 0) {
    return NextResponse.json({ error: { message: "No tenés créditos suficientes." } }, { status: 400 });
  }

  // 🔍 Verificar si ya desbloqueó antes
  const { data: solicitud, error: solicitudError } = await supabase
    .from("requests")
    .select("*")
    .eq("id", solicitudId)
    .single();

  if (solicitudError || !solicitud) {
    return NextResponse.json({ error: { message: "Solicitud no encontrada." } }, { status: 400 });
  }

  if (solicitud.paid_professionals?.includes(userId)) {
    return NextResponse.json({ error: { message: "Ya desbloqueaste esta solicitud." } }, { status: 400 });
  }

  // ✅ Hacer el update en ambas tablas
  const { error: updateSolicitudError } = await supabase
    .from("requests")
    .update({
      paid_professionals: [...(solicitud.paid_professionals || []), userId],
    })
    .eq("id", solicitudId);

  if (updateSolicitudError) {
    return NextResponse.json({ error: { message: "Error actualizando solicitud." } }, { status: 400 });
  }

  const { error: updateCreditsError } = await supabase
    .from("credits")
    .update({
      used_credits: creditsData.used_credits + 1,
    })
    .eq("user_id", userId);

  if (updateCreditsError) {
    return NextResponse.json({ error: { message: "Error actualizando créditos." } }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
