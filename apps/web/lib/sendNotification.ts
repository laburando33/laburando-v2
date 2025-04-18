// lib/sendNotification.ts

export async function sendNotification({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) {
    const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID!;
    const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY!;
    const ADMIN_SEGMENT = "Admins"; // debe coincidir con tu segmento real en OneSignal
  
    try {
      const res = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          included_segments: [ADMIN_SEGMENT], // también podés usar 'All' o playerIds
          headings: { en: title },
          contents: { en: message },
          priority: 10,
          ttl: 60,
        }),
      });
  
      const result = await res.json();
      console.log("🔔 Notificación enviada:", result);
  
      if (!res.ok) {
        throw new Error(result.errors || "Error enviando notificación");
      }
  
      return result;
    } catch (error) {
      console.error("❌ Error al enviar notificación:", error);
      throw error;
    }
  }
  