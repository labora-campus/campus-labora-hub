import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import MyClasses from "./pages/student/MyClasses";
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
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Cargando campus...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace /> : <Login />} />

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/modules" element={<MyClasses />} />
        <Route path="/modules/:id" element={<ModuleView />} />
        <Route path="/lessons/:id" element={<LessonView />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/assignments/:id" element={<AssignmentDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cohorts" element={<Cohorts />} />
        <Route path="/admin/cohorts/:id/content" element={<CohortContent />} />
        <Route path="/admin/assignments" element={<AdminAssignments />} />
        <Route path="/admin/assignments/:id/submissions" element={<AssignmentSubmissions />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/students/:id" element={<StudentDetail />} />
      </Route>

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
