export interface UserCredentials {
  username: string;
  password: string;
}

export interface GeneResult {
  chromosome: string;
  position: number;
  id: string;
  reference: string;
  alternate: string;
  quality: number;
  filter_status: string;
  info: string;
  format: string;
  outputs: Record<string, string>;
}

export interface GeneSearchResult {
  total_results: number;
  page: number;
  per_page: number;
  results: GeneResult[];
}

export interface UploadedFile {
  name: string;
  path: string;
}