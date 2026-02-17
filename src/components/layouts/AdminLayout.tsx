import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:ml-[250px] p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
