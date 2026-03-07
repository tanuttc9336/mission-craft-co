import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 font-display text-7xl font-extrabold">404</h1>
        <p className="mb-6 text-sm text-muted-foreground tracking-wider uppercase">Page not found</p>
        <a href="/" className="text-xs tracking-widest uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
