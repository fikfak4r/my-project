import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('infutia-learn');

  /** Routes can opt out of the landing-page navbar/footer chrome (e.g. the full-screen login portal). */
  protected readonly chromeless = signal(false);

  private readonly router = inject(Router);

  constructor() {
    // Recompute chrome visibility as soon as a route activates — before rendering —
    // so the topnav never flashes on chromeless routes like /login.
    this.router.events
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((e) => {
        if (e instanceof ActivationEnd || e instanceof RouterOutlet) {
          this.chromeless.set(this.isChromeless());
        }
      });
  }

  ngAfterViewInit(): void {
    // Safety net: keep the flag in sync after every rendered navigation.
    this.chromeless.set(this.isChromeless());
  }

  /** True when the deepest activated route opts out of the shared navbar/footer. */
  private isChromeless(): boolean {
    let node = this.router.routerState.snapshot.root;
    while (node.firstChild) node = node.firstChild;
    return !!node.data?.['chromeless'];
  }
}
