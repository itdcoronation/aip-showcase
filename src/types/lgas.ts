export interface FetchLGAsResponse {
  success: boolean;
  message: string;
  data: {
    state_name: string;
    state_code: string;
    total_lgas: number;
    lgas: string[];
  };
  filters: {
    search: string | null;
  };
}
