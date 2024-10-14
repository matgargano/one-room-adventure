import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InventoryState {
  items: string[];
}

const initialState: InventoryState = {
  items: [],
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addToInventory: (
      state: InventoryState,
      action: PayloadAction<{ item: string }>
    ) => {
      state.items = [...state.items, action.payload.item];
    },

    // incrementByAmount: (
    //   state: InventoryState,
    //   action: PayloadAction<number>
    // ) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { addToInventory } = inventorySlice.actions;

export default inventorySlice.reducer;
