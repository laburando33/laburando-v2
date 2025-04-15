"use client";
import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase-web";
import { useRouter } from "next/navigation";
import styles from "./DashboardPro.module.css";

export default function DashboardPro() {
  const [fullName, setFullName] = useState("Usuario");
  const [credits, setCredits] = useState(0);
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: profile } = await supabase
        .from("professionals")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) setFullName(profile.full_name);

      const { data: creditData } = await supabase
        .from("credits")
        .select("total_credits, used_credits")
        .eq("user_id", user.id)
        .maybeSingle();

      if (creditData) {
        setCredits(creditData.total_credits - creditData.used_credits);
      }

      const { data: reqs } = await supabase
        .from("requests")
        .select("*")
        .contains("paid_professionals", [user.id])
        .order("created_at", { ascending: false });

      setRequests(reqs || []);
    };

    load();
  }, [router]);

  return (
    <main className={styles.container}>
      <h2>👋 Hola, {fullName}</h2>
      <p>Créditos disponibles: {credits}</p>
      <h3>Solicitudes</h3>
      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            {r.category} - {r.status}
          </li>
        ))}
      </ul>
    </main>
  );
}
