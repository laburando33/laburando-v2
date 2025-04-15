"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase-web";
import styles from "../../login/login.module.css"; // <- ajustado para ruta correcta

const allServices = [
  { id: 1, name: "Albañil" },
  { id: 2, name: "Técnico de aire acondicionado" },
  { id: 3, name: "Tarquino" },
  { id: 4, name: "Electricista" },
  { id: 5, name: "Durlock" },
  { id: 6, name: "Impermeabilización de techos" },
  { id: 7, name: "Pulidor de pisos" },
  { id: 8, name: "Pintor interior" },
  { id: 9, name: "Pintor de alturas" },
  { id: 10, name: "Electricista matriculado" },
  { id: 11, name: "Vidriería y cerramientos" },
  { id: 12, name: "Colocación de redes de balcones" },
  { id: 13, name: "Mudanza y fletes" },
  { id: 14, name: "Pequeños arreglos" },
  { id: 15, name: "Plomería" },
  { id: 16, name: "Soldador" },
  { id: 17, name: "Destapaciones pluviales y cloacales" },
];

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8, { message: "Teléfono inválido" }),
    location: z.string().min(2),
    experience: z.string(),
    description: z.string().optional(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    selectedServiceIds: z.array(z.number()).min(1, "Seleccioná al menos un servicio"),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "Debés aceptar los términos y condiciones" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type FormData = z.infer<typeof schema>;

export default function ProfessionalRegisterPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedServiceIds: [],
    },
  });

  const filtered = allServices.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(s.id)
  );

  const addService = (id: number) => {
    const updated = [...selected, id];
    setSelected(updated);
    setValue("selectedServiceIds", updated, { shouldValidate: true });
    setSearch("");
  };

  const removeService = (id: number) => {
    const updated = selected.filter((sid) => sid !== id);
    setSelected(updated);
    setValue("selectedServiceIds", updated, { shouldValidate: true });
  };

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            is_professional: true,
            role: "profesional",
          },
        },
      });

      if (error || !data.user) throw error ?? new Error("No se creó el usuario");
      const userId = data.user.id;

      const { error: profError } = await supabase.from("professionals").insert({
        user_id: userId,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        job_description: formData.description || "",
        role: "profesional",
      });

      if (profError) throw profError;

      const serviciosData = formData.selectedServiceIds.map((service_id) => ({
        user_id: userId,
        service_id,
      }));

      const { error: relError } = await supabase.from("professional_services").insert(serviciosData);
      if (relError) throw relError;

      setMessage("✅ Registro exitoso. Revisá tu correo.");
      router.push("/login");
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Registro Profesional</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <input className={styles.input} placeholder="Nombre" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}

        <input className={styles.input} placeholder="Email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}

        <input className={styles.input} placeholder="Teléfono" {...register("phone")} />
        {errors.phone && <p>{errors.phone.message}</p>}

        <input className={styles.input} placeholder="Ubicación" {...register("location")} />
        {errors.location && <p>{errors.location.message}</p>}

        <input className={styles.input} placeholder="Años de experiencia" {...register("experience")} />
        {errors.experience && <p>{errors.experience.message}</p>}

        <textarea className={styles.input} placeholder="Descripción" {...register("description")} />

        <input type="password" className={styles.input} placeholder="Contraseña" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}

        <input type="password" className={styles.input} placeholder="Confirmar contraseña" {...register("confirmPassword")} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        <input className={styles.input} placeholder="Buscar servicio..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div style={{ maxHeight: 180, overflowY: "auto", background: "#f1f5f9", borderRadius: 8 }}>
          {filtered.map((s) => (
            <div key={s.id} onClick={() => addService(s.id)} style={{ padding: "10px", cursor: "pointer" }}>
              {s.name}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem", gap: "0.5rem" }}>
          {selected.map((id) => {
            const label = allServices.find((s) => s.id === id)?.name;
            return (
              <span
                key={id}
                onClick={() => removeService(id)}
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  borderRadius: 20,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                {label} ×
              </span>
            );
          })}
        </div>

        {errors.selectedServiceIds && <p style={{ color: "red" }}>{errors.selectedServiceIds.message}</p>}

        <div style={{ marginTop: "1rem" }}>
          <label style={{ display: "flex", gap: 8 }}>
            <input type="checkbox" {...register("termsAccepted")} />
            Acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer">términos y condiciones</a>
          </label>
          {errors.termsAccepted && <p style={{ color: "red" }}>{errors.termsAccepted.message}</p>}
        </div>

        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
