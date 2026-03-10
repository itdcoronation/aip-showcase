const FIXED_INCOME_NAME_BY_ID: Record<string, string> = {
  "1": "Dangote Cement Plc Commercial Paper Series 10",
  "2": "FGN Savings Bond Mar 2027",
  "3": "182-Day Nigerian Treasury Bill",
  "5": "MTN Nigeria Commercial Paper Series 7",
  "6": "FGN Sovereign Sukuk 2031",
  "7": "Access Holdings Bond 2028",
  "8": "Flour Mills CP Series 4",
  "9": "364-Day Nigerian Treasury Bill",
  "123": "Federal Government Treasury Bill 2025",
};

export const resolveShowcaseFixedIncomeName = (id?: string | null) => {
  if (!id) return "Fixed Income Fund";

  return FIXED_INCOME_NAME_BY_ID[id] || `Fixed Income Fund ${id}`;
};

export const resolveShowcaseStockName = (id?: string | null) => {
  if (!id) return "STOCK";

  return id.toUpperCase();
};
