import { MAIN } from "./const/locations";
import { InventoryState } from "./features/inventory/inventorySlice";
import { LocationState } from "./features/location/locationSlice";

export default function getStatus(state: {
  location: LocationState;
  inventory: InventoryState;
}) {
  const { location, inventory } = state;
  const statuses = {
    [MAIN]: {
      name: "Main",
      getDescription: () => {
        if (inventory.items.includes(NAIL)) {
          return [
            "I am In the Middle Of A Room",
            "I am sitting on a chair",
            "I am not blindfolded",
          ];
        } else {
          return [
            "I am In the Middle Of A Room",
            "I am sitting on a chair",
            "I am blindfolded",
          ];
        }
      },
    },
  };
  const r = (Object.keys(statuses) as Array<keyof typeof statuses>).reduce(
    (acc, room) => {
      acc[room] = {
        name: statuses[room].name,
        description: statuses[room].getDescription(),
      };
      return acc;
    },
    {} as Record<keyof typeof statuses, { name: string; description: string[] }>
  );
  return r[location.room as keyof typeof statuses];
}
