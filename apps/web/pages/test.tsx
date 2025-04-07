import { supabase } from "../../../packages/utils/supabaseClient";
import { useState } from "react";

export default function TestPage() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadProfessionals() {
    const { data, error } = await supabase.from("professionals").select("*");
    if (error) {
      setError(error.message);
    } else {
      setProfessionals(data || []);
    }
  }

  return (
    <div>
      <button onClick={loadProfessionals}>Cargar Professionals</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {professionals.map((pro) => (
        <div key={pro.id}>
          <h3>{pro.full_name}</h3>
          <p>Categoría: {pro.category}</p>
          <p>Ubicación: {pro.location}</p>
        </div>
      ))}
    </div>
  );
}
