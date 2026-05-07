const PLATE_NUMBER_PATTERN = /^[A-Z]{3}-\d{3}-[A-Z]{2}$/;

export const normalizePlateNumber = (input: string): string => {
  const clean = (input ?? "").replace(/[^a-z0-9]/gi, "").toUpperCase();
  if (clean.length !== 8) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
};

export const isValidPlateNumber = (input: string): boolean =>
  PLATE_NUMBER_PATTERN.test(normalizePlateNumber(input));
