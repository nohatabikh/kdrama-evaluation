import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PetalOverlay from "../visual/PetalOverlay";

function MainLayout() {
  return (
    <>
      <PetalOverlay />
      <Navbar />

      <main className="relative z-20">
        {/* based on current URL, I’ll inject the correct page here. */}
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
