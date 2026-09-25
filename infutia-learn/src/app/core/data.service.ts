import { Injectable } from '@angular/core';
import { Author, Product, Testimonial, Chapter } from './models';

const CH1 = `# The Writer's Edge

## Why Markdown Sets You Free
Words are weightless. **Distribution is everything.** When your knowledge lives in a
plain-text format, it becomes *liquid* — it flows to any screen, any size, any reader.

::: tip The Infutia Way
Write once in simple Markdown. We turn it into a premium reading experience with
themes, bookmarks and highlights — no website, no downloads, no piracy worries.
:::

==Your knowledge deserves a home, not a file attachment.== That home is Infutia Learn.

- Write in plain Markdown you already know
- Add callouts, highlights and takeaways with one symbol
- Publish to a beautiful storefront in seconds

---

## From PDF Prison to Premium Pages
Most creators upload a PDF and pray. Readers download it, share it, and the trail
goes cold. On Infutia, nothing leaves the platform.

> "I stopped sending files and started sending links. My completion rate tripled."
> — Amara T., Bestselling Author

### A quick checklist before you publish
- [x] Convert your manuscript to Infutia Markdown
- [x] Add chapter headings with \`##\`
- [ ] Record an intro note for readers
- [ ] Set your launch price

## Your First Infusion Block
Callouts make lessons memorable. Try this:

\`\`\`
::: tip Ship it small
Publish chapter one free. Hook them, then sell the rest.
:::
\`\`\`

[[Takeaway: formatting is friction-free when the syntax is human.]]`;

