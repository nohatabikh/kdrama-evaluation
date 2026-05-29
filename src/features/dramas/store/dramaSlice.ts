import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Drama } from "../types/drama.types";

const DRAMAS_STORAGE_KEY = "kdrama-tracker-dramas";

const loadDramasFromStorage = (): Drama[] => {
  const storedDramas = localStorage.getItem(DRAMAS_STORAGE_KEY);
  return storedDramas ? JSON.parse(storedDramas) : [];
}

const saveDramasToStorage = (dramas: Drama[]) => {
  localStorage.setItem(DRAMAS_STORAGE_KEY, JSON.stringify(dramas));
};

type DramasState = {
  items: Drama[];
};



const initialState: DramasState = {
  items: loadDramasFromStorage(),
};

const dramaSlice = createSlice({
  name: "dramas",
  initialState,
  reducers: {
    addDrama: (state, action: PayloadAction<Drama>) => {
      state.items.push(action.payload);
      saveDramasToStorage(state.items);
    },
    deleteDrama: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((drama) => drama.id !== action.payload);
      saveDramasToStorage(state.items);
    },
    updateDrama: (state, action: PayloadAction<Drama>) => {
      const index = state.items.findIndex((drama) => drama.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveDramasToStorage(state.items);
      }
    },
  },
});

export const { addDrama, deleteDrama, updateDrama } = dramaSlice.actions;

export default dramaSlice.reducer;