'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase-web';
import OneSignal from 'react-onesignal';

export default function RegistroProfesional() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    if (!email || !password || !fullName || !location || !category) {
      setError('Todos los campos obligatorios deben completarse');
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          is_professional: true,
          role: 'profesional',
        },
        emailRedirectTo: `${location.origin}/login`,
      },
    });

    const userId = data.user?.id || data.session?.user?.id;

    if (signUpError || !userId) {
      setError(signUpError?.message || 'Error al crear usuario');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('professionals').insert({
      user_id: userId,
      full_name: fullName,
      email,
      phone,
      location,
      category,
      job_description: jobDescription,
      is_verified: false,
      verificacion_status: 'no_verificado',
      role: 'profesional',
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Intentar setear OneSignal ID
    try {
      await OneSignal.setExternalUserId(userId);
    } catch (err) {
      console.warn('No se pudo setear OneSignal user ID:', err);
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push('/login');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem' }}>
      <h2>Registro Profesional</h2>

      <input placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="Teléfono (opcional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Ubicación" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input placeholder="Categoría o Rubro" value={category} onChange={(e) => setCategory(e.target.value)} />
      <textarea placeholder="Descripción del trabajo (opcional)" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />

      <label style={{ display: 'block', marginTop: '1rem' }}>
        <input type="checkbox" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} />
        Acepto los términos y condiciones
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>✅ Registro exitoso. Redirigiendo...</p>}

      <button onClick={handleRegister} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Registrando...' : 'Registrarme'}
      </button>
    </div>
  );
}