const CH2 = `# Designing For Devotion

## Reader Psychology 101
People don't finish ebooks. They finish *experiences*. Progress bars, gentle
typography and comfortable eye-feel keep readers glued till the end.

::: note Eye Comfy Mode
Our sepia and midnight themes adjust contrast automatically based on the hour.
:::

## The Anatomy Of A Sticky Chapter
1. Open with a promise
2. Deliver one idea per section
3. End with a takeaway chip

==Readers reward clarity with their attention.==

- Bookmark-friendly headings
- Highlightable sentences
- One-tap chapter navigation

[[Takeaway: design the journey, not just the page.]]`;

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly authors: Author[] = [
    { id: 'a1', name: 'Zara Okafor', handle: 'zara.builds', role: 'Product & Growth Author', bio: 'Ex-Series-A PM turned full-time writer. Zara helps builders ship products people obsess over.', avatarFrom: '#2f5aa8', avatarTo: '#4a7bc8', initials: 'ZO', followers: 18400, products: 6, rating: 4.9, verified: true, location: 'Lagos, NG' },
    { id: 'a2', name: 'Daniel Mensah', handle: 'dan.writes', role: 'Finance Educator', bio: 'Making personal finance feel like a good novel, one chapter at a time.', avatarFrom: '#b08d4f', avatarTo: '#9a7a43', initials: 'DM', followers: 12100, products: 4, rating: 4.8, verified: true, location: 'Accra, GH' },
    { id: 'a3', name: 'Ifeoma Eze', handle: 'ifeoma.designs', role: 'Design Storyteller', bio: 'UI/UX essays, playbooks and templates for designers who ship.', avatarFrom: '#3e7c8c', avatarTo: '#5b83b8', initials: 'IE', followers: 9800, products: 5, rating: 4.9, verified: false, location: 'Abuja, NG' },
    { id: 'a4', name: 'Kunle Adeyemi', handle: 'kunle.code', role: 'Engineering Mentor', bio: 'Backend patterns explained like bedtime stories.', avatarFrom: '#7d97c4', avatarTo: '#4a7bc8', initials: 'KA', followers: 7300, products: 3, rating: 4.7, verified: true, location: 'Remote' },
  ];

  readonly products: Product[] = [
    { id: 'p1', slug: 'writers-edge', title: "The Writer's Edge", subtitle: 'Turn what you know into digital products that sell', authorId: 'a1', format: 'ebook', category: 'Business', price: 5000, rating: 4.9, readers: 12840, chapters: 12, coverFrom: '#2f5aa8', coverTo: '#4a7bc8', icon: 'bi-book-half', excerpt: 'A field guide to packaging your knowledge into premium reading experiences.', tags: ['writing', 'monetization'], trending: true },
    { id: 'p2', slug: 'designing-for-devotion', title: 'Designing For Devotion', subtitle: 'Product craft for obsessive users', authorId: 'a3', format: 'course', category: 'Design', price: 10000, rating: 4.8, readers: 8210, chapters: 9, coverFrom: '#3e7c8c', coverTo: '#5b83b8', icon: 'bi-pencil-ruler', excerpt: 'Retention is a design problem. Learn the loops that keep users hooked.', tags: ['product', 'ux'], new: true, trending: true },
    { id: 'p3', slug: 'money-in-motion', title: 'Money In Motion', subtitle: 'Personal finance, beautifully explained', authorId: 'a2', format: 'ebook', category: 'Finance', price: 3500, rating: 4.7, readers: 15300, chapters: 15, coverFrom: '#b08d4f', coverTo: '#9a7a43', icon: 'bi-cash-stack', excerpt: 'Budgets, side income and investing — told like a story you cannot put down.', tags: ['finance', 'wealth'] },
    { id: 'p4', slug: 'backend-bedtime', title: 'Backend Patterns After Dark', subtitle: 'Scalable systems explained simply', authorId: 'a4', format: 'guide', category: 'Tech', price: 7500, rating: 4.8, readers: 6420, chapters: 10, coverFrom: '#7d97c4', coverTo: '#4a7bc8', icon: 'bi-hdd-network', excerpt: 'Queues, caches and idempotency — with diagrams rendered live as you read.', tags: ['engineering'], new: true },
    { id: 'p5', slug: 'creator-launch-kit', title: 'The Creator Launch Kit', subtitle: '60 templates for your first launch', authorId: 'a1', format: 'template', category: 'Business', price: 0, rating: 4.6, readers: 21000, chapters: 8, coverFrom: '#6f9b8a', coverTo: '#4e8577', icon: 'bi-rocket-takeoff', excerpt: 'Free forever. Copy, tweak, publish. Your knowledge, delivered.', tags: ['templates', 'launch'], trending: true },
    { id: 'p6', slug: 'deep-work-daily', title: 'Deep Work, Daily', subtitle: 'An audiobook for focused makers', authorId: 'a2', format: 'audiobook', category: 'Self', price: 4500, rating: 4.9, readers: 9870, chapters: 7, coverFrom: '#7ea3cf', coverTo: '#6d8bc0', icon: 'bi-headphones', excerpt: 'Ten-minute listening rituals that rebuild your attention span.', tags: ['focus', 'audio'], new: true },
  ];

  readonly testimonials: Testimonial[] = [
    { quote: 'I converted two old PDFs into Infutia products in an afternoon. Sales doubled because reading here feels premium.', name: 'Chidinma R.', role: 'Author · Business', initials: 'CR', color: '#2f5aa8' },
    { quote: 'Bookmarks, highlights, night mode — I finished more books last month than in the previous year.', name: 'Tobi A.', role: 'Reader · Lagos', initials: 'TA', color: '#3e7c8c' },
    { quote: 'No website. No hosting bills. No pirated PDFs floating around Telegram. Just write and publish.', name: 'Selina K.', role: 'Author · Design', initials: 'SK', color: '#9a7a43' },
    { quote: 'My followers get pinged the moment I publish. The community tab turned readers into regulars.', name: 'Emeka N.', role: 'Author · Tech', initials: 'EN', color: '#7d97c4' },
  ];

  readonly demoMarkdown = CH1;
  readonly demoChapters: Chapter[] = [
    { id: 'c1', title: "Why Markdown Sets You Free", minutes: 8, body: CH1 },
    { id: 'c2', title: 'Designing For Devotion', minutes: 11, body: CH2 },
  ];

  author(id: string): Author {
    return this.authors.find(a => a.id === id) ?? this.authors[0];
  }

  authorById(id: string): Author | undefined {
    return this.authors.find(a => a.id === id);
  }

  product(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  authorProducts(authorId: string): Product[] {
    return this.products.filter(p => p.authorId === authorId);
  }

  fmt(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  naira(n: number): string {
    return n === 0 ? 'Free' : '₦' + n.toLocaleString();
  }
}
