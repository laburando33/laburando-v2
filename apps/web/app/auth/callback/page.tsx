"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase-web";
import { createProfessionalProfile } from "../../../lib/createProfessionalProfile";

export default function CallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("⏳ Procesando...");

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (user) {
        await createProfessionalProfile(user);
        setTimeout(() => {
          router.replace("/admin/profile");
        }, 0);
      } else {
        router.replace("/login");
      }
    };

    handleAuth();
  }, []);

  return <p style={{ padding: "2rem" }}>{message}</p>;
}
