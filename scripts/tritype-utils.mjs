export const HEAD_TYPES = ["5", "6", "7"];
export const HEART_TYPES = ["2", "3", "4"];
export const GUT_TYPES = ["8", "9", "1"];
export const CENTERS = ["head", "heart", "gut"];

const HEAD_SET = new Set(HEAD_TYPES);
const HEART_SET = new Set(HEART_TYPES);
const GUT_SET = new Set(GUT_TYPES);

export const ARCHETYPES = {
  "125": "The Mentor",
  "126": "The Supporter",
  "127": "The Teacher",
  "135": "The Technical Expert",
  "136": "The Taskmaster",
  "137": "The Systems Builder",
  "145": "The Researcher",
  "146": "The Philosopher",
  "147": "The Visionary",
  "258": "The Strategist",
  "259": "The Problem Solver",
  "268": "The Rescuer",
  "269": "The Good Samaritan",
  "278": "The Free Spirit",
  "279": "The Peacemaker",
  "358": "The Solution Master",
  "359": "The Thinker",
  "368": "The Justice Fighter",
  "369": "The Mediator",
  "378": "The Mover Shaker",
  "379": "The Ambassador",
  "458": "The Scholar",
  "459": "The Contemplative",
  "468": "The Truth-Teller",
  "469": "The Seeker",
  "478": "The Messenger",
  "479": "The Gentle Spirit",
};

function digitToCenter(digit) {
  if (HEAD_SET.has(digit)) return "head";
  if (HEART_SET.has(digit)) return "heart";
  if (GUT_SET.has(digit)) return "gut";
  return null;
}

export function leadDigit(tritype) {
  return tritype[tritype.lead];
}

export function formatTritype(tritype) {
  const lead = leadDigit(tritype);
  const others = CENTERS.filter((center) => center !== tritype.lead)
    .map((center) => tritype[center])
    .sort();
  return [lead, ...others].join("");
}

export function parseTritypeCode(code) {
  if (!/^[1-9]{3}$/.test(code)) return null;

  const digits = code.split("");
  const centers = digits.map(digitToCenter);
  if (centers.some((center) => center === null)) return null;

  const counts = { head: 0, heart: 0, gut: 0 };
  for (const center of centers) counts[center] += 1;
  if (counts.head !== 1 || counts.heart !== 1 || counts.gut !== 1) return null;

  const tritype = { head: null, heart: null, gut: null, lead: centers[0] };
  for (let i = 0; i < digits.length; i += 1) {
    tritype[centers[i]] = digits[i];
  }

  return formatTritype(tritype) === code ? tritype : null;
}

export function pairKey(aCode, bCode) {
  const a = parseTritypeCode(aCode);
  const b = parseTritypeCode(bCode);
  if (!a || !b) return null;
  return [formatTritype(a), formatTritype(b)].sort().join("-");
}

export function archetypeKey(code) {
  const tritype = parseTritypeCode(code);
  if (!tritype) return null;
  return [tritype.head, tritype.heart, tritype.gut]
    .map(Number)
    .sort((a, b) => a - b)
    .join("");
}

export function archetypeName(code) {
  const key = archetypeKey(code);
  return key ? ARCHETYPES[key] ?? "Unknown archetype" : null;
}
