export interface Address {
  street: string | null;
  post_code: string | null;
  city: string | null;
}

export interface Company {
  business_id: string;
  name: string;
  company_form: string | null;
  registration_date: string | null;
  status: string | null;
  address: Address | null;
  website: string | null;
  phone: string | null;
}

export interface SearchResponse {
  results: Company[];
  total_results: number;
  page: number;
}

export interface SearchParams {
  name?: string;
  businessId?: string;
  page?: number;
  limit?: number;
}
