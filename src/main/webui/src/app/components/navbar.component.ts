import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="logo">
        <a routerLink="/">
          <span class="logo-paw">🐾</span> Puppy Paradise
        </a>
      </div>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/puppies" routerLinkActive="active">Available Puppies</a>
        <a routerLink="/about" routerLinkActive="active">About Us</a>
        <a routerLink="/contact" routerLinkActive="active">Contact</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .logo a {
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    .logo-paw {
      margin-right: 0.5rem;
      font-size: 2rem;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      transition: all 0.3s ease;
    }

    .nav-links a:hover, .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        width: 100%;
        justify-content: space-around;
      }
    }
  `]
})
export class NavbarComponent {}
