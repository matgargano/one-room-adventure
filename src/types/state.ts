import { InventoryState } from "../features/inventory/inventorySlice";
import { LocationState } from "../features/inventory/locationSlice";

export interface State {
  location?: LocationState;
  inventory?: InventoryState;
}
