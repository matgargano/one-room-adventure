// TypeScript version of the text adventure parser
import { Actions } from "../const/actions";
import { BLINDFOLD, CHAIR, NAIL, ROPE } from "../const/items";
import { store } from "../store"; // Import your Redux store
import { carriageReturn } from "../features/log/logSlice";
import { set } from "../features/flag/flagSlice";
import { parseCommand } from "./parseCommand";
import { normalizeItem } from "../const/items";
import { normalizeVerb } from "../const/verbs";
import { drop, pickUp, updateCanOpen } from "../features/item/itemSlice";
import { FLOOR } from "../const/directions";
import { setDirection } from "../features/location/locationSlice";
import {
  DirectionType,
  DirectionTypeWithFloor,
  VALID_DIRECTIONS_WITH_FLOOR,
} from "../types/directionType";
import { INVENTORY } from "../const/windows";

type CommandResult = {
  message: string | string[];
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
  private indirectObject: string | undefined;

  // private preposition: string | undefined;
  private preflightCheckResult: preflightCheckResult | undefined;

  constructor() {
    this.verb = undefined;
    this.directObject = undefined;
    this.indirectObject = undefined;
    this.preflightCheckResult = undefined;
    // Bind all methods to the class instance
    this.handleLook = this.handleLook.bind(this);
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
    this.handlePickUp = this.handlePickUp.bind(this);
    this.handleInventory = this.handleInventory.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDump = this.handleDump.bind(this);

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
      pickup: this.handleGet,
      inventory: this.handleInventory,
      drop: this.handleDrop,
      dump: this.handleDrop,
    };
  }

  /**
   * Parses the command words and returns the entered command and its arguments
   * @param words - The words to parse
   * @returns The entered command and its arguments
   */
  private parseCommandWords(inputText: string) {
    const { verb, directObject, indirectObject } = parseCommand(inputText);

    if (verb) {
      this.verb = verb ? normalizeVerb(verb) : undefined;
      this.directObject = directObject
        ? normalizeItem(directObject)
        : undefined;
      // this.preposition = preposition ? normalizeItem(preposition) : undefined;
      this.indirectObject = indirectObject
        ? normalizeItem(indirectObject)
        : undefined;

      return true;
    }
    return false;
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
      if ([Actions.FEEL, Actions.RUB].includes(this.verb)) {
        return {
          canContinue: true,
        };
      }
      return {
        canContinue: false,
        result: {
          message:
            "Your hands are tied and you are blindfolded, you can't do that.",
        },
      };
    }

    if (blindfolded) {
      if ([Actions.REMOVE, Actions.FEEL, Actions.RUB].includes(this.verb)) {
        return {
          canContinue: true,
        };
      }
      return {
        canContinue: false,
        result: { message: "You can't do that, you're blindfolded." },
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
    //special case, inventory

    if (["inventory", "i"].includes(inputText.toLowerCase())) {
      return this.handleInventory();
    }

    const wordCount = inputText.split(" ").length;
    if (wordCount === 1) {
      return {
        message: "I need at least a verb and an object.",
      };
    }

    // Split the input text into words
    const parseCommandWordsResult = this.parseCommandWords(inputText);
    if (!parseCommandWordsResult) {
      return {
        message: "I don't understand what you want to do.",
      };
    }
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
    const { blindfolded, handsTied } = store.getState().flag;
    const feelNail = this.checkForMatch(Actions.FEEL, CHAIR);
    if (blindfolded && feelNail && feelNail.match === 1) {
      return {
        message: "You feel something sharp.",
      };
    }
    const feelRope = this.checkForMatch(Actions.FEEL, ROPE);
    const feelChair = this.checkForMatch(Actions.FEEL, CHAIR);
    const feelBlindfold = this.checkForMatch(Actions.FEEL, BLINDFOLD);
    if (blindfolded || handsTied) {
      if (
        [feelRope, feelChair, feelBlindfold].some((check) => check.match === 1)
      ) {
        store.dispatch(set({ what: "handsTied", value: false }));
        return {
          message: `You feel the ${this.directObject} it feels pretty normal.`,
        };
      } else {
        return {
          message: `You can't reach the ${this.directObject} even if it's there because you are blindfolded.`,
        };
      }
    }

    return { message: "You don't feel anything out of the ordinary." };
  }

  private handleDrop(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to drop?" };
    }
    if (!this.inInventory(this.directObject)) {
      return {
        message: `You don't have the ${this.directObject} in your inventory.`,
      };
    }
    store.dispatch(drop({ item: this.directObject }));
    return {
      message: `You drop the ${this.directObject}.`,
    };
  }

  private handleDump(): CommandResult {
    return this.handleDrop();
  }

  private handleGet(): CommandResult {
    return this.handleTake();
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
    if (
      VALID_DIRECTIONS_WITH_FLOOR.includes(this.directObject as DirectionType)
    ) {
      return this.handleLookAtDirection();
    }
    return this.handleLookAtItem();
  }

  // private hasAccessToItem(item: string): boolean {
  //   return this.canReach(item) || this.inInventory(item);
  // }

  private handleLookAtItem(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return {
        message: `What are you trying to look at?`,
      };
    }
    if (!this.itemExists(this.directObject)) {
      return {
        message: `I don't see any ${this.directObject} here.`,
      };
    }

    const { location } = store.getState();
    if (
      location.direction !== this.recursivelyGetItemLocation(this.directObject)
    ) {
      return {
        message: `You can't reach the ${this.directObject}.`,
      };
    }

    const description = this.getDescription(this.directObject || "")
      ? this.getDescription(this.directObject || "")
      : `It looks like your average everyday ${this.directObject}.`;
    return {
      message: `You look at the ${this.directObject}. ${description}`,
    };
  }

  private handleLookAtDirection(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return {
        message: `What are you trying to look at?`,
      };
    }
    const itemsInDirection = this.getItemsInLocation(
      this.directObject as DirectionTypeWithFloor
    );
    let directionPrefix = "at the";
    if (this.directObject.toLowerCase() !== FLOOR) {
      store.dispatch(setDirection(this.directObject as DirectionType));
      directionPrefix = "";
    }
    store.dispatch(carriageReturn());
    return {
      message: [
        `You look ${directionPrefix} ${this.directObject}. You see`,
        ...itemsInDirection.map((item) => `→ ${item}`),
      ],
    };
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
    if (!this.itemExists(this.directObject)) {
      return {
        message: `I don't see any ${this.directObject} here.`,
      };
    }
    if (!this.inInventory(this.directObject)) {
      return {
        message: `You don't have the ${this.directObject} try picking it up first. You may have to find it first!`,
      };
    }
    if (!this.canReach(this.directObject)) {
      return {
        message: `You can't reach the ${this.directObject}.`,
      };
    }
    if (!this.indirectObject || !this.indirectObject.length) {
      return {
        message: `You use the ${this.directObject}, but nothing seems to happen.`,
      };
    }
    if (this.canOpen(this.indirectObject)) {
      return {
        message: `You have already used the ${this.directObject} on the ${this.indirectObject}.`,
      };
    }
    const requiresToOpen = this.requiresToOpen(this.indirectObject);
    if (requiresToOpen && this.inInventory(requiresToOpen)) {
      const { inventory } = store.getState();

      store.dispatch(updateCanOpen({ item: this.indirectObject, value: true }));
      return {
        message: `${inventory?.items?.[this.indirectObject]?.canOpenResponse}`,
      };
    }

    return {
      message: `You use the ${this.directObject} on the ${this.indirectObject}.`,
    };
  }

  private requiresToOpen(item: string): string | undefined {
    const { inventory } = store.getState();

    return inventory?.items?.[item]?.requiresOpen;
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
    const { inventory } = store.getState();
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to take?" };
    }
    if (!this.itemExists(this.directObject)) {
      return {
        message: `I don't see any ${this.directObject} here.`,
      };
    }
    if (this.inInventory(this.directObject)) {
      return {
        message: `You already have the ${this.directObject} in your inventory.`,
      };
    }
    if (!this.canReach(this.directObject)) {
      return {
        message: `You can't reach the ${this.directObject}.`,
      };
    }
    if (!this.canPickUp(this.directObject)) {
      return {
        message: `You can't pick up the ${this.directObject}. ${
          inventory?.items[this.directObject].cannotPickUpReason
        }`,
      };
    }
    store.dispatch(pickUp({ item: this.directObject }));
    return {
      message: `You pick up the ${this.directObject}.`,
    };
  }

  private itemExists(item: string) {
    const { inventory } = store.getState();
    return inventory?.items[item];
  }

  private inInventory(item: string) {
    const { inventory } = store.getState();
    return inventory?.items[item].location === INVENTORY;
  }

  private canOpen(item: string) {
    const { inventory } = store.getState();
    return inventory?.items[item]?.canOpen;
  }

  private getDescription(item: string) {
    const { inventory } = store.getState();
    return inventory?.items[item]?.description || "";
  }

  private recursivelyGetItemLocation(
    item: string
  ): DirectionType | typeof FLOOR | typeof INVENTORY {
    const { inventory } = store.getState();
    const location = inventory?.items[item]?.location || "";
    if (
      [INVENTORY, ...VALID_DIRECTIONS_WITH_FLOOR].includes(
        location as DirectionType
      )
    ) {
      return location as DirectionType;
    }
    return this.recursivelyGetItemLocation(location);
  }

  private getItemsInLocation(location: DirectionType | typeof FLOOR) {
    const { inventory } = store.getState();
    return Object.entries(inventory.items)
      .filter(([, item]) => item.location === location)
      .map(([key]) => key);
  }

  // private isOpen(item: string) {
  //   const { inventory } = store.getState();
  //   return inventory?.items[item]?.isOpen;
  // }

  private canPickUp(item: string) {
    const { inventory } = store.getState();
    return inventory?.items[item].canPickUp;
  }

  private canReach(item: string): boolean {
    const { location } = store.getState();

    const itemLocation = this.recursivelyGetItemLocation(item);

    return (
      this.inInventory(item) ||
      itemLocation === location.direction ||
      itemLocation === FLOOR
    );
  }

  private handleOpen(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to open?" };
    }
    const { items } = store.getState().inventory;
    if (!items[this.directObject].canOpen) {
      return {
        message: `You can't open the ${this.directObject}. ${
          items[this.directObject].cannotOpenReason
            ? items[this.directObject].cannotOpenReason
            : ""
        }`,
      };
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
    if (!this.indirectObject || !this.indirectObject.length) {
      return { message: `Rub ${this.directObject} on what?` };
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
      message: `You rub the ${this.directObject} on ${this.indirectObject}. It doesn't seem very effective.`,
    };
  }

  private handlePickUp(): CommandResult {
    return this.handleTake();
  }

  private handleRemove(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to remove?" };
    }
    const { blindfolded } = store.getState().flag;
    if (blindfolded && ![BLINDFOLD].includes(this.directObject)) {
      return { message: "You can't do that, you're blindfolded!" };
    }
    if (blindfolded && [BLINDFOLD].includes(this.directObject)) {
      store.dispatch(set({ what: "blindfolded", value: false }));

      return { message: "You remove the blindfold, and can see!" };
    }

    return {
      message: `You remove the ${this.directObject}.`,
    };
  }

  private handleInventory(): CommandResult {
    const { inventory } = store.getState();
    store.dispatch(carriageReturn());
    const itemsInInventory = Object.entries(inventory.items)
      .filter(([, item]) => item.location === INVENTORY)
      .map(([key]) => key);
    return {
      message: [
        "You look in your inventory.",
        ...itemsInInventory.map((item) => `→ ${item}`),
      ],
    };
  }

  private checkForMatch(
    verbToMatch: string,
    directObjectToMatch: string,
    indirectObjectToMatch?: string | undefined
  ): { match: number } {
    indirectObjectToMatch = indirectObjectToMatch || undefined;
    if (
      verbToMatch === this.verb &&
      directObjectToMatch === this.directObject &&
      indirectObjectToMatch === this.indirectObject
    ) {
      return { match: 1 };
    }
    if (
      verbToMatch === this.verb &&
      directObjectToMatch === this.directObject &&
      indirectObjectToMatch !== this.indirectObject
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
