import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { Product } from '../../core/models';

type Tab = 'overview' | 'products' | 'followers' | 'settings';

interface Draft {
  title: string;
  format: Product['format'];
  price: number;
  body: string;
}

const DRAFTS_KEY = 'infutia-drafts-v1';

@Component({
  selector: 'il-studio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './studio.html',
  styleUrl: './studio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Studio {
  readonly auth = inject(AuthService);
  readonly data = inject(DataService);

  readonly tab = signal<Tab>('overview');
  readonly composerOpen = signal(false);
  readonly toast = signal<string | null>(null);
  readonly wordCount = signal(0);

  /** Opt-in public visibility — profile only appears to readers once enabled. */
  readonly isPublic = signal<boolean>(this.restoreVisibility());

  readonly formats: { value: Product['format']; label: string; icon: string }[] = [
    { value: 'ebook', label: 'eBook', icon: 'bi-book-half' },
    { value: 'course', label: 'Course', icon: 'bi-mortarboard' },
    { value: 'guide', label: 'Guide', icon: 'bi-compass' },
    { value: 'template', label: 'Template pack', icon: 'bi-files' },
    { value: 'audiobook', label: 'Audiobook', icon: 'bi-headphones' },
  ];

  readonly draft = signal<Draft>({
    title: '',
    format: 'ebook',
    price: 0,
    body:
      '# Chapter One\n\nWrite your masterpiece in **Infutia Markdown**.\n\n' +
      '::: tip Reader delight\nAdd ==highlights==, callouts and [[takeaways]] — they render beautifully.\n:::\n',
  });

  readonly session = this.auth.session;
  readonly products = computed<Product[]>(() => this.auth.myProducts());
  readonly readers = computed(() => this.auth.totalReaders());
  readonly followers = computed(() => this.auth.followerCount());
  readonly earnings = computed(() => this.auth.estimatedEarnings());

  readonly fmtIcon = (f: Product['format']): string =>
    this.formats.find((x) => x.value === f)?.icon ?? 'bi-file-earmark-text';

  readonly ngn = (v: number): string =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(v);

  readonly compact = (v: number): string =>
    new Intl.NumberFormat('en', { notation: 'compact' }).format(v);

  setTab(t: Tab): void {
    this.tab.set(t);
  }

  toggleComposer(): void {
    this.composerOpen.update((o) => !o);
  }

  onTitle(event: Event): void {
    this.draft.update((d) => ({ ...d, title: (event.target as HTMLInputElement).value }));
  }

  onBody(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.wordCount.set(this.countWords(el.value));
    this.draft.update((d) => ({ ...d, body: el.value }));
  }

  onPrice(event: Event): void {
    this.draft.update((d) => ({ ...d, price: Number((event.target as HTMLInputElement).value) || 0 }));
  }

  pickFormat(f: Product['format']): void {
    this.draft.update((d) => ({ ...d, format: f }));
  }

  saveDraft(): void {
    const d = this.draft();
    if (!d.title.trim()) {
      this.say('Give your product a working title first.');
      return;
    }
    const drafts = this.readDrafts();
    drafts[d.title.trim().toLowerCase()] = d;
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
    } catch {
      /* private mode */
    }
    this.say(`Draft "${d.title.trim()}" saved to your desk.`);
    this.composerOpen.set(false);
  }

  importDoc(): void {
    this.say('PDF / Word import queued — we will convert it to Infutia Markdown and email you when it is ready.');
  }

  publishDemo(): void {
    this.say('Publishing opens once the API lands. Your draft is safe on this device.');
  }

  togglePublic(): void {
    const next = !this.isPublic();
    if (next && this.products().length === 0) {
      this.say('Go public after your first product is live — that is the Infutia promise.');
      return;
    }
    this.isPublic.set(next);
    try {
      localStorage.setItem('infutia-public-v1', String(next));
    } catch {
      /* private mode */
    }
    this.say(next ? 'Your profile is now visible to every reader.' : 'Your profile is hidden again. Only you can see it.');
  }

  signOut(): void {
    this.auth.logout();
  }

  /* ── internals ─────────────────────────────────────────────── */

  private countWords(text: string): number {
    return text.split(/\s+/).filter(Boolean).length;
  }

  private readDrafts(): Record<string, Draft> {
    try {
      return JSON.parse(localStorage.getItem(DRAFTS_KEY) ?? '{}') as Record<string, Draft>;
    } catch {
      return {};
    }
  }

  private restoreVisibility(): boolean {
    try {
      return localStorage.getItem('infutia-public-v1') === 'true';
    } catch {
      return false;
    }
  }

  private say(msg: string): void {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 4200);
  }
}
