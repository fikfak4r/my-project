import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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

  /** Routes can opt out of navbar/footer chrome (e.g. the full-screen login portal). */
  protected readonly chromeless = signal(false);

  constructor(router: Router) {
    // route data is not a signal source, so sync on router events.
    router.events.subscribe(() => {
      const snap = router.routerState.snapshot;
      let leaf = snap.root;
      while (leaf.firstChild) leaf = leaf.firstChild;
      this.chromeless.set(!!leaf.routeConfig?.data?.['chromeless']);
    });
  }
}
