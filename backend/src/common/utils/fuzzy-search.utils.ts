import * as levenshtein from 'fast-levenshtein';

export interface FuzzySearchResult<T> {
  item: T;
  score: number;
}

export function fuzzySearch<T>(
  query: string,
  items: T[],
  getField: (item: T) => string,
  maxDistance: number = 3
): FuzzySearchResult<T>[] {
  const queryLower = query.toLowerCase();

  return items
    .map(item => {
      const fieldValue = getField(item). toLowerCase();
      const distance = levenshtein.get(queryLower, fieldValue);

      const containsMatch = fieldValue.includes(queryLower);

      return {
        item,
        score: containsMatch ? 0 : distance,
      };
    })
    .filter(result => result.score <= maxDistance)
    .sort((a, b) => a.score - b. score);
}