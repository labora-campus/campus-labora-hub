import { ReactNode } from "react";
import { StudentSidebar } from "./StudentSidebar";

export function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <main className="md:ml-[250px] p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
}
