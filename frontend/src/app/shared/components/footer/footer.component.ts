import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-primary-container text-on-primary py-16 px-8">
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 font-body text-sm">
        <div class="col-span-2">
          <div class="flex items-center gap-3 mb-6 cursor-pointer" (click)="onLinkClick('home')">
            <img src="assets/logo.png"
                 alt="Aries Ventures"
                 class="h-8 w-8 object-contain brightness-0 invert"
                 style="image-rendering: crisp-edges;">
            <span class="text-xl font-headline font-bold tracking-tighter">Aries Ventures</span>
          </div>
          <p class="text-on-primary/60 max-w-sm mb-8 leading-relaxed">
            A cinematic approach to local business websites. High performance. Editorial design. Revenue driven.
          </p>
          <div class="text-on-primary/40 text-xs">© 2024 Aries Ventures. All rights reserved.</div>
        </div>

        <div class="flex flex-col gap-3">
          <h4 class="font-headline font-bold text-base mb-2">Platform</h4>
          <a class="text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer" (click)="onLinkClick('home')">Home</a>
          <a class="text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer" (click)="onLinkClick('services')">Pricing</a>
          <a class="text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer" (click)="onLinkClick('templates')">Templates</a>
          <a class="text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer" (click)="onLinkClick('team')">Team</a>
        </div>

        <div class="flex flex-col gap-3">
          <h4 class="font-headline font-bold text-base mb-2">Support</h4>
          <a class="text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer" href="#">Privacy Policy</a>
          <a class="text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer" href="#">Terms of Service</a>
          <a class="text-on-primary/60 hover:text-on-primary transition-colors cursor-pointer" (click)="onContactClick()">Contact</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  @Output() linkClick = new EventEmitter<string>();
  @Output() contactClick = new EventEmitter<void>();

  onLinkClick(target: string) {
    this.linkClick.emit(target);
  }

  onContactClick() {
    this.contactClick.emit();
  }
}
