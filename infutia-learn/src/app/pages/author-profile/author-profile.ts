import { Component, computed, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Reveal } from '../../shared/reveal/reveal';

@Component({
  selector: 'app-author-profile',
  imports: [RouterLink, ProductCard, Reveal],
  templateUrl: './author-profile.html',
  styleUrl: './author-profile.scss',
})
export class AuthorProfile implements OnInit {
  following = signal(false);
  feedOpen = signal(false);

  author = computed(() => this.data.authorById(this.routeId) ?? this.data.authors[0]);
  products = computed(() => this.data.products.filter((p) => p.authorId === this.author().id));

  private routeId = '';

  constructor(public data: DataService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.routeId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  updates = [
    { icon: 'bi-rocket-takeoff', text: 'published a new product', when: '2 days ago', accent: true },
    { icon: 'bi-megaphone', text: 'announced “Chapter 3 is live — early readers react”', when: '1 week ago' },
    { icon: 'bi-person-plus-fill', text: 'gained 480 new followers this month', when: '2 weeks ago' },
  ];

  toggleFollow() { this.following.update((v) => !v); }
}
