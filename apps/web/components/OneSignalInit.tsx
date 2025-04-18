"use client";

import OneSignal from "react-onesignal";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-web";

export default function OneSignalInit() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.__ONESIGNAL_INITIALIZED__) return;

    const initOneSignal = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("🛑 Usuario no autenticado. No se inicializa OneSignal.");
        return;
      }

      // Verificar el estado de verificación del profesional
      const { data: profile, error } = await supabase
        .from("professionals")
        .select("verificacion_status")
        .eq("user_id", user.id)
        .single();

      if (error || !profile) {
        console.log("❌ Error obteniendo perfil o perfil inexistente:", error?.message);
        return;
      }

      if (profile.verificacion_status !== "verificado") {
        console.log("🟡 Usuario no verificado. No se inicializa OneSignal.");
        return;
      }

      // ⚠️ Delay para evitar conflictos con IndexedDB
      setTimeout(() => {
        OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: { enable: true },
        });

        window.__ONESIGNAL_INITIALIZED__ = true;
        setInitialized(true);
        console.log("✅ OneSignal inicializado para:", user.email);
      }, 500);
    };

    // Escuchar cambios en el auth state
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        initOneSignal();
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return null;
}
