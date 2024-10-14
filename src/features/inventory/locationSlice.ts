import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Locations } from "../../const/locations";

export interface LocationState {
  room: keyof typeof Locations;
}

const initialState: LocationState = {
  room: "main",
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // incrementByAmount: (
    //   state: LocationState,
    //   action: PayloadAction<number>
    // ) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const {} = locationSlice.actions;

export default locationSlice.reducer;
