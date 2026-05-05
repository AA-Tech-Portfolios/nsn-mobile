const blockedNameFragments = [
  "admin",
  "moderator",
  "softhello",
  "north shore nights",
  "support",
  "fuck",
  "shit",
  "bitch",
  "cunt",
];

export const nameNotAllowedMessage = "Sorry, this name is not allowed, please choose another name 😅";

export function isAllowedDisplayName(value: string) {
  const name = value.trim();
  const lowered = name.toLowerCase();
  const letters = name.match(/\p{L}/gu) ?? [];

  if (name.length < 2 || name.length > 32) return false;
  if (letters.length < 2) return false;
  if (/https?:|www\.|@/.test(lowered)) return false;
  if (/[^\p{L}\p{M}\p{N} .'-]/u.test(name)) return false;
  if (/\d{3,}/.test(name)) return false;
  if (/(.)\1{4,}/u.test(name)) return false;
  if (blockedNameFragments.some((fragment) => lowered.includes(fragment))) return false;

  const compact = lowered.replace(/[\s.'-]/g, "");
  if (/^(asdf|qwer|zxcv|test|name|user|abc|aaa)+\d*$/i.test(compact)) return false;

  return true;
}
