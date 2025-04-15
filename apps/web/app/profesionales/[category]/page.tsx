'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase-web';
import styles from './page.module.css'; // asegurate de tenerlo

export default function ProfesionalesPage() {
  const { category } = useParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('view_professionals_with_categories') // tu vista segura
        .select('*')
        .ilike('category', `%${category}%`);

      if (error) {
        console.error('❌ Error cargando profesionales:', error.message);
      } else {
        setResults(data || []);
      }

      setLoading(false);
    };

    fetchProfessionals();
  }, [category]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profesionales para "{decodeURIComponent(category as string)}"</h1>

      {loading ? (
        <p>Cargando profesionales...</p>
      ) : results.length === 0 ? (
        <p>No se encontraron profesionales.</p>
      ) : (
        <div className={styles.grid}>
          {results.map((pro) => (
            <div key={pro.user_id} className={styles.card}>
              <img src={pro.avatar_url || '/default-user.png'} alt={pro.full_name} className={styles.avatar} />
              <h3>{pro.full_name}</h3>
              <p>{pro.job_description}</p>
              <p><strong>Email:</strong> {pro.email}</p>
              <p><strong>Tel:</strong> {pro.phone}</p>
              <p><strong>Categorías:</strong> {pro.categories?.join(", ")}</p>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
