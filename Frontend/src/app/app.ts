import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  menuOpen = false;
  isDarkMode = localStorage.getItem('theme') === 'dark';

  constructor(private authService: AuthService, private router: Router) {
    this.applyTheme();
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-bs-theme', this.isDarkMode ? 'dark' : 'light');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
