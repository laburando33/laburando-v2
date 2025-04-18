// lib/sendNotification.ts

export async function sendNotification({
  title,
  message,
  url, // opcional: para redirigir al hacer clic
}: {
  title: string;
  message: string;
  url?: string;
}) {
  const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID!;
  const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY!;
  const ADMIN_SEGMENT = "Admins"; // debe coincidir con tu segment en OneSignal

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: [ADMIN_SEGMENT],
        headings: { en: title },
        contents: { en: message },
        url, // si lo pasás, lo agrega
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Error al enviar notificación:", result.errors || result);
      throw new Error("Error al enviar notificación.");
    }

    console.log("🔔 Notificación enviada con éxito:", result);
    return result;
  } catch (error) {
    console.error("❌ Fallo al enviar notificación:", error);
    throw error;
  }
}
