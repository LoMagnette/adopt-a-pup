import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {PuppyService} from '../services/puppy.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
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
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(139, 92, 246, 0.9)), url('/assets/images/hero-bg.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      color: white;
      padding: 8rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .hero-content {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
      animation: fadeInUp 0.8s ease-out;
    }

    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2.5rem;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 400;
      animation: fadeInUp 0.8s ease-out 0.2s backwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      animation: fadeInUp 0.8s ease-out 0.4s backwards;
    }

    .btn {
      padding: 1rem 2.5rem;
      border-radius: 50px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 1.1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn.primary {
      background: linear-gradient(135deg, #ec4899, #f43f5e);
      color: white;
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
    }

    .btn.secondary {
      background-color: rgba(255, 255, 255, 0.15);
      border: 2px solid white;
      color: white;
      backdrop-filter: blur(10px);
    }

    .btn.primary:hover {
      background: linear-gradient(135deg, #db2777, #e11d48);
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5);
    }

    .btn.secondary:hover {
      background-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2.5rem;
      padding: 5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      background-color: var(--bg-secondary);
    }

    .feature-card {
      text-align: center;
      padding: 2.5rem 2rem;
      background: linear-gradient(135deg, #ffffff, #f9fafb);
      border-radius: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(99, 102, 241, 0.1);
    }

    .feature-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .feature-icon {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }

    .feature-card h3 {
      margin-bottom: 0.75rem;
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .feature-card p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .featured-puppies, .testimonials {
      padding: 5rem 2rem;
      text-align: center;
    }

    .featured-puppies {
      background: white;
    }

    .testimonials {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    }

    h2 {
      font-size: 2.75rem;
      margin-bottom: 3.5rem;
      color: var(--text-primary);
      font-weight: 800;
      letter-spacing: -0.02em;
      position: relative;
      display: inline-block;
    }

    h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #ec4899);
      border-radius: 2px;
    }

    .puppy-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2.5rem;
      max-width: 1200px;
      margin: 0 auto 2rem;
    }

    .puppy-card {
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
      background-color: white;
      border: 1px solid var(--border-color);
    }

    .puppy-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
    }

    .puppy-image {
      height: 240px;
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;
    }

    .puppy-image::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
    }

    .puppy-info {
      padding: 1.75rem;
    }

    .puppy-info h3 {
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 700;
    }

    .breed, .age {
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
      font-size: 0.95rem;
    }

    .breed {
      font-weight: 600;
      color: var(--primary-color);
    }

    .view-all {
      margin-top: 3rem;
    }

    .testimonial-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2.5rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .testimonial-card {
      padding: 2.5rem;
      border-radius: 1.5rem;
      background: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      position: relative;
      transition: all 0.3s ease;
    }

    .testimonial-card::before {
      content: '"';
      position: absolute;
      top: 1rem;
      left: 1.5rem;
      font-size: 4rem;
      color: rgba(99, 102, 241, 0.1);
      font-family: Georgia, serif;
      line-height: 1;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    }

    .testimonial-card p {
      font-style: italic;
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
      line-height: 1.8;
      position: relative;
      z-index: 1;
    }

    .testimonial-author {
      font-weight: 700;
      color: var(--primary-color);
      font-style: normal;
    }

    @media (max-width: 768px) {
      .hero {
        padding: 5rem 1.5rem;
      }

      .hero h1 {
        font-size: 2.25rem;
      }

      .hero p {
        font-size: 1.15rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 300px;
        justify-content: center;
      }

      h2 {
        font-size: 2rem;
      }

      .features {
        padding: 3rem 1.5rem;
        gap: 2rem;
      }
    }
  `]
})
export class HomeComponent {
  private puppyService = inject(PuppyService);
  featuredPuppies = this.puppyService.getFeaturePuppies().value;
}
