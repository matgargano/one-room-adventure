import { InventoryState } from "../features/item/itemSlice";
import { LocationState } from "../features/location/locationSlice";

export interface State {
  location?: LocationState;
  inventory?: InventoryState;
}
