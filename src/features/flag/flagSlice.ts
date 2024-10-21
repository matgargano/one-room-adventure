import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FlagState {
  handsTied: boolean;
  blindfolded: boolean;
  wireCutInCage: boolean;
}

const initialState: FlagState = {
  handsTied: true,
  blindfolded: true,
  wireCutInCage: false,
};

export const flagSlice = createSlice({
  name: "flag",
  initialState,
  reducers: {
    set: (
      state: FlagState,
      action: PayloadAction<{ what: keyof FlagState; value: boolean }>
    ) => {
      state[action.payload.what] = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { set } = flagSlice.actions;

export default flagSlice.reducer;
