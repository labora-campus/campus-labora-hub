import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import ModuleView from "./pages/student/ModuleView";
import LessonView from "./pages/student/LessonView";
import Assignments from "./pages/student/Assignments";
import AssignmentDetail from "./pages/student/AssignmentDetail";
import Profile from "./pages/student/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Cohorts from "./pages/admin/Cohorts";
import CohortContent from "./pages/admin/CohortContent";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AssignmentSubmissions from "./pages/admin/AssignmentSubmissions";
import Students from "./pages/admin/Students";
import StudentDetail from "./pages/admin/StudentDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, role } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />} />

      {/* Student routes */}
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/modules/:id" element={<ModuleView />} />
      <Route path="/lessons/:id" element={<LessonView />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/assignments/:id" element={<AssignmentDetail />} />
      <Route path="/profile" element={<Profile />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/cohorts" element={<Cohorts />} />
      <Route path="/admin/cohorts/:id/content" element={<CohortContent />} />
      <Route path="/admin/assignments" element={<AdminAssignments />} />
      <Route path="/admin/assignments/:id/submissions" element={<AssignmentSubmissions />} />
      <Route path="/admin/students" element={<Students />} />
      <Route path="/admin/students/:id" element={<StudentDetail />} />

      <Route path="/" element={<Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
