import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appReveal]'
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private observer?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    this.renderer.addClass(element, 'reveal-hidden');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.renderer.removeClass(element, 'reveal-hidden');
      this.renderer.addClass(element, 'reveal-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (this.revealDelay > 0) {
          this.renderer.setStyle(element, 'transitionDelay', `${this.revealDelay}ms`);
        }

        this.renderer.removeClass(element, 'reveal-hidden');
        this.renderer.addClass(element, 'reveal-visible');
        this.observer?.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
