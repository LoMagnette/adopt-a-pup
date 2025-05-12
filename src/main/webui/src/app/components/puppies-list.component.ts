import {Component, inject, signal, effect, linkedSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PuppyService } from '../services/puppy.service';
import { FormsModule } from '@angular/forms';
import {toSignal} from "@angular/core/rxjs-interop";
import {Puppy} from "../models/puppy";
import {PuppyFilters} from "../models/puppy-filters";

@Component({
  selector: 'app-puppies-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="puppies-container">
      <h1>Find Your Perfect Puppy</h1>
      <p class="subtitle">Use our filters to find the right furry companion for your lifestyle</p>

      <div class="content-wrapper">
        <!-- Left side filters -->
        <div class="filter-sidebar">
          <div class="filter-header">
            <h2>Puppy Finder</h2>
            <button class="reset-button" (click)="resetFilters()">Reset Filters</button>
          </div>

          <div class="search-bar">
            <input
              type="text"
              placeholder="Search by name or breed..."
              [ngModel]="searchTerm()"
              (input)="updateSearchTerm($event)"
            >
          </div>

          <div class="filter-group">
            <h3>Breed</h3>
            <select [ngModel]="selectedBreed()" (change)="updateBreed($event)">
              <option [ngValue]="null">Any Breed</option>
              @for (breed of uniqueBreeds(); track breed) {
                <option [value]="breed">{{ breed }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <h3>Age</h3>
            <div class="age-inputs">
              <div class="age-input">
                <label for="min-age">Min</label>
                <select id="min-age" [ngModel]="minAge()" (change)="updateMinAge($event)">
                  <option [ngValue]="null">Any</option>
                  @for (age of ageOptions; track age) {
                    <option [value]="age">{{ age }}</option>
                  }
                </select>
              </div>
              <div class="age-input">
                <label for="max-age">Max</label>
                <select id="max-age" [ngModel]="maxAge()" (change)="updateMaxAge($event)">
                  <option [ngValue]="null">Any</option>
                  @for (age of ageOptions; track age) {
                    <option [value]="age">{{ age }}</option>
                  }
                </select>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <h3>Size</h3>
            <select [ngModel]="selectedSize()" (change)="updateSize($event)">
              <option [ngValue]="null">Any Size</option>
              @for (size of sizeOptions(); track size) {
                <option [value]="size">{{ size }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <h3>Gender</h3>
            <select [ngModel]="selectedGender()" (change)="updateGender($event)">
              <option [ngValue]="null">Any Gender</option>
              @for (gender of genderOptions(); track gender) {
                <option [value]="gender">{{ gender }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <h3>Activity Level</h3>
            <select [ngModel]="selectedActivityLevel()" (change)="updateActivityLevel($event)">
              <option [ngValue]="null">Any Activity Level</option>
              @for (level of activityLevelOptions(); track level) {
                <option [value]="level">{{ level }}</option>
              }
            </select>
          </div>

          <div class="filter-group goodwith-filter">
            <h3>Good With</h3>
            <div class="goodwith-options">
              @for (category of goodWithOptions(); track category) {
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    [value]="category"
                    [checked]="isGoodWithSelected(category)"
                    (change)="toggleGoodWith(category)"
                  > {{ category }}
                </label>
              }
            </div>
          </div>

          <div class="filter-group">
            <h3>Availability</h3>
            <label class="checkbox-label">
              <input
                type="checkbox"
                [checked]="onlyAvailable()"
                (change)="toggleAvailability()"
              > Show only available puppies
            </label>
          </div>
        </div>

        <!-- Right side content -->
        <div class="main-content">
          <div class="results-summary">
            <h3>{{ filteredPuppies().length }} {{ filteredPuppies().length === 1 ? 'puppy' : 'puppies' }} found</h3>
          </div>

          <div class="puppy-grid">
            @for (puppy of filteredPuppies(); track puppy.id) {
              <div class="puppy-card" [class.not-available]="!puppy.available">
                @if (!puppy.available) {
                  <div class="adopted-banner">Adopted</div>
                }
                <div class="puppy-image" [style.background-image]="'url(' + puppy.imageUrl + ')'"></div>
                <div class="puppy-info">
                  <h3>{{ puppy.name }}</h3>
                  <div class="puppy-badges">
                    <span class="puppy-badge breed">{{ puppy.breed }}</span>
                    <span class="puppy-badge age">{{ puppy.age }} {{ puppy.age === 1 ? 'month' : 'months' }}</span>
                    <span class="puppy-badge size">{{ puppy.size }}</span>
                    <span class="puppy-badge gender">{{ puppy.gender }}</span>
                  </div>
                  <p class="activity-level">
                    <strong>Activity Level:</strong> {{ puppy.activityLevel }}
                  </p>
                  <p class="good-with">
                    <strong>Good With:</strong> {{ puppy.goodWith.join(', ') }}
                  </p>
                  <p class="description">{{ puppy.description }}</p>
                  <a [routerLink]="['/puppies', puppy.id]" class="btn primary">Meet {{ puppy.name }}</a>
                </div>
              </div>
            }
            @empty {
              <div class="no-puppies">
                <h3>No puppies match your criteria</h3>
                <p>Try adjusting your filters to see more puppies</p>
                <button class="btn primary" (click)="resetFilters()">Reset All Filters</button>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .puppies-container {
      padding: 3rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .subtitle {
      text-align: center;
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .content-wrapper {
      display: flex;
      gap: 2rem;
    }

    .filter-sidebar {
      flex: 0 0 300px;
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 20px;
      align-self: flex-start;
    }

    .main-content {
      flex: 1;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .filter-header h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
    }

    .reset-button {
      background-color: transparent;
      border: 1px solid #ff6b6b;
      color: #ff6b6b;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .reset-button:hover {
      background-color: #ff6b6b;
      color: white;
    }

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .search-bar input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 30px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .search-bar input:focus {
      outline: none;
      border-color: #ff6b6b;
    }

    .filter-group {
      margin-bottom: 1.5rem;
    }

    .filter-group h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: #444;
    }

    .filter-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #444;
      background-color: white;
      cursor: pointer;
    }

    .filter-group select:focus {
      outline: none;
      border-color: #ff6b6b;
    }

    .age-inputs {
      display: flex;
      gap: 1rem;
    }

    .age-input {
      flex: 1;
    }

    .age-input label {
      display: block;
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
      color: #666;
    }

    .goodwith-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #444;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }

    .checkbox-label input {
      margin-right: 0.5rem;
    }

    .results-summary {
      margin-bottom: 2rem;
    }

    .results-summary h3 {
      font-size: 1.3rem;
      color: #444;
    }

    .puppy-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .puppy-card {
      position: relative;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      background-color: white;
    }

    .puppy-card:hover {
      transform: translateY(-10px);
    }

    .puppy-card.not-available {
      opacity: 0.8;
    }

    .adopted-banner {
      position: absolute;
      top: 20px;
      right: -30px;
      background-color: #ff6b6b;
      color: white;
      padding: 0.5rem 2rem;
      transform: rotate(45deg);
      z-index: 10;
      font-weight: bold;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .puppy-image {
      height: 300px;
      background-size: cover;
      background-position: center;
    }

    .puppy-info {
      padding: 1.5rem;
    }

    .puppy-info h3 {
      margin-bottom: 0.8rem;
      color: #333;
    }

    .puppy-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .puppy-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .puppy-badge.breed {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .puppy-badge.age {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .puppy-badge.size {
      background-color: #fff3e0;
      color: #e65100;
    }

    .puppy-badge.gender {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .activity-level, .good-with {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #555;
    }

    .description {
      margin-bottom: 1.5rem;
      color: #444;
      line-height: 1.5;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 30px;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .btn.primary {
      background-color: #ff6b6b;
      color: white;
    }

    .btn.primary:hover {
      background-color: #ff5252;
      transform: translateY(-3px);
    }

    .no-puppies {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }

    .no-puppies h3 {
      margin-bottom: 1rem;
      color: #444;
    }

    .no-puppies p {
      margin-bottom: 1.5rem;
      color: #666;
    }

    @media (max-width: 992px) {
      .content-wrapper {
        flex-direction: column;
      }

      .filter-sidebar {
        flex: 1;
        width: 100%;
        position: relative;
        top: 0;
      }
    }

    @media (max-width: 768px) {
      .puppies-container {
        padding: 2rem 1rem;
      }

      h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class PuppiesListComponent {
  private puppyService = inject(PuppyService);

  // Signals for reactive state management
  puppies = toSignal(this.puppyService.getFilteredPuppies(), {initialValue:[]});
  filteredPuppies = signal<Puppy[]>([...this.puppies()]);
  filters = this.puppyService.filter.asReadonly();

  // Filter signals
  searchTerm = linkedSignal<string | null>(() => this.filters().searchTerm || null);
  selectedBreed = linkedSignal<string | null>(() => this.filters().breed|| null);
  minAge = linkedSignal<number | null>(() => this.filters().minAge|| null);
  maxAge = linkedSignal<number | null >(() => this.filters().maxAge|| null);
  selectedSize = linkedSignal<string | null >(() => this.filters().size|| null);
  selectedGender = linkedSignal<string | null >(() => this.filters().gender|| null);
  selectedActivityLevel = linkedSignal<string | null >(() => this.filters().activityLevel || null);
  selectedGoodWith = linkedSignal<string[]>(() => this.filters().goodWith || []);
  onlyAvailable = linkedSignal<boolean>(() => !!this.filters().onlyAvailable);

  // Options for filters
  uniqueBreeds = this.puppyService.getUniqueBreeds().value;
  ageOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,17, 18];
  sizeOptions = signal(this.puppyService.getSizes());
  genderOptions = signal(this.puppyService.getGenders());
  activityLevelOptions = signal(this.puppyService.getActivityLevels());
  goodWithOptions = this.puppyService.getGoodWithOptions().value;

  constructor() {
    // Set up effect to update filtered puppies whenever any filter changes
    effect(() => {
      this.applyFilters();
    });
    effect(() => {
      const filter = this.filters()
      if(filter.searchTerm) {
        this.searchTerm.set(filter.searchTerm);
      }
      if(filter.breed) {
        this.selectedBreed.set(filter.breed);
      }
      if(filter.minAge) {
        this.minAge.set(filter.minAge);
      }
      if(filter.maxAge) {
        this.maxAge.set(filter.maxAge);
      }
      if(filter.size) {
        this.selectedSize.set(filter.size);
      }
      if(filter.gender) {
        this.selectedGender.set(filter.gender);
      }
      if(filter.activityLevel) {
        this.selectedActivityLevel.set(filter.activityLevel);
      }
      if(filter.goodWith) {
        this.selectedGoodWith.set(filter.goodWith);
      }
      if(filter.onlyAvailable) {
        this.onlyAvailable.set(filter.onlyAvailable);
      }
    })
  }

  // Event handlers for filter updates
  updateSearchTerm(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value ? target.value : null);
  }

  updateBreed(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedBreed.set(target.value === "0: null" ? null : target.value);
  }

  updateMinAge(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.minAge.set(target.value === "0: null" ? null : parseInt(target.value, 10));
  }

  updateMaxAge(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.maxAge.set(target.value === "0: null" ? null : parseInt(target.value, 10));
  }

  updateSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedSize.set(target.value === "0: null" ? null : target.value);
  }

  updateGender(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedGender.set(target.value === "0: null" ? null : target.value);
  }

  updateActivityLevel(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedActivityLevel.set(target.value === "0: null" ? null : target.value);
  }

  toggleGoodWith(category: string) {
    const currentGoodWith = this.selectedGoodWith();
    const index = currentGoodWith.indexOf(category);

    if (index > -1) {
      // Remove category if already selected
      this.selectedGoodWith.update(goodWith => goodWith.filter(item => item !== category));
    } else {
      // Add category if not selected
      this.selectedGoodWith.update(goodWith => [...goodWith, category]);
    }
  }

  isGoodWithSelected(category: string): boolean {
    return this.selectedGoodWith().includes(category);
  }

  toggleAvailability() {
    this.onlyAvailable.update(current => !current);
  }

  resetFilters() {
    // Reset all filter signals to initial values
    this.searchTerm.set(null);
    this.selectedBreed.set(null);
    this.minAge.set(null);
    this.maxAge.set(null);
    this.selectedSize.set(null);
    this.selectedGender.set(null);
    this.selectedActivityLevel.set(null);
    this.selectedGoodWith.set([]);
    this.onlyAvailable.set(false);

    // Call the service's reset method
    this.puppyService.reset();
    this.puppyService.getFilteredPuppies().subscribe(puppies => {
      this.filteredPuppies.set(puppies);
    });
  }

  // Apply all filters to get filtered puppies
  applyFilters() {
    const filter:PuppyFilters = this.getVisualFilter();
    this.puppyService.filter.set(filter);
    this.puppyService.getFilteredPuppies().subscribe(puppies => {
      this.filteredPuppies.set(puppies);
    });
  }
  getVisualFilter(){
     return  {
      breed : this.selectedBreed(),
      minAge : this.minAge(),
      maxAge : this.maxAge(),
      size : this.selectedSize(),
      gender : this.selectedGender(),
      activityLevel : this.selectedActivityLevel(),
      goodWith : this.selectedGoodWith(),
      onlyAvailable : this.onlyAvailable(),
      searchTerm: this.searchTerm()
    }
  }
}
