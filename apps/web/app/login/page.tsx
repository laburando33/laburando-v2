"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { supabase } from "@lib/web-supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"cliente" | "profesional" | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: "http://localhost:3000/auth/callback",
            data: { role },
        },
    });

    if (error) {
      setMessage("❌ Error al enviar el link: " + error.message);
    } else {
      setMessage("✅ Revisá tu correo para continuar el acceso.");
    }

    setLoading(false);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Iniciar sesión</h1>

      {!role ? (
        <div className={styles.options}>
          <button onClick={() => setRole("cliente")} className={styles.option}>
            Soy Cliente
          </button>
          <button onClick={() => setRole("profesional")} className={styles.option}>
            Soy Profesional
          </button>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <p>Iniciar sesión como <strong>{role}</strong></p>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className={styles.loginButton}
            onClick={handleLogin}
            disabled={loading || !email}
          >
            {loading ? "Enviando..." : "Enviar link mágico"}
          </button>
          {message && <p>{message}</p>}
          <button onClick={() => setRole(null)} className={styles.backButton}>
            ← Volver
          </button>
        </div>
      )}
    </main>
  );
}
