import { ReactNode, useState, useEffect } from "react";

export function SkeletonLoader({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-pulse h-4"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

export function ContentWithSkeleton({ children, lines = 3 }: { children: ReactNode; lines?: number }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <SkeletonLoader lines={lines} />;
  return <>{children}</>;
}
