// TypeScript version of the text adventure parser
import { Actions, getAction } from "../const/actions";
import { BLINDFOLD, CHAIR, NAIL, ROPE } from "../const/items";
import { MAIN } from "../const/locations";
import { setDirection } from "../features/location/locationSlice";
import { directionType } from "../types/directionType";
import { store } from "../store"; // Import your Redux store
import { normalizeItem } from "../const/synonyms";
import arrayUnique from "./arrayUnique";
import { set } from "../features/flag/flagSlice";
type CommandResult = {
  message: string;
};

interface CommandHandler {
  (args: string): CommandResult;
}

type preflightCheckResult = {
  canContinue: boolean;
  result?: CommandResult;
};

export default class TextAdventureParser {
  private commands: { [key: string]: CommandHandler };
  private verb: string | undefined;
  private directObject: string | undefined;
  private prepositionalObject: string | undefined;
  private preflightCheckResult: preflightCheckResult | undefined;

  constructor() {
    this.verb = undefined;
    this.directObject = undefined;
    this.prepositionalObject = undefined;
    this.preflightCheckResult = undefined;
    // Bind all methods to the class instance
    this.handleLook = this.handleLook.bind(this);
    this.handleLookDirection = this.handleLookDirection.bind(this);
    this.handleTake = this.handleTake.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRub = this.handleRub.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleGo = this.handleGo.bind(this);
    this.handleUse = this.handleUse.bind(this);
    this.handleTalk = this.handleTalk.bind(this);
    this.handleFeel = this.handleFeel.bind(this);
    this.handleTouch = this.handleTouch.bind(this);
    this.handleGet = this.handleGet.bind(this);
    this.checkForMatch = this.checkForMatch.bind(this);
    this.parseCommandWords = this.parseCommandWords.bind(this);
    this.preflightCheck = this.preflightCheck.bind(this);
    this.parseCommand = this.parseCommand.bind(this);

    // Define some common commands and their associated actions
    this.commands = {
      feel: this.handleFeel,
      get: this.handleTake,
      touch: this.handleTouch,
      look: this.handleLook,
      go: this.handleGo,
      use: this.handleUse,
      talk: this.handleTalk,
      take: this.handleTake,
      open: this.handleOpen,
      close: this.handleClose,
      rub: this.handleRub,
      remove: this.handleRemove,
    };
  }

  /**
   * Parses the command words and returns the entered command and its arguments
   * @param words - The words to parse
   * @returns The entered command and its arguments
   */
  private parseCommandWords(inputText: string) {
    const words = inputText.toLowerCase().trim().split(" ");
    const rawVerb = words[0];
    this.verb = getAction(rawVerb).actual;
    const directObjectArray = words
      .map((w) => w.trim())
      .slice(1)
      .filter((w) => !!w && w !== "the");
    // remove the "the" from the direct object

    // Loop through the direct object array and check for a preposition using modern JS
    const prepositionIndex = directObjectArray.findIndex((word) =>
      ["on", "in", "at", "to", "with", "from", "by", "for", "of"].includes(word)
    );

    if (prepositionIndex === -1) {
      this.directObject = normalizeItem(directObjectArray.join(" "));
      return;
    }

    const directObject = arrayUnique(
      directObjectArray
        .slice(0, prepositionIndex)
        .map((word) => normalizeItem(word.trim()))
    ).join(" ");
    const prepositionalObject = arrayUnique(
      directObjectArray
        .slice(prepositionIndex + 1)
        .map((word) => normalizeItem(word.trim()))
    ).join(" ");

    this.directObject = normalizeItem(directObject.trim());
    this.prepositionalObject = normalizeItem(prepositionalObject.trim());
  }

  /**
   * Preflight check for the command
   * @param inputText - The input text to check
   * @returns The result of the preflight check. This checks if the command is valid, if the prerequisites are met, and if the command is in the list of commands.
   */
  private preflightCheck(): { canContinue: boolean; result?: CommandResult } {
    if (!this.verb || !this.directObject) {
      return {
        canContinue: false,
        result: { message: "I don't understand what you want to do." },
      };
    }

    const {
      flag: { blindfolded, handsTied },
    } = store.getState();

    if (handsTied) {
      const rubRopeOnNail = this.checkForMatch(Actions.RUB, ROPE, NAIL);
      const feelChair = this.checkForMatch(Actions.FEEL, CHAIR);
      if ([rubRopeOnNail.match, feelChair.match].includes(1)) {
        return {
          canContinue: true,
        };
      }
      if (feelChair.match < 1 && feelChair.match > 0) {
        return {
          canContinue: false,
          result: { message: "You can't feel that, you're hands are tied!" },
        };
      }

      if (rubRopeOnNail.match < 1 && rubRopeOnNail.match > 0) {
        return {
          canContinue: false,
          result: { message: "You can't do that, your hands are tied!" },
        };
      }
    }
    if (blindfolded) {
      if (this.verb !== Actions.REMOVE || this.directObject !== BLINDFOLD) {
        return {
          canContinue: false,
          result: { message: "You can't do that, you're blindfolded!" },
        };
      }
      return {
        canContinue: true,
      };
    }
    return {
      canContinue: true,
    };
  }

