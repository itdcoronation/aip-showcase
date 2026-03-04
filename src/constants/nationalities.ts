import nationalities from "./nationalities.json";

export const nationalityOptions = nationalities.map((nation) => ({
  label: nation,
  value: nation,
}));
