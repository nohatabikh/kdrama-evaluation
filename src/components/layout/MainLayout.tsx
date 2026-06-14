import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PetalOverlay from "../visual/PetalOverlay";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  loadUserDramas,
  startUserDramasHydration,
} from "../../features/dramas/store/dramaSlice";
import { loadDramasForUser } from "../../features/dramas/utils/dramaStorage";

function MainLayout() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dramaUserId = useAppSelector((state) => state.dramas.userId);
  const hydrationStatus = useAppSelector(
    (state) => state.dramas.hydrationStatus,
  );

  useEffect(() => {
    if (
      !userId ||
      (dramaUserId === userId && hydrationStatus === "loaded")
    ) {
      return;
    }

    dispatch(startUserDramasHydration(userId));

    const dramas = loadDramasForUser(userId);

    dispatch(
      loadUserDramas({
        userId,
        dramas,
      }),
    );
  }, [dispatch, dramaUserId, hydrationStatus, userId]);

  return (
    <>
      <PetalOverlay />
      <Navbar />

      <main className="relative z-20">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
