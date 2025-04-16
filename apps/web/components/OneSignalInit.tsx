'use client';

import OneSignal from "react-onesignal";
import { useEffect } from "react";

export default function OneSignalInit() {
  console.log("🧪 OneSignalInit.tsx montado");

  useEffect(() => {
    console.log("🧪 useEffect ejecutado");

    // Protección para inicializar una sola vez en cliente
    if (typeof window !== "undefined" && !window.__ONESIGNAL_INITIALIZED__) {
      window.__ONESIGNAL_INITIALIZED__ = true;

      console.log("✅ OneSignal inicializando...");

      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
        notifyButton: {
          enable: true,
        },
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "/OneSignalSDKUpdaterWorker.js",
        serviceWorkerParam: {
          scope: "/",
        },
      });
    } else {
      console.log("⛔ OneSignal ya estaba inicializado");
    }
  }, []);

  return null;
}
