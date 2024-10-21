const LOOK = "look";
const FEEL = "feel";
const GET = "get";
const GO = "go";
const USE = "use";
const SAY = "say";
const ASK = "ask";
const DO = "do";

const VERB_SYNONYMS = {
  [LOOK]: { synonyms: [LOOK, "see", "observe", "view"] },
  [FEEL]: { synonyms: [FEEL, "touch", "touch"] },
  [GET]: { synonyms: [GET, "take", "grab", "pick up"] },
  [GO]: { synonyms: [GO, "move", "walk", "proceed"] },
  [USE]: { synonyms: [USE, "utilize", "employ", "apply"] },
  [SAY]: { synonyms: [SAY, "speak", "tell", "announce"] },
  [ASK]: { synonyms: [ASK, "request", "inquire", "query"] },
  [DO]: { synonyms: [DO, "perform", "execute", "carry out"] },
};

const normalizeVerb = (word: string): string => {
  for (const [key, synonymList] of Object.entries(VERB_SYNONYMS)) {
    if (synonymList.synonyms.includes(word.toLowerCase())) {
      return key;
    }
  }
  return word;
};

export { normalizeVerb, LOOK };
