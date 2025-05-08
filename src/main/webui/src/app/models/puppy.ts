export interface Puppy {
  id: number;
  name: string;
  breed: string;
  age: number;
  size: 'Small' | 'Medium' | 'Large';
  gender: 'Male' | 'Female';
  activityLevel: 'Low' | 'Medium' | 'High';
  goodWith: string[]; // e.g. 'Kids', 'Dogs', 'Cats'
  description: string;
  imageUrl: string;
  available: boolean;
}
