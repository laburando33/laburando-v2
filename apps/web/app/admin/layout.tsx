// apps/web/app/admin/layout.tsx
import "./admin-layout.css"; // ✅ CSS layout principal
import styles from "./admin.module.css"; // ✅ Estilos generales del panel
import ProfessionalSidebar from "../../components/ProfessionalSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <ProfessionalSidebar />
      <main className={styles.adminContent}>{children}</main>
    </div>
  );
}
