import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Drama } from "../types/drama.types";

type HydrationStatus = "idle" | "loading" | "loaded";

type DramasState = {
  items: Drama[];
  userId: string | null;
  hydrationStatus: HydrationStatus;
};

type LoadUserDramasPayload = {
  userId: string;
  dramas: Drama[];
};

const initialState: DramasState = {
  items: [],
  userId: null,
  hydrationStatus: "idle",
};

const dramaSlice = createSlice({
  name: "dramas",
  initialState,
  reducers: {
    addDrama: (state, action: PayloadAction<Drama>) => {
      state.items.push(action.payload);
    },

    deleteDrama: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (drama) => drama.id !== action.payload,
      );
    },

    updateDrama: (state, action: PayloadAction<Drama>) => {
      const index = state.items.findIndex(
        (drama) => drama.id === action.payload.id,
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    startUserDramasHydration: (state, action: PayloadAction<string>) => {
      state.items = [];
      state.userId = action.payload;
      state.hydrationStatus = "loading";
    },

    loadUserDramas: (state, action: PayloadAction<LoadUserDramasPayload>) => {
      state.userId = action.payload.userId;
      state.items = action.payload.dramas;
      state.hydrationStatus = "loaded";
    },

    clearUserDramas: (state) => {
      state.items = [];
      state.userId = null;
      state.hydrationStatus = "idle";
    },
  },
});

export const {
  addDrama,
  deleteDrama,
  updateDrama,
  startUserDramasHydration,
  loadUserDramas,
  clearUserDramas,
} = dramaSlice.actions;

export default dramaSlice.reducer;
