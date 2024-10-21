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

  // Define prepositions
  const prepositions = ["on", "to", "at", "in", "with", "for"];
  const prepositionPattern = new RegExp(
    `\\b(${prepositions.join("|")})\\b`,
    "i"
  );

  let directObject = null;
  let preposition = null;
  let indirectObject = null;

  const prepositionMatch = restOfSentence.match(prepositionPattern);
  if (prepositionMatch) {
    preposition = prepositionMatch[1];
    const prepositionIndex = restOfSentence.indexOf(preposition);
    directObject = restOfSentence.substring(0, prepositionIndex).trim() || null;
    indirectObject =
      restOfSentence.substring(prepositionIndex + preposition.length).trim() ||
      null;
  } else {
    directObject = restOfSentence.trim() || null;
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
