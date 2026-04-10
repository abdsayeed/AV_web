const fs = require('fs');
let ts = fs.readFileSync('src/app/app.component.ts', 'utf8');

const importsToAdd = `
import { NavComponent } from "./shared/components/nav/nav.component";
import { PricingCardsComponent } from "./shared/components/pricing-cards/pricing-cards.component";
import { TemplatesGalleryComponent } from "./shared/components/templates-gallery/templates-gallery.component";
import { ContactCtaComponent } from "./shared/components/contact-cta/contact-cta.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
`;

ts = ts.replace('import { MicroInteractionsDirective } from "./shared/directives/micro-interactions.directive";', 
  'import { MicroInteractionsDirective } from "./shared/directives/micro-interactions.directive";' + importsToAdd);

const importsArrayToAdd = `
    NavComponent,
    PricingCardsComponent,
    TemplatesGalleryComponent,
    ContactCtaComponent,
    FooterComponent,`;

ts = ts.replace('MicroInteractionsDirective,\n  ]', 'MicroInteractionsDirective,' + importsArrayToAdd + '\n  ]');

fs.writeFileSync('src/app/app.component.ts', ts);
