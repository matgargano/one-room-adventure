import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Locations } from "../../const/locations";

export interface InformationState {
  window: null | "inventory";
}

const initialState: InformationState = {
  window: null,
};

export const informationSlice = createSlice({
  name: "information",
  initialState,
  reducers: {
    setWindow: (
      state: InformationState,
      action: PayloadAction<"inventory" | null>
    ) => {
      state.window = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWindow } = informationSlice.actions;

export default informationSlice.reducer;
