import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Drama } from "../types/drama.types";


type DramasState = {
  items: Drama[];
  userId: string | null;
};

 type LoadUserDramasPayload = {
    userId: string;
    dramas: Drama[];
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

    loadUserDramas: (state, action: PayloadAction<LoadUserDramasPayload>) => {
    state.userId = action.payload.userId;
    state.items = action.payload.dramas;
    },

    clearUserDramas: (state) => {
    state.items = [];
    state.userId = null;
  },

  },
});

export const { addDrama, deleteDrama, updateDrama, loadUserDramas, clearUserDramas } = dramaSlice.actions;

export default dramaSlice.reducer;