import {inject, Injectable, signal} from '@angular/core';
import {Puppy} from '../models/puppy';
import {Observable} from "rxjs";
import {HttpClient, httpResource} from "@angular/common/http";
import {PuppyFilters} from "../models/puppy-filters";
import {toSignal} from "@angular/core/rxjs-interop";


@Injectable({
  providedIn: 'root'
})
export class PuppyService {

  http = inject(HttpClient);

  filter = signal<Partial<PuppyFilters>>({onlyAvailable:true});
  goodWith = toSignal(this.http.get<string[]>('/api/puppies/qualities'));



  constructor() {}

  getFilteredPuppies(): Observable<Puppy[]> {
    return this.http.post<Puppy[]>(`/api/puppies/search`, this.filter())
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
    return ["SMALL", "MEDIUM", "LARGE"];
  }

  getGenders(): string[] {
    return ["MALE", "FEMALE"];
  }

  getActivityLevels(): string[] {
    return ["LOW", "MEDIUM", "HIGH"];
  }

  getGoodWithOptions() {
    return httpResource<string[]>(() => '/api/puppies/qualities', {defaultValue:[]});
  }

  getFeaturePuppies(count: number = 3) {
    return httpResource<Puppy[]>(() => '/api/puppies/featured?limit='+count, {defaultValue:[]});
  }

  reset() {
    this.filter.set({});
  }
}
