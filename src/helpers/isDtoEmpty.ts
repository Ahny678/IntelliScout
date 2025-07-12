export function isDtoEffectivelyEmpty(dto: Record<string, any>): boolean {
  return Object.values(dto).every(
    (val) => val === undefined || val === null || val === '',
  );
}
