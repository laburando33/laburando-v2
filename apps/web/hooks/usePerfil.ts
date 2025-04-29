import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-web";

export const usePerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Auth session missing!");
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError || !data) {
        setError("Perfil no encontrado o error: " + profileError?.message);
      } else {
        setPerfil(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { perfil, loading, error };
};
