import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Drama } from "../types/drama.types";
import {
    loadDramasForUser,
    saveDramasForUser,
  } from "../utils/dramaStorage";


type DramasState = {
  items: Drama[];
  userId: string | null;
};


const initialState: DramasState = {
  items: [],
  userId: null,
};

const dramaSlice = createSlice({
  name: "dramas",
  initialState,
  reducers: {
    addDrama: (state, action: PayloadAction<Drama>) => {
    state.items.push(action.payload);

    if (state.userId) {
      saveDramasForUser(state.userId, state.items);
    }
  },
    deleteDrama: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((drama) => drama.id !== action.payload);
      if (state.userId) {
        saveDramasForUser(state.userId, state.items);
      }
    },
    updateDrama: (state, action: PayloadAction<Drama>) => {
      const index = state.items.findIndex((drama) => drama.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.userId) {
          saveDramasForUser(state.userId, state.items);
        }
      }
    },
    loadUserDramas: (state, action: PayloadAction<string>) => {
    state.userId = action.payload;
    state.items = loadDramasForUser(action.payload);
    },
    clearUserDramas: (state) => {
    state.items = [];
    state.userId = null;
  },

  },
});

export const { addDrama, deleteDrama, updateDrama, loadUserDramas, clearUserDramas } = dramaSlice.actions;

export default dramaSlice.reducer;