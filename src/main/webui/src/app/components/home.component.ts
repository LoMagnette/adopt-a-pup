import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {PuppyService} from '../services/puppy.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>Find Your Furry Friend Today</h1>
        <p>Adopt a puppy and bring joy into your home</p>
        <div class="cta-buttons">
          <a routerLink="/puppies" class="btn primary">Browse Puppies</a>
          <a routerLink="/about" class="btn secondary">Learn More</a>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">🏠</div>
        <h3>Safe Homes</h3>
        <p>All our puppies go to carefully screened homes</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💉</div>
        <h3>Vaccinated</h3>
        <p>All puppies are up to date on their vaccinations</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">❤️</div>
        <h3>Loving Care</h3>
        <p>Each puppy receives personalized attention and care</p>
      </div>
    </section>

    <section class="featured-puppies">
      <h2>Featured Puppies</h2>
      <div class="puppy-cards">
        @for (puppy of featuredPuppies(); track puppy.id) {
          <div class="puppy-card">
            <div class="puppy-image" [style.background-image]="'url(' + puppy.imageUrl + ')'"></div>
            <div class="puppy-info">
              <h3>{{ puppy.name }}</h3>
              <p class="breed">{{ puppy.breed }}</p>
              <p class="age">{{ puppy.age }} {{ puppy.age === 1 ? 'month' : 'months' }} old</p>
              <a [routerLink]="['/puppies', puppy.id]" class="btn primary">Meet {{ puppy.name }}</a>
            </div>
          </div>
        }
      </div>
      <div class="view-all">
        <a routerLink="/puppies" class="btn secondary">View All Puppies</a>
      </div>
    </section>

    <section class="testimonials">
      <h2>Happy Families</h2>
      <div class="testimonial-cards">
        <div class="testimonial-card">
          <p>"We adopted Max last year and he's been such a wonderful addition to our family. The adoption process was smooth and the staff was incredibly helpful!"</p>
          <div class="testimonial-author">- Sarah & Tom Johnson</div>
        </div>
        <div class="testimonial-card">
          <p>"Luna has brought so much joy into our lives. We can't imagine our home without her. Thank you Puppy Paradise for bringing us together!"</p>
          <div class="testimonial-author">- Michael Davis</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/hero-bg.jpg');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 30px;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn.primary {
      background-color: #ff6b6b;
      color: white;
    }

    .btn.secondary {
      background-color: transparent;
      border: 2px solid white;
      color: white;
    }

    .btn.primary:hover {
      background-color: #ff5252;
      transform: translateY(-3px);
    }

    .btn.secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }

    .features {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 4rem 2rem;
      background-color: #f9f9f9;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      width: 300px;
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-10px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    .featured-puppies, .testimonials {
      padding: 4rem 2rem;
      text-align: center;
    }

    .featured-puppies {
      background-color: white;
    }

    .testimonials {
      background-color: #f1f8ff;
    }

    h2 {
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .puppy-cards {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .puppy-card {
      width: 300px;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      background-color: white;
    }

    .puppy-card:hover {
      transform: translateY(-10px);
    }

    .puppy-image {
      height: 200px;
      background-size: cover;
      background-position: center;
    }

    .puppy-info {
      padding: 1.5rem;
    }

    .puppy-info h3 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    .breed, .age {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .view-all {
      margin-top: 2rem;
    }

    .testimonial-cards {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .testimonial-card {
      width: 400px;
      padding: 2rem;
      border-radius: 15px;
      background-color: white;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .testimonial-card p {
      font-style: italic;
      margin-bottom: 1rem;
      color: #333;
    }

    .testimonial-author {
      font-weight: bold;
      color: #666;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero p {
        font-size: 1.2rem;
      }

      .cta-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {
  private puppyService = inject(PuppyService);
  featuredPuppies = this.puppyService.getFeaturePuppies().value;
}
