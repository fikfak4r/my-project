import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Author } from './models';
import { DataService } from './data.service';

export interface SessionUser {
  authorId: string;
  name: string;
  handle: string;
  email: string;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
}

interface StoredAuth {
  session: SessionUser | null;
  accounts: Record<string, string>; // email -> password (demo only)
}

const STORAGE_KEY = 'infutia-auth-v1';

/**
 * Infutia Learn — Auth service (front-end demo implementation).
 * Swap the localStorage layer for real HTTP calls when the API lands:
 * POST /auth/login, POST /auth/register, GET /me
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _session = signal<SessionUser | null>(this.restore());
  readonly session = computed(() => this._session());
  readonly isLoggedIn = computed(() => this._session() !== null);

  /** Demo credentials surfaced on the login screen so reviewers can sign in. */
  static readonly DEMO = { email: 'zara@infutia.com', password: 'infutia2026' };

  constructor(private router: Router, private data: DataService) {}

  login(email: string, password: string): { ok: boolean; error?: string } {
    const store = this.read();
    const normalized = email.trim().toLowerCase();

    if (normalized === AuthService.DEMO.email && password === AuthService.DEMO.password) {
      this._session.set(this.buildSession('a1', normalized));
      this.persist();
      return { ok: true };
    }
    const saved = store.accounts[normalized];
    if (saved && saved === password) {
      this._session.set(this.buildSession(normalized.split('@')[0], normalized));
      this.persist();
      return { ok: true };
    }
    return { ok: false, error: 'We could not match that email and password. Try the demo account below.' };
  }

  register(form: { name: string; email: string; password: string }): { ok: boolean; error?: string } {
    const normalized = form.email.trim().toLowerCase();
    const store = this.read();
    if (store.accounts[normalized] || normalized === AuthService.DEMO.email) {
      return { ok: false, error: 'An account with this email already exists. Sign in instead.' };
    }
    store.accounts[normalized] = form.password;
    this.write(store);
    this._session.set({
      authorId: normalized,
      name: form.name.trim(),
      handle: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '.'),
      email: normalized,
      initials: form.name.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
      avatarFrom: '#7c5cff',
      avatarTo: '#ff6ec7',
    });
    this.persist();
    return { ok: true };
  }

  logout(): void {
    this._session.set(null);
    this.persist();
    this.router.navigate(['/']);
  }

  /** Navigate to the author's public profile (opt-in visibility flow). */
  goProfile(): void {
    const s = this._session();
    if (!s) return;
    this.router.navigate(['/authors', s.authorId]);
  }

  /* ── Portal helpers (demo metrics derived from seeded data) ───────── */

  /** Products authored by the current session user (empty for fresh sign-ups). */
  myProducts() {
    const s = this._session();
    return s ? this.data.authorProducts(s.authorId) : [];
  }

  /** Total readers across the author's catalogue. */
  totalReaders(): number {
    return this.myProducts().reduce((sum, p) => sum + p.readers, 0);
  }

  /** Follower count from the author record (seeded estimate for new accounts). */
  followerCount(): number {
    const s = this._session();
    if (!s) return 0;
    const a = this.data.authorById(s.authorId);
    return a ? a.followers : 12;
  }

  /** Estimated royalties: NGN 350 per paid read, free products excluded. */
  estimatedEarnings(): number {
    return this.myProducts().reduce(
      (sum, p) => sum + (p.price > 0 ? Math.round(p.readers * 0.18) * 350 : 0),
      0
    );
  }

  private buildSession(authorId: string, email: string): SessionUser {
    const author: Author | undefined = this.data.authorById(authorId);
    if (author) {
      return {
        authorId: author.id,
        name: author.name,
        handle: author.handle,
        email,
        initials: author.initials,
        avatarFrom: author.avatarFrom,
        avatarTo: author.avatarTo,
      };
    }
    return { authorId, name: email, handle: email.split('@')[0], email, initials: 'IL', avatarFrom: '#7c5cff', avatarTo: '#ff6ec7' };
  }

  private restore(): SessionUser | null {
    try {
      return this.read().session;
    } catch {
      return null;
    }
  }

  private read(): StoredAuth {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { session: null, accounts: {} };
    return JSON.parse(raw) as StoredAuth;
  }

  private write(store: StoredAuth): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  private persist(): void {
    const store = this.read();
    store.session = this._session();
    this.write(store);
  }
}
