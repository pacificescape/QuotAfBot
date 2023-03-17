export function getRandomEmoji (): string {
  // Valid emoji range
  const min = 0x1_F6_00; // grinning face
  const max = 0x1_F6_4F; // folded hands

  // Generate a random code point within the range
  const codePoint = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert the code point to an emoji and return it
  return String.fromCodePoint(codePoint);
}
