'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔐 Si ya está logueado, redirigimos
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.replace('/admin');
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Error al iniciar sesión. Verifica tus credenciales.');
      setLoading(false);
      return;
    }

    // 🕐 Pequeño delay por sincronización de cookie
    setTimeout(() => {
      router.refresh();
      router.push('/admin/profile');
    }, 500);
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Iniciar sesión</h1>
      <form className={styles.formContainer} onSubmit={handleLogin}>
        <input
          className={styles.input}
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.loginButton} type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
}
