import { LOOK } from "../const/verbs";
import { store } from "../store";

function parseCommand(sentence: string) {
  // Define verb particles for two-word verbs
  const verbParticles = [
    "up",
    "down",
    "off",
    "on",
    "out",
    "over",
    "back",
    "away",
    "around",
    "through",
    "in",
    "about",
  ];
  const particlesPattern = verbParticles.join("|");

  // Regex to match the verb possibly followed by a verb particle
  const verbParticlePattern = new RegExp(
    `^\\b(\\w+\\s+(?:${particlesPattern})\\b)`
  );
  const verbPattern = /^(\w+)/; // Match the first word as a verb if not a two-word verb

  // Extract the verb first to decide on direct object pattern
  let verb = null;
  let restOfSentence = sentence;
  const verbParticleMatch = sentence.match(verbParticlePattern);
  if (verbParticleMatch) {
    verb = verbParticleMatch[1]; // Captures two-word verb
    restOfSentence = sentence.substr(verb.length).trim(); // Remove verb to parse the rest
  } else {
    const verbMatch = sentence.match(verbPattern);
    if (verbMatch) {
      verb = verbMatch[1];
      restOfSentence = sentence.substr(verb.length).trim();
    }
  }

  // Define regex patterns for extracting the rest of the command
  const directObjectPattern = /^(\w+)(?:\s+(on|to|at|in|with|for))?/; // Direct object and optional preposition
  // const prepositionPattern = /\b(on|to|at|in|with|for)\b/; // Match common prepositions
  const indirectObjectPattern = /\b(on|to|at|in|with|for)\s+(\w+)/; // Match the word after a preposition

  // Extract the direct object
  const directObjectMatch = restOfSentence.match(directObjectPattern);
  let directObject = directObjectMatch ? directObjectMatch[1] : null;

  // Extract preposition
  const preposition =
    directObjectMatch && directObjectMatch[2] ? directObjectMatch[2] : null;

  // Extract indirect object if preposition exists
  let indirectObject = null;
  if (preposition) {
    const indirectObjectMatch = restOfSentence.match(indirectObjectPattern);
    if (indirectObjectMatch && indirectObjectMatch[2]) {
      indirectObject = indirectObjectMatch[2];
    }
  }

  // Special case for LOOK command
  if (verb === LOOK && !directObject) {
    directObject = store.getState().location.direction;
  }

  return {
    verb: verb || null,
    directObject: directObject || null,
    preposition: preposition || null,
    indirectObject: indirectObject || null,
  };
}

export { parseCommand };
