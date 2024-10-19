export const INVENTORY = "inventory";
export const LOCATION_ITEMS = "view";
export const INTRO = "intro";
export type WindowState =
  | typeof INVENTORY
  | typeof LOCATION_ITEMS
  | typeof INTRO
  | null;
