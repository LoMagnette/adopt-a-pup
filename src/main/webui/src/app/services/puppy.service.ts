import {inject, Injectable} from '@angular/core';
import {Puppy} from '../models/puppy';
import {Observable} from "rxjs";
import {HttpClient, httpResource} from "@angular/common/http";
import {PuppyFilters} from "../models/puppy-filters";


@Injectable({
  providedIn: 'root'
})
export class PuppyService {
  private puppies: Puppy[] = [
    {
      id: 1,
      name: "Max",
      breed: "Golden Retriever",
      age: 1,
      size: "Large",
      gender: "Male",
      activityLevel: "High",
      goodWith: ["Children", "Dogs", "Cats"],
      description: "Max is a playful and friendly golden retriever puppy who loves outdoor activities.",
      imageUrl: "assets/images/golden-retriever.jpg",
      available: true
    },
    {
      id: 2,
      name: "Luna",
      breed: "French Bulldog",
      age: 2,
      size: "Small",
      gender: "Female",
      activityLevel: "Medium",
      goodWith: ["Children", "Seniors"],
      description: "Luna is a gentle and affectionate French bulldog who enjoys cuddles and short walks.",
      imageUrl: "assets/images/french-bulldog.jpg",
      available: true
    },
    {
      id: 3,
      name: "Cooper",
      breed: "Labrador Retriever",
      age: 3,
      size: "Large",
      gender: "Male",
      activityLevel: "High",
      goodWith: ["Children", "Dogs"],
      description: "Cooper is an energetic and intelligent Labrador who loves water and fetch games.",
      imageUrl: "assets/images/labrador.jpg",
      available: false
    },
    {
      id: 4,
      name: "Bella",
      breed: "Beagle",
      age: 1,
      size: "Medium",
      gender: "Female",
      activityLevel: "High",
      goodWith: ["Dogs", "Cats"],
      description: "Bella is a curious and friendly beagle with a keen sense of smell and adventurous personality.",
      imageUrl: "assets/images/beagle.jpg",
      available: true
    },
    {
      id: 5,
      name: "Charlie",
      breed: "Poodle",
      age: 2,
      size: "Medium",
      gender: "Male",
      activityLevel: "Medium",
      goodWith: ["Children", "Seniors"],
      description: "Charlie is a smart and elegant poodle who is easy to train and very adaptable.",
      imageUrl: "assets/images/poodle.png",
      available: true
    },
    {
      id: 6,
      name: "Daisy",
      breed: "Shih Tzu",
      age: 4,
      size: "Small",
      gender: "Female",
      activityLevel: "Low",
      goodWith: ["Cats", "Seniors"],
      description: "Daisy is a sweet and calm Shih Tzu who prefers quiet environments and gentle petting.",
      imageUrl: "assets/images/shih-tzu.jpg",
      available: false
    }
  ];



  http = inject(HttpClient);


  constructor() {}

  getFilteredPuppies(filter:Partial<PuppyFilters>): Observable<Puppy[]> {
    return this.http.post<Puppy[]>(`/api/puppies/search`, filter)
  }

  getAllPuppies(){
    return httpResource<Puppy[]>(() => '/api/puppies', {defaultValue:[]});
  }

  getPuppyById(id: number){
    return this.http.get<Puppy>(`/api/puppies/${id}`);
  }

  getUniqueBreeds() {
    return httpResource<string[]>(() => '/api/puppies/breeds', {defaultValue:[]});
  }

  getSizes(): string[] {
    return ["Small", "Medium", "Large"];
  }

  getGenders(): string[] {
    return ["Male", "Female"];
  }

  getActivityLevels(): string[] {
    return ["Low", "Medium", "High"];
  }

  getGoodWithOptions() {
    return httpResource<string[]>(() => '/api/puppies/qualities', {defaultValue:[]});
  }

  getFeaturePuppies(count: number = 3) {
    return httpResource<Puppy[]>(() => '/api/puppies/featured?limit='+count, {defaultValue:[]});
  }
}
