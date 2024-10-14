// TypeScript version of the text adventure parser
import { Actions } from "../const/actions";
import { Items } from "../const/items";
import { MAIN } from "../const/locations";
import { State } from "../types/state";
type CommandResult = {
  message: string;
  action?: {
    verb: string;
    item?: string;
  };
};
interface CommandHandler {
  (args: string[], state: State): CommandResult;
}

export default class TextAdventureParser {
  private commands: { [key: string]: CommandHandler };

  constructor() {
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
      attack: this.handleAttack,
    };
  }

  public parseCommand(inputText: string, state: State): CommandResult {
    // Split the input text into words
    const words = inputText.toLowerCase().trim().split(" ");

    if (!words.length) {
      return { message: "I don't understand what you want to do." };
    }

    // Extract the command (first word) and arguments (rest of the words)
    const command = words[0];
    const args = words.slice(1);

    // Find and execute the associated command handler
    if (this.commands[command]) {
      return this.commands[command](args, state);
    } else {
      return { message: `I don't know how to '${command}'.` };
    }
  }

  private handleFeel(args: string[], state: State): CommandResult {
    if (!args.length) {
      return { message: "What would you like to feel?" };
    }

    const { location, inventory } = state;
    if (location?.room === MAIN && !inventory?.items.includes(Items.NAIL)) {
      return {
        message: `You feel the ${args.join(
          " "
        )}, and your fingers brush against something metallic.`,
      };
    } else {
      return { message: "You don't feel anything out of the ordinary." };
    }
  }

  private handleGet(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You pick up the ${args.join(" ")}.`,
        action: { verb: Actions.GET, item: args.join(" ") },
      };
    } else {
      return { message: "What are you trying to get?" };
    }
  }

  private handleTouch(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You touch the ${args.join(" ")}, feeling its texture.`,
      };
    } else {
      return { message: "What do you want to touch?" };
    }
  }

  private handleLook(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You look at the ${args.join(" ")}, observing it closely.`,
      };
    } else {
      return {
        message: "You look around, taking in your surroundings.",
      };
    }
  }

  private handleGo(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You go ${args.join(" ")}.`,
      };
    } else {
      return { message: "Where do you want to go?" };
    }
  }

  private handleUse(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You use the ${args.join(" ")}, but nothing seems to happen.`,
      };
    } else {
      return { message: "What do you want to use?" };
    }
  }

  private handleTalk(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You talk to the ${args.join(" ")}, but there's no response.`,
      };
    } else {
      return { message: "Who do you want to talk to?" };
    }
  }

  private handleTake(args: string[], state: State): CommandResult {
    const { location, inventory } = state;
    if (!args.length) {
      return { message: "What are you trying to take?" };
    }
    if (location?.room === MAIN) {
      if (!inventory?.items.includes(Items.NAIL)) {
        return {
          message: `You pick up the ${args.join(" ")}.`,
          action: { verb: Actions.TAKE, item: Items.NAIL },
        };
      } else {
        return {
          message: `You already have the ${args.join(" ")}.`,
        };
      }
    }
    return { message: `I don't see any ${args.join(" ")} here.` };
  }

  private handleOpen(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You open the ${args.join(" ")}.`,
      };
    } else {
      return { message: "What do you want to open?" };
    }
  }

  private handleClose(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You close the ${args.join(" ")}.`,
      };
    } else {
      return { message: "What do you want to close?" };
    }
  }

  private handleAttack(args: string[], state: State): CommandResult {
    if (args.length) {
      return {
        message: `You attack the ${args.join(
          " "
        )}. It doesn't seem very effective.`,
      };
    } else {
      return { message: "What do you want to attack?" };
    }
  }
}
