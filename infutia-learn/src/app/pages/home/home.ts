import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService } from '../../core/data.service';
import { MarkdownService } from '../../core/markdown.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, Reveal],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  /** Live markdown demo tabs */
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

  constructor(public data: DataService, private md: MarkdownService, private sanitizer: DomSanitizer) {}

  get demoHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.md.render(this.data.demoMarkdown).html);
  }

  setTab(t: (typeof this.tabs)[number]) {
    this.activeTab.set(t);
  }
}
