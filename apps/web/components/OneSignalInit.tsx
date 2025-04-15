"use client";

import OneSignal from "react-onesignal";
import { useEffect } from "react";

export default function OneSignalInit() {
  useEffect(() => {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
      notifyButton: {
        enable: true,
      },
    });
  }, []);

  return null;
}
