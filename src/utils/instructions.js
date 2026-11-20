
const STEP_NUMBER_RE = /(?:^|\s+)(\d+)\.\s+/g;

// Split instructions into readable steps.
export const splitInstructions = (instructions = "") => {
  const text = instructions.trim();

  if (!text) return [];

  // 1. Preserve existing line breaks.
  const lines = text
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  // 2. Split numbered steps: 1. ..., 2. ..., 3. ...
  const matches = [...text.matchAll(STEP_NUMBER_RE)];

  if (matches.length > 1) {
    return matches
      .map((match, index) => {
        const start = match.index + match[0].length;
        const end =
          index + 1 < matches.length
            ? matches[index + 1].index
            : text.length;

        return `${match[1]}. ${text.slice(start, end).trim()}`;
      })
      .filter(Boolean);
  }

  // 3. Split unnumbered text into sentences.
  // avoid splitting decimal numbers and common abbreviations
  const sentences = text.match(
    /[^.!?]+(?:[.!?]+(?=\s|$)|$)/g,
  );

  return (sentences || [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};

const MINUTES_RE = /(\d+)\s*(?:-\s*\d+\s*)?(?:min(?:ute)?s?|mins?|хв(?:илин[аи]?)?)\b/i;

// Returns the first "N minutes" mentioned in a step, or null.
export const findStepMinutes = (step = "") => {
  const match = step.match(MINUTES_RE);
  const minutes = match ? Number(match[1]) : 0;
  return minutes > 0 && minutes <= 600 ? minutes : null;
};
