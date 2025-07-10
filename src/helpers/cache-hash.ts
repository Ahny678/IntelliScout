import * as crypto from 'crypto';

export function createCacheKey(
  resumeId: string,
  query: Record<string, any>,
): string {
  // Step 1: Sort and serialize the query
  const sortedQuery = Object.entries(query)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, any>,
    );

  const queryString = JSON.stringify(sortedQuery);

  // Step 2: Create a SHA-256 hash
  const hash = crypto.createHash('sha256').update(queryString).digest('hex');

  // Step 3: Return the final cache key
  return `jobs:${resumeId}:${hash}`;
}
