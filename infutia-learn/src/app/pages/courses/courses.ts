import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-courses',
  imports: [RouterLink, ProductCard, Reveal],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  readonly formats = ['All', 'ebook', 'course', 'guide', 'template', 'audiobook'] as const;
  activeFormat = signal<string>('All');
  query = signal('');

  constructor(public data: DataService) {}

  filtered = computed(() => {
    const f = this.activeFormat();
    const q = this.query().toLowerCase().trim();
    return this.data.products.filter((p) => {
      const okF = f === 'All' || p.format === f;
      const okQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q));
      return okF && okQ;
    });
  });
}
