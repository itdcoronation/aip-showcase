export interface State {
  id: number;
  name: string;
  code: string;
  geopolitical_zone: string;
  created_at: string;
  updated_at: string;
  category: string;
  capital: string;
  description: string;
  created: string;
  area_km2: number;
  slogan: string;
}

export interface FetchStatesResponse {
  success: boolean;
  message: string;
  data: State[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  filters: {
    search: string | null;
    geopolitical_zone: string | null;
    category: string;
  };
}
