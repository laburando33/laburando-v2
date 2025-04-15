"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@lib/supabase-web";

export default function SolicitarPage() {
  const [form, setForm] = useState({
    user_email: "",
    job_description: "",
    category: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("requests").insert(form);

    if (error) {
      alert("❌ Error al crear solicitud");
      console.error(error);
    } else {
      alert("✅ Solicitud enviada. Te contactarán pronto.");
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>📋 Solicitar presupuesto</h1>

      <input
        type="email"
        name="user_email"
        placeholder="Tu correo electrónico"
        value={form.user_email}
        onChange={handleChange}
        style={{ width: "100%", margin: "10px 0", padding: 10 }}
      />

      <input
        type="text"
        name="category"
        placeholder="Categoría del servicio (ej. plomería)"
        value={form.category}
        onChange={handleChange}
        style={{ width: "100%", margin: "10px 0", padding: 10 }}
      />

      <input
        type="text"
        name="location"
        placeholder="Ubicación (ciudad/barrio)"
        value={form.location}
        onChange={handleChange}
        style={{ width: "100%", margin: "10px 0", padding: 10 }}
      />

      <textarea
        name="job_description"
        placeholder="Descripción del problema o lo que necesitás"
        value={form.job_description}
        onChange={handleChange}
        rows={4}
        style={{ width: "100%", margin: "10px 0", padding: 10 }}
      />

      <button onClick={handleSubmit} disabled={loading} style={{ padding: "10px 20px" }}>
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </main>
  );
}
