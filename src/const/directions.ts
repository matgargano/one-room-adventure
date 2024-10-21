export const FLOOR = "floor";
export const NORTH = "north";
export const SOUTH = "south";
export const EAST = "east";
export const WEST = "west";

const DIRECTIONS = {
  [NORTH]: { synonyms: ["north", "n"], canFace: true },
  [SOUTH]: { synonyms: ["south", "s"], canFace: true },
  [EAST]: { synonyms: ["east", "e"], canFace: true },
  [WEST]: { synonyms: ["west", "w"], canFace: true },
  [FLOOR]: { synonyms: ["floor", "ground"], canFace: false },
};

const normalizeDirection = (word: string): string => {
  for (const [key, directionList] of Object.entries(DIRECTIONS)) {
    if (directionList.synonyms.includes(word.toLowerCase())) {
      return key;
    }
  }
  return word;
};

export { normalizeDirection };
