"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/web-supabase";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        const role = session.user.user_metadata?.role;
        if (role === "profesional") {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
      } else {
        // Intentar recuperar de la URL
        const { error: handleError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (handleError) {
          console.error("Error al intercambiar el código:", handleError.message);
        } else {
          router.replace("/auth/callback"); // Recarga para leer el session
        }
      }
    };

    handleAuth();
  }, [router]);

  return <p>Procesando inicio de sesión...</p>;
}
