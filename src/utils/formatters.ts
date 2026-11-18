const enPluralRules = new Intl.PluralRules('en-US');

/**
 * Formats a numeric count with its grammatically correct singular or plural noun
 * using `Intl.PluralRules` (e.g., `1 word`, `0 words`, `2 activities`).
 */
export function pluralizeNoun(
  count: number,
  singular: string,
  plural: string
): string {
  return enPluralRules.select(count) === 'one' ? singular : plural;
}

export function formatCount(
  count: number,
  singular: string,
  plural: string
): string {
  return `${count} ${pluralizeNoun(count, singular, plural)}`;
}
