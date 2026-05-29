import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main>
        {/* based on current URL, I’ll inject the correct page here. */}
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
