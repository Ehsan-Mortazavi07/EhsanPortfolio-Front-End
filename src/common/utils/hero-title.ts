/** Split CMS hero title into mockup-style uppercase lines. */
export function heroTitleLines(title: string): string[] {
  const trimmed = title.trim();
  if (!trimmed) return [];

  const byPunctuation = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (byPunctuation.length > 1) {
    return byPunctuation.map((chunk) => chunk.toUpperCase());
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 2) return [trimmed.toUpperCase()];

  const mid = Math.ceil(words.length / 2);
  return [
    `${words.slice(0, mid).join(" ").toUpperCase()}.`,
    `${words.slice(mid).join(" ").toUpperCase()}.`,
  ];
}
