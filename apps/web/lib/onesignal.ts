// lib/onesignal.ts
import OneSignal from "react-onesignal";

export const initializeOneSignal = async () => {
  await OneSignal.init({
    appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
    allowLocalhostAsSecureOrigin: true,
    useSiteOriginAsSubdomain: true,
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
        'dialog.blocked.title': 'Notificaciones bloqueadas',
        'dialog.blocked.message': 'Por favor habilitá notificaciones en tu navegador.',
        'message.action.subscribing': 'Activando notificaciones...',
      },
    },
    serviceWorkerPath: "/OneSignalSDKWorker.js",
    serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
    serviceWorkerParam: {
      scope: "/",
    },
  });
};
