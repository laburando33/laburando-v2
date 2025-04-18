'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-web";
import VerificacionAdmin from "@/components/admin/VerificacionAdmin";

export default function AdminDashboard() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error obteniendo usuario:", error.message);
        return;
      }
      setUserId(data?.user?.id || null);
    };

    getUser();
  }, []);

  if (!userId) return <p>Cargando usuario...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard del Administrador</h1>
      <VerificacionAdmin userId={userId} />
    </div>
  );
}
