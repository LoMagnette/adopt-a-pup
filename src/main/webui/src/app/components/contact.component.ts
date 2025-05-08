import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="contact-container">
      <div class="contact-header">
        <h1>Contact Us</h1>
        <p class="subtitle">We'd love to hear from you!</p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <div class="info-block">
            <h3>Visit Us</h3>
            <p>
              123 Puppy Lane<br>
              Dogtown, CA 90210
            </p>
          </div>

          <div class="info-block">
            <h3>Opening Hours</h3>
            <p>
              Monday - Friday: 9am - 6pm<br>
              Saturday: 10am - 4pm<br>
              Sunday: Closed
            </p>
          </div>

          <div class="info-block">
            <h3>Contact Information</h3>
            <p>
              Phone: (555) 123-4567<br>
              Email: info&#64;puppyparadise.com
            </p>
          </div>

          <div class="map">
            <!-- Placeholder for map -->
            <div class="map-placeholder">
              <span>Map Location</span>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <h2>Send Us a Message</h2>
          <form (ngSubmit)="submitForm()">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="contactForm.name"
                required
              >
            </div>

            <div class="form-group">
              <label for="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="contactForm.email"
                required
              >
            </div>

            <div class="form-group">
              <label for="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                [(ngModel)]="contactForm.subject"
                required
              >
                <option value="" disabled selected>Select a subject</option>
                <option value="adoption">Adoption Inquiry</option>
                <option value="donation">Donation</option>
                <option value="volunteer">Volunteering</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                [(ngModel)]="contactForm.message"
                required
                rows="6"
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" [disabled]="isSubmitting">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>

            @if (submitSuccess) {
              <div class="success-message">
                Your message has been sent successfully! We'll get back to you soon.
              </div>
            }
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-container {
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .contact-header {
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

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .contact-info {
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .info-block {
      margin-bottom: 2rem;
    }

    .info-block h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .info-block p {
      color: #666;
      line-height: 1.6;
    }

    .map {
      margin-top: 2rem;
    }

    .map-placeholder {
      background-color: #f9f9f9;
      height: 250px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
      font-weight: 500;
    }

    .contact-form {
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .contact-form h2 {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      color: #333;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #444;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #ff6b6b;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background-color: #ff6b6b;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not([disabled]) {
      background-color: #ff5252;
      transform: translateY(-3px);
    }

    .submit-btn[disabled] {
      background-color: #ffb3b3;
      cursor: not-allowed;
    }

    .success-message {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #e8f5e9;
      color: #2e7d32;
      border-radius: 8px;
      text-align: center;
    }

    @media (max-width: 900px) {
      .contact-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;

  submitForm() {
    this.isSubmitting = true;

    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;

      // Reset form
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 1500);
  }
}
