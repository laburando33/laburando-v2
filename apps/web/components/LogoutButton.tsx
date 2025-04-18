"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh(); // 🔁 actualiza SSR y elimina cookie del middleware
    router.replace("/login");
  };

  return (
    <button onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
}
