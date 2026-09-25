import { Component, computed, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarkdownService } from '../../core/markdown.service';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink, FormsModule, Reveal],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {
  source = signal(`# Designing For Devotion

## Why Markdown Sets You Free
Words are weightless. **Distribution is everything.**

::: tip The Infutia Way
Write once. We turn it into a premium reading experience.
:::

==Your knowledge deserves a home, not a file attachment.==

[[Takeaway: the syntax is human]]

- [x] Draft chapter one
- [ ] Ship chapter two

> "I stopped sending files and started sending links."

\`const home = new Infutia();\`
`);

  constructor(private md: MarkdownService, private sanitizer: DomSanitizer) {}

  rendered = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.md.render(this.source()).html));

  faqs = [
    { q: 'Do readers need to download anything?', a: 'Never. Everything streams inside our browser reader — that is exactly what makes your work piracy-proof.' },
    { q: 'Can I bring my existing PDF or Word file?', a: 'Yes. Upload it in the Studio and we convert it into Infutia Markdown with chapters detected automatically. You can then infuse callouts and highlights.' },
    { q: 'When does my profile become public?', a: 'You write privately by default. After publishing at least one product, you can register as an Author and your profile becomes visible — if you choose to.' },
    { q: 'How do followers work?', a: 'Readers follow you like a newsletter that never gets marked spam: launch pings, chapter discussions and community updates on your profile.' },
  ];
  openFaq = signal(-1);
}
