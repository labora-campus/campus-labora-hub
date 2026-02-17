import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { BrandLogo, BrandTagline } from "@/components/BrandLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("brandon") || email.includes("admin")) {
      login("admin");
      navigate("/admin");
    } else {
      login("student");
      navigate("/dashboard");
    }
  };

  const quickLogin = (role: "student" | "admin") => {
    login(role);
    navigate(role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen gradient-hero noise-texture flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Academia Labora
          </h1>
          <BrandTagline className="text-2xl" />
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="text-sm text-muted-foreground mt-1">Accede a tu campus virtual</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg btn-scale transition-all duration-200 hover:brightness-110"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="text-center">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Quick access */}
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs text-muted-foreground text-center">Acceso rápido (demo)</p>
            <div className="flex gap-2">
              <button
                onClick={() => quickLogin("student")}
                className="flex-1 border border-primary text-primary font-semibold py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors"
              >
                Estudiante
              </button>
              <button
                onClick={() => quickLogin("admin")}
                className="flex-1 border border-primary text-primary font-semibold py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