  /**
   * Parses the command and returns the result
   * @param inputText - The input text to parse
   * @returns The result of the command
   */
  public parseCommand(inputText: string): CommandResult {
    // Split the input text into words
    this.parseCommandWords(inputText);
    this.preflightCheckResult = this.preflightCheck();
    if (!this.verb || !this.directObject) {
      return {
        message: "UNKNOWN ERROR 1006",
      };
    }
    if (!this.preflightCheckResult.canContinue) {
      return this.preflightCheckResult.result as CommandResult;
    }

    // Find and execute the associated command handler
    if (this.commands[this.verb]) {
      return this.commands[this.verb](this.directObject);
    } else {
      return {
        message: `I don't know how to '${this.verb} ${this.directObject}'.`,
      };
    }
  }

  private handleFeel(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What would you like to feel?" };
    }

    return { message: "You don't feel anything out of the ordinary." };
  }

  private handleGet(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to get?" };
    }
    return {
      message: `You pick up the ${this.directObject}.`,
    };
  }

  private handleTouch(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to touch?" };
    }
    return {
      message: `You touch the ${this.directObject}.`,
    };
  }

  private handleLook(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to look at?" };
    }
    return {
      message: `You look at the ${this.directObject}.`,
    };
  }

  private handleLookDirection(): CommandResult | false {
    if (
      this?.directObject?.length === 1 &&
      ["north", "south", "east", "west"].includes(
        this.directObject[0].toLowerCase()
      )
    ) {
      const requestedDirection =
        this.directObject[0].toLowerCase() as directionType;

      const { location } = store.getState();
      const currentDirection = location?.direction;

      if (requestedDirection === currentDirection) {
        return {
          message: `You already are looking ${requestedDirection}.`,
        };
      }
      // Dispatch the action to update the direction
      store.dispatch(setDirection(requestedDirection));
      return {
        message: `You look ${requestedDirection}.`,
      };
    }
    return false;
  }

  private handleGo(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to go?" };
    }
    return {
      message: `You go ${this.directObject}.`,
    };
  }

  private handleUse(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to use?" };
    }
    return {
      message: `You use the ${this.directObject}, but nothing seems to happen.`,
    };
  }

  private handleTalk(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to talk to?" };
    }
    return {
      message: `You talk to the ${this.directObject}.`,
    };
  }

  private handleTake(): CommandResult {
    const { location, inventory } = store.getState();
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to take?" };
    }
    if (location?.room === MAIN) {
      if (!inventory?.items.includes(NAIL)) {
        return {
          message: `You pick up the ${this.directObject}.`,
        };
      } else {
        return {
          message: `You already have the ${this.directObject}.`,
        };
      }
    }
    return { message: `I don't see any ${this.directObject} here.` };
  }

  private handleOpen(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to open?" };
    }
    return {
      message: `You open the ${this.directObject}.`,
    };
  }

  private handleClose(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to close?" };
    }
    return {
      message: `You close the ${this.directObject}.`,
    };
  }

  private handleRub(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to rub?" };
    }

    const { blindfolded, handsTied } = store.getState().flag;

    if (handsTied && 1 === this.checkForMatch(Actions.RUB, ROPE, NAIL).match) {
      store.dispatch(set({ what: "handsTied", value: false }));
      return {
        message: "You rub your hands on the nail, freeing them!",
      };
    }

    if (blindfolded && ![CHAIR, ROPE, NAIL].includes(this.directObject)) {
      return {
        message: "You can't do that, you're blindfolded!",
      };
    }

    return {
      message: `You rub the ${this.directObject}. It doesn't seem very effective.`,
    };
  }

  private handleRemove(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to remove?" };
    }
    return {
      message: `You remove the ${this.directObject}.`,
    };
  }

  private checkForMatch(
    verbToMatch: string,
    directObjectToMatch: string,
    preopositionalObjectToMatch?: string | undefined
  ): { match: number } {
    preopositionalObjectToMatch = preopositionalObjectToMatch || undefined;
    if (
      verbToMatch === this.verb &&
      directObjectToMatch === this.directObject &&
      preopositionalObjectToMatch === this.prepositionalObject
    ) {
      return { match: 1 };
    }
    if (
      verbToMatch === this.verb &&
      directObjectToMatch === this.directObject &&
      preopositionalObjectToMatch !== this.prepositionalObject
    ) {
      return { match: 0.5 };
    }
    if (verbToMatch === this.verb) {
      return { match: 0.25 };
    }

    return { match: 0 };
  }

  // private commandActual(command: string): string {
  //   return getAction(command).actual;
  // }

  // private checkCommand(command: string, against: string[] | string) {
  //   if (Array.isArray(against)) {
  //     return against.includes(this.commandActual(command));
  //   }
  //   return this.commandActual(command).toUpperCase() === against.toUpperCase();
  // }
}
