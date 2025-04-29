"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-web";
import styles from "@/styles/admin.module.css";

interface Profesional {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  verificacion_status: string;
}

interface Compra {
  id: string;
  plan_name: string;
  credits: number;
  amount: number;
  created_at: string;
}

interface Cupon {
  id: string;
  code: string;
  discount_percentage: number;
  used_count: number;
  max_uses: number | null;
  is_active: boolean;
  expires_at: string | null;
}

export default function DashboardAdmin() {
  const [tab, setTab] = useState<"usuarios" | "compras" | "cupones">("usuarios");
  const [usuarios, setUsuarios] = useState<Profesional[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: users }, { data: purchases }, { data: coupons }] = await Promise.all([
        supabase.from("professionals").select("user_id, full_name, email, role, verificacion_status"),
        supabase.from("credit_purchases").select("id, plan_name, credits, amount, created_at").order("created_at", { ascending: false }),
        supabase.from("discount_coupons").select("*").order("created_at", { ascending: false }),
      ]);

      setUsuarios(users || []);
      setCompras(purchases || []);
      setCupones(coupons || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loading}>🔄 Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>📊 Panel de Administración</h1>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabBtn} ${tab === "usuarios" ? styles.activeTab : ""}`}
          onClick={() => setTab("usuarios")}
        >
          👥 Profesionales
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "compras" ? styles.activeTab : ""}`}
          onClick={() => setTab("compras")}
        >
          💳 Compras de Créditos
        </button>
        <button
          className={`${styles.tabBtn} ${tab === "cupones" ? styles.activeTab : ""}`}
          onClick={() => setTab("cupones")}
        >
          🎟 Cupones
        </button>
      </div>

      {/* Usuarios */}
      {tab === "usuarios" && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>👥 Profesionales Registrados</h2>
          <div className={styles.cardList}>
            {usuarios.map((user) => (
              <div key={user.user_id} className={styles.cardItem}>
                <strong>{user.full_name}</strong>
                <p>📧 {user.email}</p>
                <p>🔖 Rol: {user.role}</p>
                <p>🛡 Estado: {user.verificacion_status}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Compras */}
      {tab === "compras" && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>💳 Historial de Compras</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Créditos</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <tr key={compra.id}>
                    <td>{compra.plan_name}</td>
                    <td>{compra.credits}</td>
                    <td>${compra.amount}</td>
                    <td>{new Date(compra.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Cupones */}
      {tab === "cupones" && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎟 Cupones Activos</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descuento</th>
                  <th>Usados</th>
                  <th>Máximo</th>
                  <th>Expira</th>
                  <th>Activo</th>
                </tr>
              </thead>
              <tbody>
                {cupones.map((cupon) => (
                  <tr key={cupon.id}>
                    <td>{cupon.code}</td>
                    <td>{cupon.discount_percentage}%</td>
                    <td>{cupon.used_count}</td>
                    <td>{cupon.max_uses ?? "∞"}</td>
                    <td>{cupon.expires_at ? new Date(cupon.expires_at).toLocaleDateString() : "—"}</td>
                    <td>{cupon.is_active ? "✅" : "⛔"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
