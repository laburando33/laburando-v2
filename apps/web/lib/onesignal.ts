// lib/onesignal.ts
import OneSignal from 'react-onesignal';

let isInitialized = false;

export const initOneSignal = async () => {
  if (typeof window !== 'undefined' && !isInitialized && window.location.origin === 'https://www.laburandoapp.com') {
    await OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
      safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_ID,
      notifyButton: { enable: true },
    });

    OneSignal.showSlidedownPrompt();
    isInitialized = true;
  } else {
    console.warn("🔇 OneSignal no se inicializa (dev o ya inicializado).");
  }
};
