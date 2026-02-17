import { ReactNode } from "react";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <span className="text-foreground font-extrabold tracking-tight">Campus Labora</span>
    </div>
  );
}

export function BrandTagline({ className = "" }: { className?: string }) {
  return (
    <p className={`font-bold ${className}`}>
      <span className="text-primary">IA</span>{" "}
      <span className="text-foreground">NoCode</span>
    </p>
  );
}
