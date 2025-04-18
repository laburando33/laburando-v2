"use client";

import { useState } from "react";

interface Props {
  solicitud: any;
  userId: string;
}

export default function SolicitudItem({ solicitud, userId }: Props) {
  const [desbloqueado, setDesbloqueado] = useState(
    solicitud.paid_professionals?.includes(userId)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/unlock", {
      method: "POST",
      body: JSON.stringify({
        userId,
        requestId: solicitud.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setDesbloqueado(true);
    } else {
      setError(data.error || "Error al desbloquear");
    }

    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
      <h4>🛠 {solicitud.category}</h4>
      <p>{solicitud.job_description}</p>
      <p>📍 {solicitud.location}</p>
      <p>📅 {new Date(solicitud.created_at).toLocaleDateString()}</p>

      {desbloqueado ? (
        <>
          <p><strong>📧 Email cliente:</strong> {solicitud.user_email}</p>
          {/* Si tenés más campos, agregalos acá */}
        </>
      ) : (
        <>
          <p style={{ color: "#999" }}>🔒 Datos ocultos. Desbloqueá con 1 crédito.</p>
          <button onClick={handleUnlock} disabled={loading}>
            {loading ? "Desbloqueando..." : "🔓 Desbloquear solicitud"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
}
