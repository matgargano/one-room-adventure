import { BLINDFOLD, CHAIR, ROPE, SEAT, STRING } from "./items";

const SYNONYMS = {
  north: ["north", "n"],
  south: ["south", "s"],
  east: ["east", "e"],
  west: ["west", "w"],
  look: ["look", "see", "observe", "view"],
  feel: ["feel", "touch", "touch"],
  get: ["get", "take", "grab", "pick up"],
  go: ["go", "move", "walk", "proceed"],
  use: ["use", "utilize", "employ", "apply"],
  say: ["say", "speak", "tell", "announce"],
  ask: ["ask", "request", "inquire", "query"],
  do: ["do", "perform", "execute", "carry out"],
  [CHAIR]: [CHAIR, SEAT],
  [ROPE]: [ROPE, STRING],
  [BLINDFOLD]: [BLINDFOLD],
};

const normalizeItem = (word: string): string => {
  for (const [key, synonymList] of Object.entries(SYNONYMS)) {
    if (synonymList.includes(word.toLowerCase())) {
      return key;
    }
  }
  return word;
};

export default SYNONYMS;
export { normalizeItem };
