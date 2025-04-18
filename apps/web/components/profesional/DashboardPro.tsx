'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePerfil } from '@/hooks/usePerfil';
import OneSignal from 'react-onesignal';

export default function DashboardPro() {
  const router = useRouter();
  const { perfil, loading, error } = usePerfil();
  const [notificacionesInit, setNotificacionesInit] = useState(false);

  useEffect(() => {
    if (!loading && perfil) {
      if (perfil.verificacion_status !== 'verificado') {
        router.push('/verificacion-pendiente');
      } else if (!notificacionesInit) {
        // Inicializa OneSignal solo si está verificado
        OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true,
            prenotify: true,
            showCredit: false,
            text: {
              'tip.state.unsubscribed': 'Suscribite para recibir notificaciones',
              'tip.state.subscribed': 'Estás suscrito',
              'tip.state.blocked': 'Bloqueado',
              'message.prenotify': 'Click para suscribirte',
              'message.action.subscribed': 'Gracias por suscribirte',
              'message.action.resubscribed': 'Estás suscrito nuevamente',
              'message.action.unsubscribed': 'No recibirás más notificaciones',
              'dialog.main.title': 'Notificaciones del sitio',
              'dialog.main.button.subscribe': 'SUSCRIBIRME',
              'dialog.main.button.unsubscribe': 'DESUSCRIBIRME',
            },
          },
          serviceWorkerPath: '/OneSignalSDKWorker.js',
          serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js',
          serviceWorkerParam: {
            scope: '/',
          },
        });
        setNotificacionesInit(true);
      }
    }
  }, [perfil, loading, router, notificacionesInit]);

  if (loading) return <p>Cargando perfil...</p>;
  if (error || !perfil) return <p>No se encontró tu perfil. Error: {error}</p>;

  const puedeComprar = perfil.verificacion_status === 'verificado';

  return (
    <div>
      <h2>Bienvenido/a {perfil.full_name}</h2>
      <p>Tu estado de verificación es: <strong>{perfil.verificacion_status}</strong></p>

      {puedeComprar ? (
        <button onClick={() => console.log('Comprando lead...')}>Comprar Lead</button>
      ) : (
        <p style={{ color: 'red' }}>🔒 Debés verificar tu cuenta para comprar leads.</p>
      )}

      {/* Otras secciones del dashboard */}
    </div>
  );
}
