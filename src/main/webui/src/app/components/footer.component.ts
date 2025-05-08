import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="logo-paw">🐾</span> Puppy Paradise
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h4>Quick Links</h4>
            <a routerLink="/">Home</a>
            <a routerLink="/puppies">Available Puppies</a>
            <a routerLink="/about">About Us</a>
            <a routerLink="/contact">Contact</a>
          </div>

          <div class="link-group">
            <h4>Resources</h4>
            <a href="#">Adoption Process</a>
            <a href="#">Puppy Care Guide</a>
            <a href="#">FAQs</a>
            <a href="#">Blog</a>
          </div>

          <div class="link-group">
            <h4>Connect</h4>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 Puppy Paradise. All rights reserved.</p>
        <p>
          <a href="#">Privacy Policy</a> |
          <a href="#">Terms of Service</a>
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #444;
      color: white;
      padding: 3rem 2rem 1rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-logo {
      font-size: 1.8rem;
      font-weight: bold;
      display: flex;
      align-items: center;
    }

    .logo-paw {
      margin-right: 0.5rem;
      font-size: 2rem;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 3rem;
    }

    .link-group h4 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: #ff6b6b;
    }

    .link-group a {
      display: block;
      color: #ddd;
      text-decoration: none;
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }

    .link-group a:hover {
      color: #ff6b6b;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 1.5rem;
      border-top: 1px solid #666;
      display: flex;
      justify-content: space-between;
      color: #aaa;
      font-size: 0.9rem;
    }

    .footer-bottom a {
      color: #aaa;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-bottom a:hover {
      color: white;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 2rem;
      }

      .footer-links {
        width: 100%;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}
