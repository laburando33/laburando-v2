"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-web";
import { useRouter } from "next/navigation";

export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("⏳ Enviando correo de recuperación...");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/callback", // ajustá según tu entorno
    });

    if (error) {
      console.error("❌ Error:", error.message);
      setMensaje("❌ Error: " + error.message);
    } else {
      setMensaje("✅ Te enviamos un correo para recuperar tu contraseña.");
      setEnviado(true);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>🔐 Recuperar contraseña</h2>
      <p style={{ textAlign: "center", fontSize: "0.95rem" }}>
        Ingresá tu email y te enviaremos un enlace para restablecerla.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="login_input__Y4JR4"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="saveButton">
          Enviar enlace
        </button>
      </form>

      {mensaje && <p style={{ marginTop: "1rem", textAlign: "center" }}>{mensaje}</p>}

      {enviado && (
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          ¿No recibiste el correo? <button onClick={() => router.refresh()}>Reenviar</button>
        </p>
      )}
    </div>
  );
}
