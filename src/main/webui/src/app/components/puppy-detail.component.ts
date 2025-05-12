import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PuppyService} from '../services/puppy.service';
import {Puppy} from '../models/puppy';

@Component({
    selector: 'app-puppy-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        @if (puppy(); as puppy) {
            <section class="puppy-detail-container">
                <div class="back-button">
                    <a routerLink="/puppies">&larr; Back to all puppies</a>
                </div>

                <div class="puppy-detail">
                    <div class="puppy-images">
                        <img [src]="puppy.imageUrl" [alt]="puppy.name" class="main-image">
                    </div>

                    <div class="puppy-info">
                        <h1>{{ puppy.name }}</h1>
                        <div class="info-badges">
                            <span class="badge breed">{{ puppy.breed }}</span>
                            <span class="badge age">{{ puppy.age }} {{ puppy.age === 1 ? 'month' : 'months' }}
                                old</span>
                            <span class="badge status" [class.available]="puppy.available">
                {{ puppy.available ? 'Available for adoption' : 'Already adopted' }}
              </span>
                        </div>

                        <div class="description">
                            <h3>About {{ puppy.name }}</h3>
                            <p>{{ puppy.description }}</p>
                        </div>

                        <div class="adoption-process">
                            <h3>Adoption Process</h3>
                            <ol>
                                <li>Fill out an adoption application</li>
                                <li>Meet with {{ puppy.name }} and our staff</li>
                                <li>Home visit to ensure a safe environment</li>
                                <li>Adoption fee and paperwork</li>
                                <li>Welcome your new family member home!</li>
                            </ol>
                        </div>

                        <button
                                class="adopt-button"
                                [disabled]="!puppy.available"
                                (click)="startAdoption()"
                        >
                            {{ puppy.available ? 'Start Adoption Process' : 'Already Adopted' }}
                        </button>
                    </div>
                </div>
            </section>
        } @else {
            <div class="not-found">
                <h2>Puppy Not Found</h2>
                <p>Sorry, we couldn't find the puppy you're looking for.</p>
                <a routerLink="/puppies" class="btn primary">Browse All Puppies</a>
            </div>
        }
    `,
    styles: [`

      .puppy-detail-container {
        padding: 3rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .back-button {
        margin-bottom: 2rem;
      }

      .back-button a {
        color: #666;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .back-button a:hover {
        color: #ff6b6b;
      }

      .puppy-detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        background-color: white;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .puppy-images {
        padding: 2rem;

        img {
          max-width: 600px !important;
        }
      }

      .main-image {
        width: 100%;
        height: auto;
        border-radius: 10px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      }

      .puppy-info {
        padding: 2rem;
      }

      .puppy-info h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #333;
      }

      .info-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2rem;
      }

      .badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .badge.breed {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      .badge.age {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      .badge.status {
        background-color: #ffebee;
        color: #c62828;
      }

      .badge.status.available {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      .description, .adoption-process {
        margin-bottom: 2rem;
      }

      .description h3, .adoption-process h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #333;
      }

      .description p {
        color: #444;
        line-height: 1.6;
      }

      .adoption-process ol {
        padding-left: 1.5rem;
        color: #444;
        line-height: 1.8;
      }

      .adopt-button {
        padding: 1rem 2rem;
        border-radius: 30px;
        font-weight: bold;
        background-color: #ff6b6b;
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.1rem;
        width: 100%;
      }

      .adopt-button:hover:not([disabled]) {
        background-color: #ff5252;
        transform: translateY(-3px);
      }

      .adopt-button[disabled] {
        background-color: #ccc;
        cursor: not-allowed;
      }

      .not-found {
        text-align: center;
        padding: 4rem 2rem;
      }

      .not-found h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #333;
      }

      .not-found p {
        margin-bottom: 2rem;
        color: #666;
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

      @media (max-width: 900px) {
        .puppy-detail {
          grid-template-columns: 1fr;
        }
      }
    `]
})
export class PuppyDetailComponent {
    private puppyService = inject(PuppyService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    id = input.required<string>();

    puppy = signal<Puppy | undefined>(undefined);

    constructor() {
        effect(() => {
            const idNbr = Number(this.id());
            const foundPuppy = this.puppyService.getPuppyById(idNbr).subscribe(
                value => {
                    this.puppy.set(value);
                }
            );

        });
    }

    startAdoption() {
        // In a real app, this would navigate to adoption form or process
        alert(`Starting adoption process for ${this.puppy()?.name}!`);
        this.router.navigate(['/adopt/' + this.id()]);
    }
}
