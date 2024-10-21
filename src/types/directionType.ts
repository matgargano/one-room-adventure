import { NORTH, SOUTH, EAST, WEST, FLOOR } from "../const/directions";

export const VALID_DIRECTIONS = [NORTH, SOUTH, EAST, WEST] as const;
export const VALID_DIRECTIONS_WITH_FLOOR = [
  FLOOR,
  ...VALID_DIRECTIONS,
] as const;

// Derive the type from the array
export type DirectionType = (typeof VALID_DIRECTIONS)[number];
export type DirectionTypeWithFloor =
  (typeof VALID_DIRECTIONS_WITH_FLOOR)[number];
