
import { usePerfil } from '@/hooks/usePerfil';

export default function DashboardPro() {
  const { perfil, loading, error } = usePerfil();

  if (loading) return <p>Cargando perfil...</p>;
  if (error || !perfil) return <p>No se encontró tu perfil. Error: {error}</p>;

  return (
    <div>
      <h2>Bienvenido/a {perfil.nombre}</h2>
      {/* Aquí podrías mostrar métricas, solicitudes, etc */}
    </div>
  );
}
