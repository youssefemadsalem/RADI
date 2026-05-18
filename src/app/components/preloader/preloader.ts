import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
@Component({
  selector: 'app-preloader',
  imports: [CommonModule],
  templateUrl: './preloader.html',
  styleUrl: './preloader.css',
})
export class Preloader {
  private renderer = inject(Renderer2);
  // Inject the current environment platform token (Server vs Browser)
  private platformId = inject(PLATFORM_ID);

  @ViewChild('preloaderContainer', { static: true })
  preloaderContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('preloaderSvg', { static: true }) preloaderSvg!: ElementRef<SVGPathElement>;
  @ViewChild('brandLogo', { static: true }) brandLogo!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(document.body, 'overflow-hidden');

      const svgPath = this.preloaderSvg.nativeElement;
      const container = this.preloaderContainer.nativeElement;
      const logo = this.brandLogo.nativeElement;

      const curve = 'M0 502S175 272 500 272s500 230 500 230V0H0Z';
      const flat = 'M0 2S175 1 500 1s500 1 500 1V0H0Z';

      // Kill CSS animation — stops it fighting GSAP
      logo.style.animation = 'none';

      const tl = gsap.timeline();

      // 1. Start hidden
      gsap.set(logo, { opacity: 0, scale: 0.95 });

      // 2. Fade in
      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      });

      // 3. Hold for just 0.2s then immediately chain into exit + SVG together
      tl.to(
        logo,
        {
          y: -60,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
        },
        '+=0.2',
      );

      // 4. SVG curve starts exactly as logo begins to exit (same moment)
      tl.to(
        svgPath,
        {
          duration: 0.5,
          attr: { d: curve },
          ease: 'power2.in',
        },
        '<',
      ); // ← '<' means "start at same time as previous tween"

      // 5. Flatten immediately after curve
      tl.to(svgPath, {
        duration: 0.4,
        attr: { d: flat },
        ease: 'power2.out',
      });

      // 6. Slide container up
      tl.to(
        container,
        {
          y: '-100vh',
          duration: 0.6,
          ease: 'power3.inOut',
        },
        '-=0.1',
      );

      // 7. Cleanup
      tl.set(container, {
        zIndex: -1,
        display: 'none',
        onComplete: () => {
          this.renderer.removeClass(document.body, 'overflow-hidden');
        },
      });
    }
  }
}
