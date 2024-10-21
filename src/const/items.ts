export const CHAIR = "chair";
export const DESK = "desk";
export const RADIO = "radio";
export const SEAT = "seat";
export const BLINDFOLD = "blindfold";
export const ROPE = "rope";

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
export const CROWBAR = "crowbar";
export const CORD = "cord";
import { NORTH, SOUTH, EAST, WEST, FLOOR } from "./directions";

export const CLOSED = "closed";

export type ItemType =
  | typeof CHAIR
  | typeof CROWBAR
  | typeof DESK
  | typeof RADIO
  | typeof SEAT
  | typeof BLINDFOLD
  | typeof ROPE
  | typeof RUG
  | typeof SEAT
  | typeof NAIL
  | typeof WINDOW
  | typeof PILLOW
  | typeof OPENER
  | typeof PLIERS
  | typeof HAMMER
  | typeof HANGER
  | typeof DOVE
  | typeof FURNITURE
  | typeof BOOK
  | typeof PICTURE
  | typeof VAULT
  | typeof CAGE
  | typeof TOOLBOX
  | typeof COUCH
  | typeof STOVE
  | typeof COAT
  | typeof COATRACK
  | typeof CORD
  | typeof SWITCH
  | typeof DOOR
  | typeof FLOWERPOT;

type InventoryItem = {
  synonyms: (ItemType | string)[];
  canPickUp: boolean;
  cannotPickUpReason?: string;
  location?: string;
  visible?: boolean;
  canOpen?: boolean;
  cannotOpenReason?: string;
  canMove?: boolean;
  isOpen?: boolean;
  canBreak?: ItemType[];
  description?:
    | string
    | {
        is?: string[];
        has?: string[];
        description: string;
      }[];
  article?: string;
  requiresOpen?: string;
  howToOpen?: string | string[];
  canOpenResponse?: string;
  descriptionOpened?: string;
};

const ITEMS: Record<ItemType, InventoryItem> = {
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
    isOpen: false,
    canOpen: false,
    requiresOpen: OPENER,
    canOpenResponse: `You are able to unlock the toolbox with the ${OPENER}.`,
    cannotOpenReason: "It's rusted shut.",
    descriptionOpened:
      "The toolbox has a pair of pliers, a hammer and a crowbar.",
  },
  [CROWBAR]: {
    synonyms: [CROWBAR],
    canPickUp: true,
    location: TOOLBOX,
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
    description: [
      {
        has: [PILLOW],
        description: "You see some pillows on it.",
      },
      {
        has: [OPENER],
        description: "You see a can opener on it.",
      },
    ],
  },
  [SEAT]: {
    synonyms: [SEAT],
    canPickUp: false,
    cannotPickUpReason: "It's bolted to the floor.",
    location: EAST,
  },
  [STOVE]: {
    synonyms: [STOVE],
    canPickUp: false,
    canOpen: true,
    isOpen: false,
    cannotPickUpReason: "It's bolted to the floor.",
    description: [
      {
        is: [CLOSED],
        description: "You cannot see much inside as it is closed.",
      },
      {
        has: [CORD],
        description: "You see a cord on it.",
      },
      {
        description: "It's empty",
      },
    ],
    location: EAST,
  },
  [CORD]: {
    synonyms: [CORD],
    canPickUp: true,
    location: STOVE,
  },

  [ROPE]: {
    synonyms: [ROPE, "string"],
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
    canBreak: [HAMMER],
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
    location: COUCH,
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
