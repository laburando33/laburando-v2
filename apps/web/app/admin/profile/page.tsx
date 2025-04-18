"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase-web";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        router.push("/login");
        return;
      }

      const userId = sessionData.session.user.id;

      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) {
        console.error("❌ Error cargando perfil:", error?.message);
        router.push("/");
        return;
      }

      setPerfil(data);
      setForm({
        full_name: data.full_name ?? "",
        phone: data.phone ?? "",
        location: data.location ?? "",
        category: data.category ?? "",
      });
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    const { error } = await supabase
      .from("professionals")
      .update(form)
      .eq("user_id", perfil.user_id);

    if (error) {
      alert("❌ Error al guardar: " + error.message);
      return;
    }

    alert("✅ Cambios guardados.");
    setEditando(false);
  };

  if (loading) return <p className={styles.loading}>Cargando perfil...</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>👤 Mi Perfil Profesional</h1>

      <div className={styles.data}>
        <label>Nombre completo</label>
        {editando ? (
          <input name="full_name" value={form.full_name} onChange={handleChange} />
        ) : (
          <p>{perfil.full_name}</p>
        )}

        <label>Teléfono</label>
        {editando ? (
          <input name="phone" value={form.phone} onChange={handleChange} />
        ) : (
          <p>{perfil.phone}</p>
        )}

        <label>Ubicación</label>
        {editando ? (
          <input name="location" value={form.location} onChange={handleChange} />
        ) : (
          <p>{perfil.location}</p>
        )}

        <label>Categoría</label>
        {editando ? (
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Seleccionar...</option>
            <option value="electricista">Electricista</option>
            <option value="Plomería">Plomero</option>
            <option value="Soldador">Soldador</option>
            <option value="Albañil">Albañil</option>
            <option value="Técnico de aire acondicionado">Técnico de aire acondicionado</option>
            <option value="Tarquino">Tarquino</option>
            <option value="Durlock">Durlock</option>
            <option value="Impermeabilización de techos">Impermeabilización de techos</option>
            <option value="Pulidor de pisos">Pulidor de pisos</option>
            <option value="Pintor interior">Pintor interior</option>
            <option value="Pintor de alturas">Pintor de alturas</option>
            <option value="Vidriería y cerramientos">Vidriería y cerramientos</option>
            <option value="Colocación de redes de balcones">Colocación de redes de balcones</option>
            <option value="Mudanza y fletes">Mudanza y fletes</option>
            <option value="Destapaciones pluviales y cloacales">Destapaciones pluviales y cloacales</option>
            <option value="Pequeños arreglos">Pequeños arreglos</option>


          </select>
        ) : (
          <p>{perfil.category}</p>
        )}
      </div>

      <div className={styles.buttonGroup}>
        {editando ? (
          <>
            <button onClick={handleGuardar} className={styles.saveButton}>💾 Guardar</button>
            <button onClick={() => setEditando(false)} className={styles.cancelButton}>❌ Cancelar</button>
          </>
        ) : (
          <button onClick={() => setEditando(true)} className={styles.editButton}>✏️ Editar Perfil</button>
        )}
      </div>

      {!perfil.is_verified && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p>📤 Aún no estás verificado. Subí tus documentos desde la sección de <strong>verificación</strong>.</p>
          <button onClick={() => router.push("/admin/verificacion")} className={styles.saveButton}>
            Verificar mi identidad
          </button>
        </div>
      )}
    </div>
  );
}
