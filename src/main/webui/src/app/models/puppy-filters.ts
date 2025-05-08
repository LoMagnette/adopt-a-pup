export interface PuppyFilters {
  breed: string | null;
  minAge: number | null;
  maxAge: number | null;
  size: string | null;
  gender: string | null;
  activityLevel: string | null;
  goodWith: string[];
  onlyAvailable: boolean;
  searchTerm: string | null;
}
