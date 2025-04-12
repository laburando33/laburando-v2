// apps/web/app/client/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase-web";
import { useRouter } from "next/navigation";

export default function ClientHome() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user || error) {
        router.replace("/login");
        return;
      }

      const role = user.user_metadata?.role;
      if (role !== "cliente" && role !== "usuario") {
        router.replace("/");
        return;
      }

      setUserEmail(user.email);
      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) return <p style={{ padding: "2rem" }}>Cargando...</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>👋 Bienvenido/a</h1>
      <p>Estás logueado como <strong>{userEmail}</strong></p>
      <p>Esta es tu área de cliente. Próximamente verás tus solicitudes, profesionales favoritos, etc.</p>
    </main>
  );
}
