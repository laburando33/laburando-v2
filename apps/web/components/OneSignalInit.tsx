"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-web";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || initialized || window.__ONESIGNAL_INITIALIZED__) return;

    const initOneSignal = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log("🛑 Usuario no autenticado. No se inicializa OneSignal.");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("professionals")
          .select("verificacion_status")
          .eq("user_id", user.id)
          .single();

        if (profileError || !profile) {
          console.log("❌ Error obteniendo perfil o perfil inexistente:", profileError?.message);
          return;
        }

        if (profile.verificacion_status !== "verificado") {
          console.log("🟡 Usuario no verificado. No se inicializa OneSignal.");
          return;
        }

        // ⚡ Init OneSignal con pequeño delay para IndexedDB
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

      } catch (err) {
        console.error("❌ Error inesperado en init OneSignal:", err);
      }
    };

    // Escuchar cambios en el auth state y ejecutar init
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && !window.__ONESIGNAL_INITIALIZED__) {
        initOneSignal();
      }
    });

    // También intentar iniciar apenas monta el componente
    initOneSignal();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [initialized]);

  return null;
}
