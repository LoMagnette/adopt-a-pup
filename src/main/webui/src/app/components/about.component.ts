import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="about-container">
      <div class="about-header">
        <h1>About Puppy Paradise</h1>
        <p class="subtitle">Bringing puppies and families together since 2015</p>
      </div>

      <div class="about-content">
        <div class="about-image"></div>

        <div class="about-text">
          <h2>Our Mission</h2>
          <p>
            At Puppy Paradise, we believe every puppy deserves a loving home. Our mission is to connect adorable puppies with caring families, ensuring a lifetime of happiness and companionship for both.
          </p>

          <h2>Our Story</h2>
          <p>
            Founded in 2015 by a group of passionate animal lovers, Puppy Paradise started as a small local shelter that has grown into a nationwide adoption network. We've helped over 5,000 puppies find their forever homes.
          </p>

          <h2>Our Process</h2>
          <p>
            We carefully screen all potential adopters to ensure our puppies go to safe, loving homes. All our puppies receive proper veterinary care, vaccinations, and socialization before adoption.
          </p>

          <div class="cta">
            <a routerLink="/puppies" class="btn primary">Find Your Puppy</a>
            <a routerLink="/contact" class="btn secondary">Contact Us</a>
          </div>
        </div>
      </div>

      <div class="team-section">
        <h2>Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-image" style="background-image: url('/assets/images/team1.jpg')"></div>
            <h3>Dr. Sarah Johnson</h3>
            <p class="position">Founder & Veterinarian</p>
          </div>

          <div class="team-member">
            <div class="member-image" style="background-image: url('/assets/images/team2.jpg')"></div>
            <h3>Mike Thompson</h3>
            <p class="position">Adoption Specialist</p>
          </div>

          <div class="team-member">
            <div class="member-image" style="background-image: url('/assets/images/team3.jpg')"></div>
            <h3>Emily Davis</h3>
            <p class="position">Puppy Trainer</p>
          </div>

          <div class="team-member">
            <div class="member-image" style="background-image: url('/assets/images/team4.jpg')"></div>
            <h3>David Wilson</h3>
            <p class="position">Care Specialist</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-container {
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .about-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #666;
    }

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 4rem;
    }

    .about-image {
      background-image: url('/assets/images/about-us.jpg');
      background-size: cover;
      background-position: center;
      height: 100%;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .about-text h2 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      margin-top: 2rem;
      color: #333;
    }

    .about-text h2:first-child {
      margin-top: 0;
    }

    .about-text p {
      color: #444;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .cta {
      margin-top: 2rem;
      display: flex;
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
      border: 2px solid #ff6b6b;
      color: #ff6b6b;
    }

    .btn.primary:hover {
      background-color: #ff5252;
      transform: translateY(-3px);
    }

    .btn.secondary:hover {
      background-color: rgba(255, 107, 107, 0.1);
      transform: translateY(-3px);
    }

    .team-section {
      text-align: center;
    }

    .team-section h2 {
      font-size: 2rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }

    .team-member {
      background-color: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .team-member:hover {
      transform: translateY(-10px);
    }

    .member-image {
      height: 250px;
      background-size: cover;
      background-position: center;
    }

    .team-member h3 {
      margin: 1rem 0 0.5rem;
      padding: 0 1rem;
      color: #333;
    }

    .position {
      color: #666;
      margin-bottom: 1rem;
      padding: 0 1rem;
    }

    @media (max-width: 900px) {
      .about-content {
        grid-template-columns: 1fr;
      }

      .about-image {
        height: 300px;
      }

      .cta {
        flex-direction: column;
      }
    }
  `]
})
export class AboutComponent {}
