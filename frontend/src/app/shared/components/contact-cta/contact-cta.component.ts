import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-cta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="contact" class="scroll-section py-32 bg-surface-container-low grid-overlay">
      <div class="max-w-5xl mx-auto px-8">
        <div class="bg-primary-container rounded-3xl p-12 lg:p-20 relative overflow-hidden">
          <!-- Glow -->
          <div class="absolute -top-32 -right-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 text-center">
            <span class="inline-flex items-center gap-2 bg-white/10 text-on-primary/80 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 font-label">
              <span class="w-1.5 h-1.5 bg-secondary-fixed rounded-full animate-pulse"></span>
              Limited spots available
            </span>
            <h2 class="text-5xl font-headline font-bold mb-6 tracking-tighter text-on-primary">Ready to Scale?</h2>
            <p class="text-on-primary/70 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Drop your details in our fast project inquiry form. We'll reply within 24 hours with a custom roadmap for your digital growth.
            </p>
            <button (click)="onCtaClick()"
                    class="inline-flex items-center gap-3 bg-secondary text-white py-5 px-10 rounded-full text-lg font-bold shadow-2xl shadow-secondary/40 hover:bg-secondary-container active:scale-95 transition-all">
              Start Your Project Inquiry
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactCtaComponent {
  @Output() ctaClick = new EventEmitter<void>();

  onCtaClick() {
    this.ctaClick.emit();
  }
}
