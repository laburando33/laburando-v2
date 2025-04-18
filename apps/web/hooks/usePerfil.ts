
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-web';

export const usePerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError(userError?.message || 'No hay usuario logueado');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setError(error?.message || 'Perfil no encontrado');
      } else {
        setPerfil(data);
      }

      setLoading(false);
    };

    fetchPerfil();
  }, []);

  return { perfil, loading, error };
};
