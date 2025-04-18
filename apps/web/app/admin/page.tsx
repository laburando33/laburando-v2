"use client";

import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase-web";

export default function AdminProfilePage() {
  const session = useSession();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerification = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("❌ Error al traer verificación:", error.message);
        setIsVerified(null);
      } else {
        setIsVerified(data.is_verified);
      }

      setLoading(false);
    };

    fetchVerification();
  }, [session]);

  if (!session) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>❌ No hay sesión activa</h2>
        <p>Redirigite a <a href="/login">/login</a></p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>👤 Panel Profesional (Debug)</h1>

      <ul style={{ lineHeight: "2em" }}>
        <li><strong>ID:</strong> {session.user.id}</li>
        <li><strong>Email:</strong> {session.user.email}</li>
        <li><strong>Rol:</strong> {session.user.user_metadata?.role}</li>
        <li><strong>Nombre:</strong> {session.user.user_metadata?.full_name}</li>
        <li><strong>Teléfono:</strong> {session.user.user_metadata?.phone}</li>
        <li><strong>Ubicación:</strong> {session.user.user_metadata?.location}</li>
        <li><strong>Categoría:</strong> {session.user.user_metadata?.category}</li>
        <li><strong>is_verified:</strong> {loading ? "Cargando..." : String(isVerified)}</li>
      </ul>
    </div>
  );
}
