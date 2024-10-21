export const CHAIR = "chair";
export const DESK = "desk";
export const RADIO = "radio";
export const SEAT = "seat";
export const BLINDFOLD = "blindfold";
export const ROPE = "rope";
export const STRING = "string";
export const NAIL = "nail";
export const WINDOW = "window";
export const PILLOW = "pillow";
export const OPENER = "opener";
export const PLIERS = "pliers";
export const HAMMER = "hammer";
export const HANGER = "hanger";
export const DOVE = "dove";
export const FURNITURE = "furniture";
export const BOOK = "book";
export const PICTURE = "picture";
export const VAULT = "vault";
export const CAGE = "cage";
export const TOOLBOX = "toolbox";
export const COUCH = "couch";
export const STOVE = "stove";
export const COAT = "coat";
export const COATRACK = "coatrack";
export const RUG = "rug";
export const FLOWERPOT = "flowerpot";
export const SWITCH = "switch";
export const DOOR = "door";
export const GLASS = "glass";

import { NORTH, SOUTH, EAST, WEST, FLOOR } from "./directions";

type InventoryItem = {
  synonyms: string[];
  canPickUp: boolean;
  cannotPickUpReason?: string;
  location?: string;
  visible?: boolean;
  canOpen?: boolean;
  cannotOpenReason?: string;
  canMove?: boolean;
  isOpen?: boolean;
  description?: string;
  article?: string;
  requiresOpen?: string;
  howToOpen?: string | string[];
  canOpenResponse?: string;
};

const ITEMS: Record<string, InventoryItem> = {
  [CHAIR]: {
    synonyms: [CHAIR, SEAT],
    canPickUp: false,
    cannotPickUpReason: "It's bolted to the floor.",
    location: NORTH,
    visible: false,
  },
  [DESK]: {
    synonyms: [DESK],
    canPickUp: false,
    cannotPickUpReason: "It's bolted to the floor.",
    location: NORTH,
    canOpen: false,
    cannotOpenReason: "It's locked.",
  },
  [RADIO]: {
    synonyms: [RADIO],
    canPickUp: true,
    location: NORTH,
  },
  [TOOLBOX]: {
    synonyms: [TOOLBOX],
    canPickUp: true,
    location: EAST,
    canOpen: false,
    requiresOpen: OPENER,
    canOpenResponse: `You are able to unlock the toolbox with the ${OPENER}.`,
    cannotOpenReason: "It's rusted shut.",
  },
  [CAGE]: {
    synonyms: [CAGE, "birdcage", "bird cage"],
    canPickUp: false,
    cannotPickUpReason: "It's bolted to the wall.",
    canOpen: false,
    cannotOpenReason: "You're not sure how to open a cage.",
    location: EAST,
  },
  [COUCH]: {
    synonyms: [COUCH],
    canPickUp: false,
    cannotPickUpReason: "It's bolted to the floor.",
    location: EAST,
    isOpen: true,
    description: "You see a can opener on it.",
  },
  [STOVE]: {
    synonyms: [STOVE],
    canPickUp: false,
    cannotPickUpReason: "It's bolted to the floor.",
    location: EAST,
  },

  [ROPE]: {
    synonyms: [ROPE, STRING],
    canPickUp: false,
    cannotPickUpReason: "Frankly, it's a bit too traumatic to pick up.",
    location: FLOOR,
  },
  [BLINDFOLD]: {
    synonyms: [BLINDFOLD],
    canPickUp: false,
    cannotPickUpReason: "Frankly, it's a bit too traumatic to pick up.",
    location: FLOOR,
  },
  [RUG]: {
    synonyms: [RUG],
    canPickUp: true,
    canMove: true,
    location: FLOOR,
  },

  [WINDOW]: {
    synonyms: [WINDOW, "windows"],
    canPickUp: false,
    cannotPickUpReason: "It's attached to the wall.",
    location: WEST,
  },
  [FURNITURE]: {
    synonyms: [FURNITURE],
    canPickUp: false,
    cannotPickUpReason: "It is way too heavy to pick up.",

    location: WEST,
  },
  [COATRACK]: {
    synonyms: [COATRACK],
    canPickUp: false,
    cannotPickUpReason: "It is way too heavy to pick up.",
    location: WEST,
  },
  [COAT]: {
    synonyms: [COAT],
    canPickUp: true,
    location: WEST,
  },

  [PILLOW]: {
    synonyms: [PILLOW],
    canPickUp: true,
    location: COUCH,
    canOpen: true,
    isOpen: false,
    requiresOpen: GLASS,
    description: "It feels rather heavy",
  },
  [NAIL]: {
    synonyms: [NAIL],
    canPickUp: false,
    cannotPickUpReason: "It's hammered into the chair.",
  },
  [OPENER]: {
    synonyms: [OPENER, "canopener", "can opener"],
    canPickUp: true,
    location: PILLOW,
  },
  [PLIERS]: { synonyms: [PLIERS], canPickUp: true, location: TOOLBOX },
  [HAMMER]: { synonyms: [HAMMER], canPickUp: true, location: TOOLBOX },
  [HANGER]: { synonyms: [HANGER], canPickUp: true, location: COATRACK },

  [DOVE]: {
    synonyms: [DOVE],
    canPickUp: false,
    cannotPickUpReason: "You're not sure how to pick up a dove.",
    location: CAGE,
  },

  [BOOK]: { synonyms: [BOOK], canPickUp: true, location: FURNITURE },

  [VAULT]: {
    synonyms: [VAULT],
    canPickUp: false,
    cannotPickUpReason: "It's bolted to the wall.",
  },
  [PICTURE]: {
    synonyms: [PICTURE, "painting"],
    canPickUp: true,
    location: SOUTH,
  },
  [SWITCH]: {
    synonyms: [SWITCH],
    canPickUp: false,
    cannotPickUpReason: "It's attached to the wall.",
    location: SOUTH,
  },
  [DOOR]: {
    synonyms: [DOOR],
    canPickUp: false,
    cannotPickUpReason: "It's attached to the wall.",
    location: SOUTH,
  },
  [FLOWERPOT]: { synonyms: [FLOWERPOT], canPickUp: true, location: SOUTH },
};

const normalizeItem = (word: string): string => {
  for (const [key, synonymList] of Object.entries({
    ...ITEMS,
  })) {
    if (synonymList.synonyms.includes(word.toLowerCase())) {
      return key;
    }
  }
  return word;
};

export default ITEMS;
export { normalizeItem };
export type { InventoryItem };
