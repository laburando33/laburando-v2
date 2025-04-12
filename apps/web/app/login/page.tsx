"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase-web";
import { createProfessionalProfile } from "@lib/createProfessionalProfile";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("❌ " + error.message);
      return;
    }

    const user = data?.user;
    if (!user) {
      setErrorMessage("❌ Usuario no encontrado.");
      return;
    }

    // ✅ Crear perfil directamente
    await createProfessionalProfile(user);

    // 🔁 Refrescar sesión
    await supabase.auth.getSession();

    // Redirigir al dashboard
    router.push("/admin/profile");
  };

  return (
    <main className={styles.main}>
      <form onSubmit={handleLogin} className={styles.formContainer}>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.loginButton}>
          Ingresar
        </button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </form>
    </main>
  );
}
