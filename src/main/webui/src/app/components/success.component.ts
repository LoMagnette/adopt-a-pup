import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {AdoptionService} from '../services/adoption.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="success-container">
      <div class="success-icon">✓</div>
      <h1>Application Submitted Successfully!</h1>
      <p>Thank you for submitting your puppy adoption application. Our team will review your information and contact you within 1-3 business days.</p>

      <div class="next-steps">
        <h2>What happens next?</h2>
        <ol>
          <li>Our team will review your application (1-3 business days)</li>
          <li>We'll contact you to schedule a meet and greet with potential matches</li>
          <li>A home visit will be arranged</li>
          <li>If approved, you'll complete the adoption process and welcome your new family member!</li>
        </ol>
      </div>

      <div class="buttons">
        <button class="home-button" routerLink="/">Return to Home</button>
      </div>
    </div>
  `,
  styles: `
    .success-container {
      max-width: 800px;
      margin: 3rem auto;
      padding: 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .success-icon {
      background-color: #2ecc71;
      color: white;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 40px;
      margin: 0 auto 1.5rem;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    p {
      color: #34495e;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .next-steps {
      background-color: #e8f4f8;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: left;
      margin-bottom: 2rem;
    }

    .next-steps h2 {
      color: #3498db;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .next-steps ol {
      padding-left: 1.5rem;
      margin-bottom: 0;
    }

    .next-steps li {
      margin-bottom: 0.5rem;
    }

    .buttons {
      display: flex;
      justify-content: center;
    }

    .home-button {
      padding: 0.75rem 1.5rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .home-button:hover {
      background-color: #2980b9;
    }
  `
})
export class SuccessComponent {
  private adoptionService = inject(AdoptionService);
  private router = inject(Router);

  ngOnInit() {
    // If no form data exists, redirect back to form
    if (!this.adoptionService.isFormSubmitted()) {
      this.router.navigate(['/adopt']);
    }
  }
}
