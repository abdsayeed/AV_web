import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-templates-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [id]="sectionId" class="py-32 bg-surface-container-low" [ngClass]="{'bg-surface-container-lowest': alternateBg}">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end mb-20" *ngIf="showTitle">
          <div>
            <span class="text-secondary font-bold font-label tracking-widest text-sm uppercase">The Collection</span>
            <h2 class="text-6xl font-headline font-bold mt-4 leading-tight text-on-surface">Masterpieces<br>in every pixel.</h2>
          </div>
          <p class="text-xl text-on-surface-variant leading-relaxed">Our templates are bespoke foundations — designed to be extended and evolved with your brand.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let template of templates"
               (click)="onViewTemplate(template)"
               class="relative group rounded-3xl overflow-hidden h-[420px] shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-500">
            <img [src]="template.image" [alt]="template.name"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">

            <span *ngIf="template.badge"
                  class="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                  [ngClass]="template.badge === 'Popular' ? 'bg-error' : 'bg-secondary'">
              {{ template.badge | uppercase }}
            </span>

            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <p class="text-primary-fixed-dim text-xs font-bold mb-2 tracking-widest uppercase font-label">{{ template.industry }}</p>
              <h3 class="text-white text-2xl font-headline font-bold">{{ template.name }}</h3>
              <div class="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-white/80 text-sm font-medium">View details</span>
                <span class="material-symbols-outlined text-white text-base">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-16" *ngIf="showLoadMore">
          <button (click)="onLoadMore()"
                  class="px-10 py-5 bg-transparent border-2 border-outline-variant/30 hover:border-secondary text-on-surface rounded-full text-base font-bold transition-all">
            View All Templates
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         TEMPLATE PREVIEW MODAL
    ═══════════════════════════════════════════════════════════ -->
    <div *ngIf="showModal && selectedTemplate"
         class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
         (click)="closeModal()">
      <div class="bg-surface-container-lowest rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/10"
           (click)="$event.stopPropagation()">

        <!-- Modal header -->
        <div class="sticky top-0 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant/10 px-8 py-5 flex items-center justify-between z-10">
          <div>
            <h3 class="text-xl font-headline font-bold text-on-surface">{{ selectedTemplate?.name }}</h3>
            <p class="text-secondary font-label uppercase tracking-widest text-xs mt-0.5">{{ selectedTemplate?.industry }}</p>
          </div>
          <button (click)="closeModal()" class="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="p-8">
          <div class="aspect-video bg-cover bg-center rounded-2xl mb-8 border border-outline-variant/10"
               [style.background-image]="'url(' + selectedTemplate?.image + ')'"></div>
          <p class="text-on-surface-variant leading-relaxed text-base mb-10">{{ selectedTemplate?.description }}</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button (click)="onUseTemplate(selectedTemplate)"
                    class="flex-1 bg-primary-container text-on-primary py-4 rounded-full font-bold hover:bg-primary transition-all">
              {{ useTemplateLabel }}
            </button>
            <button (click)="onViewLiveDemo(selectedTemplate)"
                    class="flex-1 bg-surface-container text-on-surface py-4 rounded-full font-bold hover:bg-surface-container-high transition-all">
              View Live Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TemplatesGalleryComponent {
  @Input() templates: any[] = [];
  @Input() sectionId: string = 'templates';
  @Input() showTitle: boolean = true;
  @Input() alternateBg: boolean = false;
  @Input() showLoadMore: boolean = false;
  @Input() useTemplateLabel: string = 'Use This Template';
  
  @Output() loadMore = new EventEmitter<void>();
  @Output() useTemplate = new EventEmitter<any>();
  @Output() viewLiveDemo = new EventEmitter<any>();

  showModal = false;
  selectedTemplate: any = null;

  onViewTemplate(template: any) {
    this.selectedTemplate = template;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTemplate = null;
  }

  onLoadMore() {
    this.loadMore.emit();
  }

  onUseTemplate(template: any) {
    this.useTemplate.emit(template);
    this.closeModal();
  }

  onViewLiveDemo(template: any) {
    this.viewLiveDemo.emit(template);
  }
}
