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
      padding: 1.25rem 3rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
      color: white;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
      position: relative;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .navbar::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    }

    .logo a {
      font-size: 1.75rem;
      font-weight: 800;
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      letter-spacing: -0.02em;
      transition: transform 0.2s ease;
    }

    .logo a:hover {
      transform: scale(1.05);
    }

    .logo-paw {
      margin-right: 0.625rem;
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }

    .nav-links {
      display: flex;
      gap: 0.5rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 600;
      padding: 0.625rem 1.25rem;
      border-radius: 2rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-links a::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: -1;
    }

    .nav-links a:hover::before {
      transform: scaleX(1);
    }

    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.25);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1.25rem;
        padding: 1.25rem 1.5rem;
      }

      .nav-links {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }

      .nav-links a {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class NavbarComponent {}
