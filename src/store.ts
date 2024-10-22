import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from "./features/item/itemSlice";
import locationReducer from "./features/location/locationSlice";
import informationReducer from "./features/window/windowSlice";
import logReducer from "./features/log/logSlice";
import flagReducer from "./features/flag/flagSlice";
import commandReducer from "./features/command/commandSlice.ts";
export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    location: locationReducer,
    information: informationReducer,
    log: logReducer,
    flag: flagReducer,
    command: commandReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
