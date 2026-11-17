export const splitInstructions = (instructions = "") =>
  instructions
    .split(/\n+/)
    .map((step) => step.trim())
    .filter(Boolean);

const MINUTES_RE = /(\d+)\s*(?:-\s*\d+\s*)?(?:min(?:ute)?s?|mins?|хв(?:илин[аи]?)?)\b/i;

// Returns the first "N minutes" mentioned in a step, or null.
export const findStepMinutes = (step = "") => {
  const match = step.match(MINUTES_RE);
  const minutes = match ? Number(match[1]) : 0;
  return minutes > 0 && minutes <= 600 ? minutes : null;
};
