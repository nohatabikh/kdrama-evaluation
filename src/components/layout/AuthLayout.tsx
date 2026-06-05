import { Outlet } from "react-router-dom";
import PetalOverlay from "../visual/PetalOverlay";

function AuthLayout() {
  return (
    <>
      <PetalOverlay />

      <main className="relative z-20 flex min-h-screen items-center justify-center overflow-x-clip px-4 py-10">
        <div className="pointer-events-none absolute -left-30 top-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-35 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

        <Outlet />
      </main>
    </>
  );
}

export default AuthLayout;
