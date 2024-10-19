import { InventoryState } from "../features/inventory/inventorySlice";
import { LocationState } from "../features/location/locationSlice";

export interface State {
  location?: LocationState;
  inventory?: InventoryState;
}
