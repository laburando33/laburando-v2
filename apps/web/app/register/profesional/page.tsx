"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase-web";
import styles from "../../admin/admin.module.css";

export default function RegistroProfesional() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "+54",
    location: "",
    category: "",
    acepta: false,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!form.acepta) {
      setError("Debés aceptar los Términos y Condiciones.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          phone: form.phone,
          location: form.location,
          category: form.category,
          role: "profesional",
          is_professional: true,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccessMessage("📩 Revisa tu correo y confirmá tu cuenta para completar el registro.");
    setLoading(false);
  };

  return (
    <main className={styles.profileContainer}>
      <h1 className={styles.title}>Registro Profesional</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        {/* campos */}
        <label className={styles.label}>Nombre completo</label>
        <input name="full_name" value={form.full_name} onChange={handleChange} required className={styles.inputField} />

        <label className={styles.label}>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className={styles.inputField} />

        <label className={styles.label}>Contraseña</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required className={styles.inputField} />

        <label className={styles.label}>Teléfono</label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className={styles.inputField} />

        <label className={styles.label}>Dirección</label>
        <input name="location" value={form.location} onChange={handleChange} required className={styles.inputField} />

        <label className={styles.label}>Categoría</label>
        <select name="category" value={form.category} onChange={handleChange} required className={styles.inputField}>
          <option value="">Seleccionar...</option>
          <option value="electricista">Electricista</option>
          <option value="plomero">Plomero</option>
          <option value="gasista">Gasista</option>
          <option value="albañil">Albañil</option>
        </select>

        <label className={styles.label}>
          <input type="checkbox" name="acepta" checked={form.acepta} onChange={handleChange} />{" "}
          Acepto los <a href="/terminos" target="_blank">Términos y Condiciones</a>
        </label>

        <button type="submit" className={styles.saveButton} disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {successMessage && <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>}
      </form>
    </main>
  );
}
