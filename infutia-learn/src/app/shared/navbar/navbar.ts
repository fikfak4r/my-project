import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly auth = inject(AuthService);
  readonly links = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'How it works', path: '/how-it-works' },
    { label: 'Become an Author', path: '/become-author' },
  ];

  scrolled = signal(false);
  open = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}
