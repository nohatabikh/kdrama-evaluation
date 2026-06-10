import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PetalOverlay from "../visual/PetalOverlay";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { loadUserDramas } from "../../features/dramas/store/dramaSlice";

function MainLayout() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(loadUserDramas(userId));
    }
  }, [dispatch, userId]);

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
