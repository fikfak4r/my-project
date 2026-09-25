import { Component, computed, signal, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DataService } from '../../core/data.service';
import { MarkdownService } from '../../core/markdown.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, ProductCard, Reveal],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  slug = '';

  product = computed(() => this.data.product(this.slug));
  author = computed(() => (this.product() ? this.data.author(this.product()!.authorId) : null));
  related = computed(() =>
    this.data.products.filter((p) => p.id !== this.product()?.id && (p.category === this.product()?.category || p.authorId === this.product()?.authorId)).slice(0, 4)
  );

  constructor(public data: DataService, private md: MarkdownService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
  }

  freePreview = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.md.render(this.data.demoMarkdown).html)
  );
}
