 import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

  import type { RootState } from "../../../app/store";
  import { saveDramasForUser } from "../utils/dramaStorage";
  import { addDrama, deleteDrama, updateDrama } from "./dramaSlice";

  export const dramaListenerMiddleware = createListenerMiddleware();

  dramaListenerMiddleware.startListening({
    // Run this listener after any of these three actions.
    matcher: isAnyOf(addDrama, deleteDrama, updateDrama),

    effect: (_, listenerApi) => {
    // The listener reads the Redux state after the reducer has updated it.
      const state = listenerApi.getState() as RootState;
      const { userId, items } = state.dramas;

      if (userId) {
        saveDramasForUser(userId, items);
      }
    },
  });