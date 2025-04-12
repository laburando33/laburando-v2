"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase-web";
import styles from "../admin.module.css";
import VerificacionProfesional from "../../../components/profesional/VerificacionProfesional";

export default function ProfilePage() {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Componente que muestra el perfil de un profesional.
 * @function ProfilePage
 * @returns {JSX.Element} Componente JSX que muestra el perfil del usuario.
 */
/*******  c7e17732-40bd-4acc-a26d-4900f3dc1322  *******/  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    job_description: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("❌ Error autenticación:", authError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        console.error("❌ Error al obtener perfil:", error?.message);
        setProfile(null);
      } else {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          location: data.location || "",
          job_description: data.job_description || ""
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("professionals")
      .update(formData)
      .eq("user_id", profile.user_id);

    if (error) {
      console.error("❌ Error al actualizar perfil:", error.message);
    } else {
      setProfile({ ...profile, ...formData });
      setEditing(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setAvatarUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.user_id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("❌ Error subiendo avatar:", uploadError.message);
      setAvatarUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("professionals")
      .update({ avatar_url: publicUrl.publicUrl })
      .eq("user_id", profile.user_id);

    if (updateError) {
      console.error("❌ Error actualizando avatar:", updateError.message);
    } else {
      setProfile(prev => ({
        ...prev,
        avatar_url: publicUrl.publicUrl
      }));
    }

    setAvatarUploading(false);
  };

  if (loading) return <p className={styles.loading}>Cargando perfil...</p>;
  if (!profile) return <p className={styles.error}>No se encontró tu perfil.</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>👷 Perfil Profesional</h1>

      <div className={styles.avatarSection}>
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className={styles.avatar} />
        ) : (
          <div className={styles.noAvatar}>Sin foto</div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={avatarUploading}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.data}>
        <p>
          <strong>Nombre:</strong>{" "}
          {editing ? (
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={styles.inputField}
            />
          ) : (
            profile.full_name
          )}
        </p>
        <p>
          <strong>Teléfono:</strong>{" "}
          {editing ? (
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.inputField}
            />
          ) : (
            profile.phone || "No especificado"
          )}
        </p>
        <p>
          <strong>Ubicación:</strong>{" "}
          {editing ? (
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={styles.inputField}
            />
          ) : (
            profile.location || "No especificada"
          )}
        </p>
        <p>
          <strong>Descripción:</strong>{" "}
          {editing ? (
            <textarea
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              rows={3}
              className={styles.textAreaField}
            />
          ) : (
            profile.job_description || "No agregada"
          )}
        </p>
      </div>

      {editing ? (
        <div className={styles.buttonGroup}>
          <button onClick={handleSave} className={styles.saveButton}>
            💾 Guardar
          </button>
          <button onClick={() => setEditing(false)} className={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className={styles.editButton}>
          ✏️ Modificar
        </button>
      )}

      <VerificacionProfesional
        isVerified={!!profile.is_verified}
        verificationStatus={profile.verificacion_status}
        userId={profile.user_id}
      />
    </div>
  );
}