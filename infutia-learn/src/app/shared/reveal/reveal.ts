import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

/** Adds .is-visible when the element scrolls into view (one-shot). */
@Directive({ selector: '.il-reveal,[ilReveal]' })
export class Reveal implements OnInit {
  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngOnInit(): void {
    const node = this.el.nativeElement;
    this.r.addClass(node, 'il-reveal');
    if (!('IntersectionObserver' in window)) {
      this.r.addClass(node, 'is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            this.r.addClass(node, 'is-visible');
            io.unobserve(node);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(node);
  }
}
