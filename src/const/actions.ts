export const Actions = {
  TAKE: "take",
  OPEN: "open",
  CLOSE: "close",
  ATTACK: "attack",
  FEEL: "feel",
  GET: "get",
  TOUCH: "touch",
  LOOK: "look",
  RUB: "rub",
  REMOVE: "remove",
};

const ACTION_SYNONYMS = {
  [Actions.TAKE]: ["take", "grab", "pick up"],
  [Actions.OPEN]: ["open", "unlock", "unseal"],
  [Actions.CLOSE]: ["close", "seal", "lock"],
  [Actions.ATTACK]: ["attack", "strike"],
  [Actions.FEEL]: ["feel", "touch", "touch"],
  [Actions.GET]: ["get", "take", "grab", "pick up"],
  [Actions.TOUCH]: ["touch", "touch"],
  [Actions.LOOK]: ["look", "see", "observe", "view"],
  [Actions.RUB]: ["rub"],
  [Actions.REMOVE]: ["remove", "take off"],
};

const ACTION_SYNONYMS_PAST_TENSE = {
  take: "took",
  grab: "grabbed",
  "pick up": "picked up",
  open: "opened",
  unlock: "unlocked",
  unseal: "unsealed",
  close: "closed",
  seal: "sealed",
  lock: "locked",
  attack: "attacked",
  strike: "struck",
  feel: "felt",
  touch: "touched",
  look: "looked",
  see: "saw",
  observe: "observed",
  view: "viewed",
};

const ACTION_SYNONYMS_CURRENT_TENSE = {
  take: "take",
  grab: "grab",
  "pick up": "pick up",
  open: "open",
  unlock: "unlock",
  unseal: "unseal",
  close: "close",
  seal: "seal",
  lock: "lock",
  attack: "attack",
  strike: "strike",
  feel: "feel",
  touch: "touch",
  look: "look",
  see: "see",
  observe: "observe",
  view: "view",
};

const ACTION_SYNONYMS_FUTURE_TENSE = {
  take: "will take",
  grab: "will grab",
  "pick up": "will pick up",
  open: "will open",
  unlock: "will unlock",
  unseal: "will unseal",
  close: "will close",
  seal: "will seal",
  lock: "will lock",
  attack: "will attack",
  strike: "will strike",
  feel: "will feel",
  touch: "will touch",
  look: "will look",
  see: "will see",
  observe: "will observe",
  view: "will view",
};

interface Action {
  actual: string;
  original: string;
  success: boolean;
}

export const getAction = (action: string): Action => {
  if (Object.keys(ACTION_SYNONYMS).includes(action)) {
    return { actual: action, original: action, success: true };
  }
  for (const [key, synonyms] of Object.entries(ACTION_SYNONYMS)) {
    if (synonyms.includes(action.toLowerCase())) {
      return { actual: key, original: action, success: true };
    }
  }
  return { actual: action, original: action, success: false };
};

export const getActionTense = (action: string, tense: string): string => {
  switch (tense) {
    case "past":
      return (
        ACTION_SYNONYMS_PAST_TENSE[
          action as keyof typeof ACTION_SYNONYMS_PAST_TENSE
        ] || action
      );
    case "future":
      return (
        ACTION_SYNONYMS_FUTURE_TENSE[
          action as keyof typeof ACTION_SYNONYMS_FUTURE_TENSE
        ] || action
      );
    default:
      return (
        ACTION_SYNONYMS_CURRENT_TENSE[
          action as keyof typeof ACTION_SYNONYMS_CURRENT_TENSE
        ] || action
      );
  }
};
