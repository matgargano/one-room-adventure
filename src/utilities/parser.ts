// TypeScript version of the text adventure parser
import { Actions } from "../const/actions";
import { BLINDFOLD, CHAIR, CLOSED, ItemType, NAIL, ROPE } from "../const/items";
import { store } from "../store"; // Import your Redux store
import { carriageReturn } from "../features/log/logSlice";
import { set } from "../features/flag/flagSlice";
import { parseCommand } from "./parseCommand";
import { normalizeItem } from "../const/items";
import { normalizeVerb } from "../const/verbs";
import {
  drop,
  pickUp,
  updateCanOpen,
  updateIsOpen,
} from "../features/item/itemSlice";
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
    this.handleBreak = this.handleBreak.bind(this);

    // Define some common commands and their associated actions
    this.commands = {
      break: this.handleBreak,
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

    if (
      !this.isDirection(this.directObject) &&
      !this.itemExists(this.directObject)
    ) {
      return {
        canContinue: false,
        result: { message: `I don't see any ${this.directObject} here.` },
      };
    }
    if (
      this.indirectObject &&
      !this.isDirection(this.indirectObject) &&
      !this.itemExists(this.indirectObject)
    ) {
      return {
        canContinue: false,
        result: { message: `I don't see any ${this.indirectObject} here.` },
      };
    }

    return {
      canContinue: true,
    };
  }

  private isDirection(item: string): boolean {
    return VALID_DIRECTIONS_WITH_FLOOR.includes(item as DirectionType);
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
    if (inputText.trim().toLowerCase() === "look") {
      const { location } = store.getState();
      return this.parseCommand(`look ${location.direction}`);
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

    const { location: itemLocation } = this.recursivelyGetItemLocation(
      this.directObject as ItemType | DirectionType
    );
    if (
      location.direction !== itemLocation &&
      !this.inInventory(this.directObject)
    ) {
      return {
        message: `You can't reach the ${this.directObject}.`,
      };
    }

    const description = this.getDescription(this.directObject as ItemType);
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
    if (!this.canReach(this.directObject as ItemType | DirectionType)) {
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
        message: `${
          inventory?.items?.[this.indirectObject as ItemType]?.canOpenResponse
        }`,
      };
    }

    return {
      message: `You use the ${this.directObject} on the ${this.indirectObject}.`,
    };
  }

  private requiresToOpen(item: string): string | undefined {
    const { inventory } = store.getState();

    return inventory?.items?.[item as ItemType]?.requiresOpen;
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
    if (!this.canReach(this.directObject as ItemType | DirectionType)) {
      return {
        message: `You can't reach the ${this.directObject}.`,
      };
    }
    if (!this.canPickUp(this.directObject)) {
      return {
        message: `You can't pick up the ${this.directObject}. ${
          inventory?.items[this.directObject as ItemType].cannotPickUpReason
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
    return inventory?.items[item as ItemType];
  }

  private inInventory(item: string) {
    const { inventory } = store.getState();
    return inventory?.items[item as ItemType].location === INVENTORY;
  }

  private canOpen(item: string) {
    const { inventory } = store.getState();
    return inventory?.items[item as ItemType]?.canOpen;
  }

  private getDescription(item: ItemType): string {
    let output = "";

    const { inventory } = store.getState();
    const description = inventory?.items[item as ItemType]?.description;
    if (Array.isArray(description)) {
      description.forEach((desc) => {
        if (Array.isArray(desc?.is)) {
          if (desc.is.includes(CLOSED) && !inventory?.items[item].isOpen) {
            output += desc.description;
          }
        }
        if (
          output.length === 0 &&
          desc.has?.every((has) =>
            this.locationHasItem(
              item as ItemType | DirectionTypeWithFloor,
              has as ItemType | DirectionTypeWithFloor
            )
          )
        ) {
          output += desc.description;
        }
      });
      return output;
    }
    if (output.length) {
      return output;
    }
    if (typeof description === "string") {
      return description;
    }
    return `It looks like your average everyday ${item}.`;
  }

  private locationHasItem(
    location: DirectionType | typeof FLOOR | ItemType,
    item: string
  ) {
    const itemsInLocation = this.getItemsInLocation(location);
    return itemsInLocation.includes(item);
  }

  private recursivelyGetItemLocation(
    item: ItemType | DirectionType,
    isOpen?: boolean
  ): {
    location: DirectionType | typeof FLOOR | typeof INVENTORY;
    isOpen: boolean | undefined;
  } {
    const { inventory } = store.getState();
    const location = inventory?.items[item as ItemType]?.location || "";

    if (typeof inventory?.items[item as ItemType]?.isOpen === "boolean") {
      isOpen =
        isOpen === undefined
          ? inventory.items[item as ItemType].isOpen
          : isOpen && inventory.items[item as ItemType].isOpen;
    }

    if (
      [INVENTORY, ...VALID_DIRECTIONS_WITH_FLOOR].includes(
        location as DirectionType
      )
    ) {
      return { location: location as DirectionType, isOpen };
    }

    return this.recursivelyGetItemLocation(
      location as ItemType | DirectionType,
      isOpen
    );
  }

  private getItemsInLocation(
    location: DirectionType | typeof FLOOR | ItemType
  ) {
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
    const { isOpen } = this.recursivelyGetItemLocation(item as ItemType);
    return isOpen;
  }

  private canReach(item: ItemType | DirectionType): boolean {
    const { location } = store.getState();

    const { location: itemLocation, isOpen: openValue } =
      this.recursivelyGetItemLocation(item as ItemType | DirectionType);
    const canPickUp = this.canPickUp(item as ItemType | DirectionType);
    const isOpen =
      (typeof openValue === "boolean" && openValue === true) ||
      undefined === openValue;
    return (
      (canPickUp || isOpen) &&
      (this.inInventory(item as ItemType | DirectionType) ||
        itemLocation === location.direction ||
        itemLocation === FLOOR)
    );
  }

  private handleOpen(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to open?" };
    }
    const { items } = store.getState().inventory;

    if (items[this.directObject as ItemType].isOpen) {
      return {
        message: `The ${this.directObject} is already open.`,
      };
    }

    if (!items[this.directObject as ItemType].canOpen) {
      return {
        message: `You can't open the ${this.directObject}. ${
          items[this.directObject as ItemType].cannotOpenReason
            ? items[this.directObject as ItemType].cannotOpenReason
            : ""
        }`,
      };
    }
    store.dispatch(updateIsOpen({ item: this.directObject, value: true }));

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

  private indirectRequired(
    verb: string,
    preposition?: string
  ): {
    canContinue: boolean;
    message?: string;
  } {
    if (!this.directObject) {
      return {
        canContinue: false,
        message: `${verb}${preposition ? ` ${preposition} ` : " on "} what?`,
      };
    }
    if (!this.indirectObject || !this.indirectObject.length) {
      return {
        canContinue: false,
        message: `${verb}${preposition ? ` ${preposition} ` : " on "} what?`,
      };
    }
    return { canContinue: true };
  }

  private handleRub(): CommandResult {
    if (!this.directObject || !this.directObject.length) {
      return { message: "What are you trying to rub?" };
    }

    const { canContinue, message } = this.indirectRequired("rub");
    if (!canContinue) {
      return { message: message || "On what?" };
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

  private handleBreak(): CommandResult {
    const { canContinue, message } = this.indirectRequired("break", "with");
    if (!canContinue) {
      return { message: message || "On what?" };
    }

    if (!this.indirectObject || !this.indirectObject.length) {
      return {
        message: `You can't break the ${this.directObject} with the ${this.indirectObject}.`,
      };
    }

    if (!this.canReach(this.directObject as ItemType | DirectionType)) {
      return { message: `You can't reach the ${this.directObject}.` };
    }

    const { inventory } = store.getState();
    if (
      typeof this.indirectObject === "string" &&
      inventory.items[this.directObject as ItemType]?.canBreak?.every(
        (item) => {
          const normalizedItem = normalizeItem(item as unknown as string);
          return this.inInventory(normalizedItem);
        }
      )
    ) {
      return {
        message: `You break the ${this.directObject} with the ${this.indirectObject}.`,
      };
    } else {
      return {
        message: `You can't break the ${this.directObject} with the ${this.indirectObject}.`,
      };
    }
    return { message: `You break the ${this.directObject}.` };
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
