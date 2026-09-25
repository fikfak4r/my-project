import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from '../../core/data.service';
import { MarkdownService } from '../../core/markdown.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Reveal } from '../../shared/reveal/reveal';

/** One keystroke-group of the typewriter effect. */
interface TypeToken {
  text: string;
  cls?: 'h1' | 'h2' | 'mark' | 'code';
  br?: boolean;
}

const TYPE_SCRIPT: TypeToken[] = [
  { text: '# ', cls: 'h1' },
  { text: 'The Writer’s Edge', cls: 'h1', br: true },
  { text: '## ', cls: 'h2' },
  { text: 'Why Markdown Sets You Free', cls: 'h2', br: true },
  { text: 'Words are weightless. Distribution is everything.', br: true },
  { text: '::: tip The Infutia Way', cls: 'code', br: true },
  { text: 'Your knowledge deserves a home,', br: true },
  { text: '==not a file attachment.==', cls: 'mark', br: true },
];

interface MarqueeItem {
  label: string;
  icon: string;
  tint: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, Reveal],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  readonly data = inject(DataService);
  private readonly md = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);

  /* ── Format ticker ──────────────────────────────────────── */
  readonly marquee: MarqueeItem[] = [
    { label: 'Ebooks', icon: 'bi-book-half', tint: '#2f5aa8' },
    { label: 'Courses', icon: 'bi-mortarboard', tint: '#3e7c8c' },
    { label: 'Guides', icon: 'bi-signpost', tint: '#b08d4f' },
    { label: 'Templates', icon: 'bi-files', tint: '#4a7bc8' },
    { label: 'Audiobooks', icon: 'bi-headphones', tint: '#6f9b8a' },
    { label: 'Playbooks', icon: 'bi-compass', tint: '#234687' },
    { label: 'Cohorts', icon: 'bi-people', tint: '#9a7a43' },
    { label: 'Stories', icon: 'bi-feather', tint: '#5b83b8' },
  ];

  /* ── Live typewriter demo ───────────────────────────────── */
  readonly typedLines = signal<TypeToken[]>([]);
  readonly typingDone = signal(false);
  readonly typedText = computed(() =>
    this.typedLines()
      .map((t) => (t.br ? '\n' + t.text : t.text))
      .join('')
      .trimStart()
      .replace(/\n(?=[#=:])/g, '\n\n')
  );
  private timer?: ReturnType<typeof setTimeout>;

  /** Rendered chapter sample — revealed when the typing finishes. */
  readonly renderedDoc = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.md.render(this.data.demoMarkdown).html)
  );

  /* ── Studio demo tabs ───────────────────────────────────── */
  readonly tabs = ['Write', 'Infuse', 'Shine'] as const;
  activeTab = signal<(typeof this.tabs)[number]>('Write');

  syntaxHelp = [
    { code: '# / ## / ###', what: 'Headings — ## builds the chapter navigator' },
    { code: '::: tip …', what: 'Infusion callouts that make lessons stick' },
    { code: '==highlight==', what: 'Golden sentences readers can revisit' },
    { code: '[[takeaway]]', what: 'Emphasized key-takeaway chips' },
    { code: '- [x] task', what: 'Interactive checklists inside a book' },
    { code: '> quote', what: 'Pull quotes set in editorial serif' },
  ];

  setTab(t: (typeof this.tabs)[number]) {
    this.activeTab.set(t);
  }

  get demoSource(): string {
    return this.data.demoMarkdown;
  }

  get demoHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.md.render(this.data.demoMarkdown).html);
  }

  /* ── Shelf & authors ────────────────────────────────────── */
  get featured() {
    return this.data.products.filter((p) => p.trending || p.new).slice(0, 4);
  }

  get topAuthors() {
    return [...this.data.authors].sort((a, b) => b.followers - a.followers).slice(0, 4);
  }

  /* ── Count-up stats ─────────────────────────────────────── */
  readonly readers = signal(0);
  readonly productsCount = signal(0);
  readonly completion = signal(0);
  readonly countries = signal(0);

  ngOnInit(): void {
    this.runTypewriter();
  }

  ngAfterViewInit(): void {
    const node = this.host.nativeElement.querySelector('.statband');
    if (!node || !('IntersectionObserver' in window)) {
      this.startCounters();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.startCounters();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    this.destroyRef.onDestroy(() => io.disconnect());
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private startCounters(): void {
    this.animate(this.readers, 40000, 1600);
    this.animate(this.productsCount, 1200, 1600);
    this.animate(this.completion, 92, 1600);
    this.animate(this.countries, 38, 1600);
  }

  private animate(target: { set: (n: number) => void }, to: number, ms: number): void {
    const start = performance.now();
    this.zone.runOutsideAngular(() => {
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / ms);
        const eased = 1 - Math.pow(1 - p, 3);
        target.set(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /** Types the markdown sample line by line, then hands the stage to the reader. */
  private runTypewriter(): void {
    let idx = 0;
    const buf: TypeToken[] = [];
    const tick = () => {
      if (idx >= TYPE_SCRIPT.length) {
        // Let the caret rest for a beat, then transform into the rendered page.
        this.timer = setTimeout(() => this.typingDone.set(true), 1500);
        return;
      }
      const tok = TYPE_SCRIPT[idx++];
      buf.push(tok);
      this.typedLines.set([...buf]);
      const speed = tok.cls === 'code' ? 30 : 17;
      this.timer = setTimeout(tick, speed * Math.max(4, tok.text.length));
    };
    this.zone.runOutsideAngular(() => {
      this.timer = setTimeout(tick, 650);
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }
}
