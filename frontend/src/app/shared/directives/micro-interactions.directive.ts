import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMicroInteraction]',
  standalone: true
})
export class MicroInteractionsDirective implements OnInit {
  @Input() interactionType: 'hover-lift' | 'hover-glow' | 'click-ripple' | 'fade-in' | 'slide-in' | 'bounce' = 'hover-lift';
  @Input() delay: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.applyInteraction();
  }

  private applyInteraction() {
    const element = this.el.nativeElement;

    switch (this.interactionType) {
      case 'hover-lift':
        this.applyHoverLift(element);
        break;
      case 'hover-glow':
        this.applyHoverGlow(element);
        break;
      case 'click-ripple':
        this.applyClickRipple(element);
        break;
      case 'fade-in':
        this.applyFadeIn(element);
        break;
      case 'slide-in':
        this.applySlideIn(element);
        break;
      case 'bounce':
        this.applyBounce(element);
        break;
    }
  }

  private applyHoverLift(element: HTMLElement) {
    this.renderer.setStyle(element, 'transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    this.renderer.setStyle(element, 'cursor', 'pointer');

    this.renderer.listen(element, 'mouseenter', () => {
      this.renderer.setStyle(element, 'transform', 'translateY(-8px) scale(1.02)');
      this.renderer.setStyle(element, 'box-shadow', '0 20px 40px rgba(0, 0, 0, 0.15)');
    });

    this.renderer.listen(element, 'mouseleave', () => {
      this.renderer.setStyle(element, 'transform', 'translateY(0) scale(1)');
      this.renderer.setStyle(element, 'box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
    });
  }

  private applyHoverGlow(element: HTMLElement) {
    this.renderer.setStyle(element, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(element, 'cursor', 'pointer');

    this.renderer.listen(element, 'mouseenter', () => {
      this.renderer.setStyle(element, 'box-shadow', '0 0 20px rgba(59, 130, 246, 0.5)');
      this.renderer.setStyle(element, 'border-color', '#3B82F6');
    });

    this.renderer.listen(element, 'mouseleave', () => {
      this.renderer.setStyle(element, 'box-shadow', 'none');
      this.renderer.setStyle(element, 'border-color', 'transparent');
    });
  }

  private applyClickRipple(element: HTMLElement) {
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.setStyle(element, 'overflow', 'hidden');

    this.renderer.listen(element, 'click', (event: MouseEvent) => {
      const ripple = this.renderer.createElement('span');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      this.renderer.setStyle(ripple, 'position', 'absolute');
      this.renderer.setStyle(ripple, 'width', `${size}px`);
      this.renderer.setStyle(ripple, 'height', `${size}px`);
      this.renderer.setStyle(ripple, 'left', `${x}px`);
      this.renderer.setStyle(ripple, 'top', `${y}px`);
      this.renderer.setStyle(ripple, 'background', 'rgba(255, 255, 255, 0.3)');
      this.renderer.setStyle(ripple, 'border-radius', '50%');
      this.renderer.setStyle(ripple, 'transform', 'scale(0)');
      this.renderer.setStyle(ripple, 'animation', 'ripple 0.6s linear');
      this.renderer.setStyle(ripple, 'pointer-events', 'none');

      this.renderer.appendChild(element, ripple);

      setTimeout(() => {
        this.renderer.removeChild(element, ripple);
      }, 600);
    });

    // Add CSS animation
    const style = this.renderer.createElement('style');
    this.renderer.setProperty(style, 'textContent', `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `);
    this.renderer.appendChild(document.head, style);
  }

  private applyFadeIn(element: HTMLElement) {
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transition', 'opacity 0.6s ease');

    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.setStyle(element, 'opacity', '1');
            observer.unobserve(element);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(element);
    }, this.delay);
  }

  private applySlideIn(element: HTMLElement) {
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transform', 'translateY(30px)');
    this.renderer.setStyle(element, 'transition', 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)');

    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.setStyle(element, 'opacity', '1');
            this.renderer.setStyle(element, 'transform', 'translateY(0)');
            observer.unobserve(element);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(element);
    }, this.delay);
  }

  private applyBounce(element: HTMLElement) {
    this.renderer.setStyle(element, 'animation', `bounce 0.6s ease ${this.delay}ms`);

    // Add CSS animation
    const style = this.renderer.createElement('style');
    this.renderer.setProperty(style, 'textContent', `
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translate3d(0, 0, 0);
        }
        40%, 43% {
          transform: translate3d(0, -8px, 0);
        }
        70% {
          transform: translate3d(0, -4px, 0);
        }
        90% {
          transform: translate3d(0, -2px, 0);
        }
      }
    `);
    this.renderer.appendChild(document.head, style);
  }
}