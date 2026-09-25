import { Component, computed, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { MarkdownService } from '../../core/markdown.service';
import { Author, Product } from '../../core/models';

type Theme = 'light' | 'sepia' | 'midnight';

@Component({
  selector: 'app-reader',
  imports: [RouterLink],
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
})
export class Reader {
  product!: Product;
  author!: Author;

  constructor(private data: DataService, private md: MarkdownService, private sanitizer: DomSanitizer) {
    this.product = this.data.product('writers-edge')!;
    this.author = this.data.author(this.product.authorId);
  }

  theme = signal<Theme>('light');
  fontScale = signal(100); // percent
  tocOpen = signal(false);
  bookmarksOpen = signal(false);
  activeSection = signal('sec-1');

  bookmarks = signal<{ id: string; label: string }[]>([]);

  readonly themes: { id: Theme; icon: string; label: string }[] = [
    { id: 'light', icon: 'bi-sun', label: 'Daylight' },
    { id: 'sepia', icon: 'bi-brightness-high', label: 'Sepia' },
    { id: 'midnight', icon: 'bi-moon-stars', label: 'Midnight' },
  ];

  doc = computed(() => this.md.render(this.data.demoMarkdown));
  html = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.doc().html));
  progress = computed(() => {
    const ids = this.doc().toc.map((t) => t.id);
    const idx = Math.max(0, ids.indexOf(this.activeSection()));
    return Math.round(((idx + 1) / ids.length) * 100);
  });

  setTheme(t: Theme) { this.theme.set(t); }
  zoom(dir: 1 | -1) { this.fontScale.update((v) => Math.min(140, Math.max(85, v + dir * 5))); }

  toggleBookmark() {
    const cur = this.doc().toc.find((t) => t.id === this.activeSection());
    if (!cur) return;
    this.bookmarks.update((list) =>
      list.some((b) => b.id === cur.id) ? list.filter((b) => b.id !== cur.id) : [...list, cur]
    );
  }

  isBookmarked(id: string) { return this.bookmarks().some((b) => b.id === id); }

  jump(id: string) {
    this.activeSection.set(id);
    this.tocOpen.set(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  nextChapter() {
    const ids = this.doc().toc.map((t) => t.id);
    const i = ids.indexOf(this.activeSection());
    if (i < ids.length - 1) this.jump(ids[i + 1]);
  }

  prevChapter() {
    const ids = this.doc().toc.map((t) => t.id);
    const i = ids.indexOf(this.activeSection());
    if (i > 0) this.jump(ids[i - 1]);
  }
}
