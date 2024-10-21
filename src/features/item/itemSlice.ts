import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import ITEMS, { InventoryItem } from "../../const/items";
import { FLOOR } from "../../const/directions";

const INVENTORY = "inventory";

const initialState = { items: ITEMS };

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    pickUp: (
      state: { items: Record<string, InventoryItem> },
      action: PayloadAction<{ item: string }>
    ) => {
      const item = ITEMS[action.payload.item];
      if (item) {
        state.items[action.payload.item].location = INVENTORY;
      }
    },
    drop: (
      state: { items: Record<string, InventoryItem> },
      action: PayloadAction<{ item: string }>
    ) => {
      state.items[action.payload.item].location = FLOOR;
    },
    updateCanOpen: (
      state: { items: Record<string, InventoryItem> },
      action: PayloadAction<{ item: string; value: boolean }>
    ) => {
      state.items[action.payload.item].canOpen = action.payload.value;
    },
    updateIsOpen: (
      state: { items: Record<string, InventoryItem> },
      action: PayloadAction<{ item: string; value: boolean }>
    ) => {
      state.items[action.payload.item].isOpen = action.payload.value;
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
export const { pickUp, drop, updateCanOpen, updateIsOpen } =
  inventorySlice.actions;

export default inventorySlice.reducer;
