import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  INVENTORY,
  LOCATION_ITEMS,
  INTRO,
  WindowState,
} from "../../const/windows";

export interface WindowStateInterface {
  window: WindowState;
  color: string | null;
  title: string | null;
}

const colorMap = {
  [INVENTORY]: "red-200",
  [LOCATION_ITEMS]: "blue-200",
  [INTRO]: "yellow-200",
};

const titleMap = {
  [INVENTORY]: "Inventory",
  [LOCATION_ITEMS]: "Items in View",
  [INTRO]: "Intro",
};

const initialState: WindowStateInterface = {
  window: INTRO,
  color: colorMap[INTRO],
  title: titleMap[INTRO],
};

export const informationSlice = createSlice({
  name: "information",
  initialState,
  reducers: {
    setWindow: (
      state: WindowStateInterface,
      action: PayloadAction<WindowState>
    ) => {
      state.window = action.payload;
      state.color = state.window ? colorMap[state.window] : null;
      state.title = state.window ? titleMap[state.window] : null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWindow } = informationSlice.actions;

export default informationSlice.reducer;
