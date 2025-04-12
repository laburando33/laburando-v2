"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase-web";

export default function VerificacionEstado({ userId }: { userId: string }) {
  const [estado, setEstado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstado = async () => {
      const { data, error } = await supabase
        .from("verificaciones_profesionales")
        .select("estado")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        setEstado("Error al consultar estado.");
      } else {
        setEstado(data?.estado || "No enviado");
      }

      setLoading(false);
    };

    fetchEstado();
  }, [userId]);

  if (loading) return <p>Cargando estado de verificación...</p>;

  let color = "#666";
  if (estado === "aprobado") color = "green";
  else if (estado === "rechazado") color = "red";
  else if (estado === "pendiente") color = "#fcb500";

  return (
    <p style={{ fontWeight: "bold", color }}>
      Estado actual: {estado?.toUpperCase()}
    </p>
  );
}