import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContextService } from './core/services/context.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Aries Ventures';
  activeSection = 'home';
  mobileMenuOpen = false;
  selectedTemplate: any = null;
  showTemplateModal = false;
  hasMoreTemplates = false; // Set to true when you have more templates to load
  showLoadMoreButton = true; // Always show button initially
  allTemplates: any[] = []; // This will hold all templates
  displayedTemplates: any[] = []; // This will hold currently displayed templates

  constructor(
    private router: Router,
    private contextService: ContextService
  ) {
    this.initializeTemplates();
  }

  initializeTemplates() {
    // Initialize all templates (you can expand this array with more templates)
    this.allTemplates = [
      {
        name: 'Fairphone',
        industry: 'Technology',
        url: 'fairphone.com',
        demoUrl: '', // Add demo URL here later
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN_T8RjyUiYAVEDPHxVDcQTlA_l8NmtWi4fB7jPc6lovF1WF6WKryMUEkyo-scX79nFThIATt7jojBdmPzsJ3Ni977jX45KqUJbkH4PwsU4-NnN1wmBKNvTTB4zugpuUKlNC5wl9__DxCIfHMrKaBrC1jhSSYALG1APTXjrGO3CyeYB32KRY90gfV7DMR1p5JeXUPRGleEoZ5iMuf2w-yvVH6b7VP6MFU5MUGt5GxrNAP_LCySBrEjoOGdnkqXIbJOW3_7zlSqDAo',
        description: 'A modern, sustainable technology website template featuring clean design, product showcases, and environmental impact metrics. Perfect for eco-conscious tech companies.',
        features: ['Sustainable Design Focus', 'Product Showcase', 'Environmental Impact Metrics'],
        badge: 'Popular'
      },
      {
        name: 'Bonne Maman',
        industry: 'Food & Beverage',
        url: 'bonnemaman.com',
        demoUrl: '', // Add demo URL here later
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9miYKakWMRhV7pkOlbCCHqaXCl8R6jAcxcnqoWcWLRevLmTAIyeGTLRuzNkhCMMgFO8T5Ek_eEqAL_9PySId_0_0gHiOkSdazG7bfGgKcwOiMkMChfkXLUY4ABUMlxRpZXkGdftBfbSbbzmZaJabygf06ZaZqb3QiMIZJAdBDk3jmPaaPfALD1ne4APqNm1PAbtKbVUTKwb2nYm6o3dJ7Ve9m1EwZQ3uVDtcYnuuohoUDo_u-bEg5nQbk_ZZ1-MFEOX4VBVZcBh0',
        description: 'Warm and inviting food & beverage template with recipe integration, brand storytelling, and beautiful product catalogs. Ideal for artisanal food brands.',
        features: ['Recipe Integration', 'Brand Storytelling', 'Product Catalog'],
        badge: ''
      },
      {
        name: 'Cytosurge',
        industry: 'Biotechnology',
        url: 'cytosurge.com',
        demoUrl: '', // Add demo URL here later
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjbP5WHr5GN8HwXnnPm_6y6Q5P2ZrF3R54b6XSYmGLlP4i_BLEajfSjmUfNH0-0j--gplRqJNz71kqJr2iBQkJeSEjtb3YTMi34DWTfDV5emh3SY0Ea6QRkCEaPqBCYrKDI-8iZSqfiDPXzpqaffPgFPa2v0Rf8D85Wz3R_c-pHEym3PSch-XBZ00WyKt4IaEZ0hw1tODfN8EZVpcc5lb49y6EnrhL3NylzNUwacNaCunOgFo49yVQ5L2wG4i1-2FvqR2fZwUHtek',
        description: 'Professional biotech template with scientific data visualization, research portfolios, and technical documentation. Built for cutting-edge research companies.',
        features: ['Scientific Data Visualization', 'Research Portfolio', 'Technical Documentation'],
        badge: ''
      },
      {
        name: 'Plugin',
        industry: 'Software',
        url: 'plugin.io',
        demoUrl: '', // Add demo URL here later
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNFkEs9OhPwm7J9_tqSewPde-RObtieVzMPQL1k_pYR5k5XCfkpATOIHeIN7y_iUodpw8P1k17KKuY8OlcgOlW16e89FyjoPfqPqq0IR2JSyD_8wg4YV1hpKYzeEVtp_Sf-4Nb4_o-J0_47IyvjwhfMps-YtG7B8HUBx4-umlyuMB0SGep0rG4ZniSpLB4hydDzpeFQi8PhBxVPoHsn-h4RMg5JNDjj8jT1ADC_vDsKXqNBwlX2IPoUEDhSBnofIn8WpBzu38VgKo',
        description: 'Developer-focused software template featuring comprehensive documentation, API integration guides, and interactive code examples. Perfect for SaaS products.',
        features: ['Developer Documentation', 'API Integration', 'Code Examples'],
        badge: 'High Conversion'
      },
      {
        name: 'Fondation Saint-Luc',
        industry: 'Healthcare',
        url: 'fondation-saint-luc.be',
        demoUrl: '', // Add demo URL here later
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9vM4wxIs7Ig9a-uxSMgH3r_RO1Lxw0lV1Teix-0yAsRqpLSKGCLaP2_InA2cA0f4WmdB_JGuynvO7Qrm900dMJTE-57FpMEEooZ4tsO5YqYxcX5suN1pouZVjmTSrEC4PoBBFA-LkLIJLC4FkEz1VkE4zn53EfDeMhd0bDFgD5Knrgprk73SMUek0fwzkxhDdeCo0bBiGqCXh6UCggdKklWoJyl7bMdK7lHu_ctFAJxK0r7EeCPnQwhranFYIP8mUlWNg8csWtDQ',
        description: 'Trusted healthcare template with medical services directory, appointment booking system, and comprehensive patient resources. Designed for medical institutions.',
        features: ['Medical Services Directory', 'Appointment Booking', 'Patient Resources'],
        badge: ''
      },
      {
        name: 'Permafungi',
        industry: 'Sustainability',
        url: 'permafungi.be',
        demoUrl: '', // Add demo URL here later
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzyD-l1502LRC-sfVKdfLlsOK7ON2gelcz0O75disd6NO6RJj67WTZZrsh5AkgdrX2FGjVeEgagiOAkA7lZoDbuTFyeCtiEBm4FwVTqRXFAGR0weFzsUkg0-dirUkWZwOqzKmr0Y5ugz9ha21YmcbccTx795lwBosFPKe0N3vTizX69GxDTKUgw3FvqJrqBujIK68T3RIXlDUIXelbF4xBDf3vm5YhJL_pHORuHrvBOgwCTZgl8C3buKbAwF4HCqwlyYeug4AsFxQ',
        description: 'Eco-friendly sustainability template showcasing environmental metrics, educational content, and community features. Great for green initiatives and NGOs.',
        features: ['Sustainability Metrics', 'Educational Content', 'Community Features'],
        badge: 'Popular'
      }
      // Add more templates here in the future
    ];

    // Initially show first 6 templates
    this.displayedTemplates = this.allTemplates.slice(0, 6);
    
    // Check if there are more templates to load
    this.hasMoreTemplates = this.allTemplates.length > this.displayedTemplates.length;
  }

  // Form data
  formData = {
    businessName: '',
    email: '',
    phone: '',
    websiteType: 'E-commerce Store',
    budget: 'basic',
    message: '',
    services: {
      seo: false,
      design: true,
      maintenance: false,
      content: false
    }
  };

  // Professional loading states
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'services', label: 'Services' },
    { id: 'ideal-clients', label: 'Clients' },
    { id: 'templates', label: 'Templates' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' }
  ];

  pricingPlans = [
    {
      name: 'Pay-As-You-Go Website',
      icon: 'schedule',
      price: '£59',
      priceLabel: '/month',
      description: 'Template-based website with ongoing support. Perfect for small businesses starting online with low upfront cost.',
      color: 'primary',
      badge: 'Most Accessible',
      features: [
        '5-page responsive website',
        'Template-based design',
        'Contact form & Google Maps',
        'Basic SEO setup',
        'Hosting, SSL & backups',
        'Regular security updates',
        'Small content changes',
        'Performance monitoring'
      ],
      contractInfo: '6 or 12-month minimum • Website licensed, not owned • Buyout option available',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjbP5WHr5GN8HwXnnPm_6y6Q5P2ZrF3R54b6XSYmGLlP4i_BLEajfSjmUfNH0-0j--gplRqJNz71kqJr2iBQkJeSEjtb3YTMi34DWTfDV5emh3SY0Ea6QRkCEaPqBCYrKDI-8iZSqfiDPXzpqaffPgFPa2v0Rf8D85Wz3R_c-pHEym3PSch-XBZ00WyKt4IaEZ0hw1tODfN8EZVpcc5lb49y6EnrhL3NylzNUwacNaCunOgFo49yVQ5L2wG4i1-2FvqR2fZwUHtek'
    },
    {
      name: 'Fully Managed Professional Website',
      icon: 'diamond',
      price: '£249',
      priceLabel: '/month',
      description: 'Full professional website with zero technical hassle. We own and manage everything for you.',
      color: 'blue',
      badge: 'Most Popular',
      features: [
        'Up to 12-15 pages',
        'Custom brand-aligned design',
        'Mobile-first & fully responsive',
        'Advanced forms (quotes, bookings)',
        'Blog / CMS included',
        'Advanced SEO & analytics',
        'Premium hosting & CDN',
        'Daily backups & security',
        'Unlimited content updates',
        'Monthly reports',
        'Priority support'
      ],
      contractInfo: '6 or 12-month minimum • We own & manage • Buyout option available',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9vM4wxIs7Ig9a-uxSMgH3r_RO1Lxw0lV1Teix-0yAsRqpLSKGCLaP2_InA2cA0f4WmdB_JGuynvO7Qrm900dMJTE-57FpMEEooZ4tsO5YqYxcX5suN1pouZVjmTSrEC4PoBBFA-LkLIJLC4FkEz1VkE4zn53EfDeMhd0bDFgD5Knrgprk73SMUek0fwzkxhDdeCo0bBiGqCXh6UCggdKklWoJyl7bMdK7lHu_ctFAJxK0r7EeCPnQwhranFYIP8mUlWNg8csWtDQ'
    },
    {
      name: 'Full Professional Website',
      icon: 'workspace_premium',
      price: 'Custom',
      priceLabel: 'One-time',
      description: 'Fully custom professional website. You own everything with full control and no long-term contracts.',
      color: 'green',
      badge: 'Full Ownership',
      features: [
        'Fully custom design',
        'Unlimited pages & features',
        'Custom UI/UX design',
        'Advanced integrations',
        'Blog / CMS',
        'SEO-ready structure',
        'Speed optimized',
        'Full source code included',
        'You own the website',
        'Optional maintenance plan'
      ],
      contractInfo: 'One-time payment • You own everything • No long-term contract • Maintenance optional',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzyD-l1502LRC-sfVKdfLlsOK7ON2gelcz0O75disd6NO6RJj67WTZZrsh5AkgdrX2FGjVeEgagiOAkA7lZoDbuTFyeCtiEBm4FwVTqRXFAGR0weFzsUkg0-dirUkWZwOqzKmr0Y5ugz9ha21YmcbccTx795lwBosFPKe0N3vTizX69GxDTKUgw3FvqJrqBujIK68T3RIXlDUIXelbF4xBDf3vm5YhJL_pHORuHrvBOgwCTZgl8C3buKbAwF4HCqwlyYeug4AsFxQ'
    }
  ];

  industries = [
    { name: 'Barbershops', icon: 'content_cut' },
    { name: 'Cafes & Dining', icon: 'restaurant' },
    { name: 'Home Services', icon: 'home_repair_service' },
    { name: 'Landscapers', icon: 'park' },
    { name: 'Boutique Retail', icon: 'storefront' },
    { name: 'Professional', icon: 'business_center' }
  ];

  // Use displayedTemplates instead of templates in the template
  get templates() {
    return this.displayedTemplates;
  }

  teamMembers = [
    {
      name: 'Abdullah Al Sayeed',
      role: 'Backend Developer',
      bio: 'Back-end developer building APIs, handling data, and making systems work behind the scenes. Interested in scalability, security, and clean architecture.',
      image: 'assets/Abdullah_sayed.png',
      email: 'abdsayeedofficial@gmail.com',
      linkedin: 'https://www.linkedin.com/in/abdullah-al-sayeed-50522a22b'
    },
    {
      name: 'MD Nasif',
      role: 'Frontend Developer',
      bio: 'Front-end engineer focused on building clean, responsive, and user-friendly interfaces. Working with HTML, CSS, JavaScript, and modern frameworks.',
      image: 'assets/Md_Nasif.png',
      email: 'Mdnasif17@gmail.com',
      linkedin: 'https://www.linkedin.com/in/mdnasif17'
    },
    {
      name: 'AR Fahad',
      role: 'DevOps Engineer',
      bio: 'DevOps enthusiast who likes breaking things, fixing them, and automating the boring stuff. Working with Linux, Git, Docker, and CI/CD.',
      image: 'assets/ar_fahad.png',
      email: 'mdarfahad@gmail.com',
      linkedin: 'https://www.linkedin.com/in/arfahad99/'
    }
  ];

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = document.querySelectorAll('.scroll-section');
    let current = '';

    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id') || '';
      }
    });

    this.activeSection = current;
    this.addScrollAnimations();
  }

  // Professional scroll animations
  addScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.mobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  async onSubmit() {
    if (this.isSubmitting) return;
    
    if (!this.formData.businessName || !this.formData.email) {
      this.submitError = 'Please fill in all required fields!';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', this.formData);
      
      // Success state
      this.submitSuccess = true;
      
      // Reset form after success
      this.formData = {
        businessName: '',
        email: '',
        phone: '',
        websiteType: 'E-commerce Store',
        budget: 'basic',
        message: '',
        services: {
          seo: false,
          design: true,
          maintenance: false,
          content: false
        }
      };
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
      
    } catch (error) {
      this.submitError = 'Something went wrong. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  // Smart email redirect function
  openEmail(email: string) {
    // Extract domain from email
    const domain = email.split('@')[1].toLowerCase();
    
    // Define email provider URLs
    const emailProviders: { [key: string]: string } = {
      'gmail.com': `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
      'yahoo.com': `https://compose.mail.yahoo.com/?to=${email}`,
      'yahoo.co.uk': `https://compose.mail.yahoo.com/?to=${email}`,
      'hotmail.com': `https://outlook.live.com/mail/0/deeplink/compose?to=${email}`,
      'outlook.com': `https://outlook.live.com/mail/0/deeplink/compose?to=${email}`,
      'live.com': `https://outlook.live.com/mail/0/deeplink/compose?to=${email}`,
      'icloud.com': `https://www.icloud.com/mail/`,
      'me.com': `https://www.icloud.com/mail/`,
      'mac.com': `https://www.icloud.com/mail/`
    };

    // Check if we have a specific provider URL
    if (emailProviders[domain]) {
      window.open(emailProviders[domain], '_blank');
    } else {
      // For custom domains or unknown providers, show options
      this.showEmailOptions(email);
    }
  }

  // Show email options for custom domains
  showEmailOptions(email: string) {
    // Create a more user-friendly modal-style selection
    const modalHtml = `
      <div id="email-modal" onclick="if(event.target === this) this.remove();" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div onclick="event.stopPropagation();" style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 400px; width: 90%; cursor: default;">
          <h3 style="margin: 0 0 20px 0; color: #333; text-align: center;">Send Email to ${email}</h3>
          <p style="margin: 0 0 20px 0; color: #666; text-align: center;">Choose your preferred email service:</p>
          <div style="display: grid; gap: 10px;">
            <button onclick="window.open('https://mail.google.com/mail/?view=cm&fs=1&to=${email}', '_blank'); document.getElementById('email-modal').remove();" 
                    style="padding: 12px; border: none; background: #4285f4; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                    onmouseover="this.style.background='#3367d6'" onmouseout="this.style.background='#4285f4'">
              <span class="material-symbols-outlined">mail</span> Gmail
            </button>
            <button onclick="window.open('https://compose.mail.yahoo.com/?to=${email}', '_blank'); document.getElementById('email-modal').remove();" 
                    style="padding: 12px; border: none; background: #6001d2; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                    onmouseover="this.style.background='#5000b8'" onmouseout="this.style.background='#6001d2'">
              <span class="material-symbols-outlined">mail</span> Yahoo Mail
            </button>
            <button onclick="window.open('https://outlook.live.com/mail/0/deeplink/compose?to=${email}', '_blank'); document.getElementById('email-modal').remove();" 
                    style="padding: 12px; border: none; background: #0078d4; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                    onmouseover="this.style.background='#106ebe'" onmouseout="this.style.background='#0078d4'">
              <span class="material-symbols-outlined">mail</span> Outlook
            </button>
            <button onclick="window.location.href='mailto:${email}'; document.getElementById('email-modal').remove();" 
                    style="padding: 12px; border: none; background: #666; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                    onmouseover="this.style.background='#555'" onmouseout="this.style.background='#666'">
              <span class="material-symbols-outlined">smartphone</span> Default Email App
            </button>
            <button onclick="document.getElementById('email-modal').remove();" 
                    style="padding: 8px; border: 1px solid #ddd; background: white; color: #666; border-radius: 8px; cursor: pointer; margin-top: 10px; transition: all 0.2s;"
                    onmouseover="this.style.background='#f5f5f5'; this.style.borderColor='#999'" onmouseout="this.style.background='white'; this.style.borderColor='#ddd'">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
    
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    document.body.appendChild(modalElement);
  }

  viewTemplate(template: any) {
    this.selectedTemplate = template;
    this.showTemplateModal = true;
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
    this.selectedTemplate = null;
  }

  useTemplate(template: any) {
    // Navigate to contact form with template context
    this.contextService.navigateToContactWithTemplate(
      template.name.toLowerCase().replace(/\s+/g, '-'),
      template.name,
      template.industry
    );
    this.closeTemplateModal();
  }

  selectPlan(plan: any) {
    // Navigate to contact form with pricing context
    const tierMap: Record<string, string> = {
      'Pay-As-You-Go Website': 'basic',
      'Fully Managed Professional Website': 'pro',
      'Full Professional Website': 'custom'
    };
    
    this.contextService.navigateToContactWithPricing(
      tierMap[plan.name] || 'basic',
      plan.price
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToContactForm() {
    this.router.navigate(['/contact']);
  }

  viewLiveDemo(template: any) {
    // This function will open the live demo of the template
    // For now, it shows a placeholder message
    // Later you can add the actual demo URLs to each template
    console.log('Opening live demo for:', template.name);
    
    // Placeholder - you can replace this with actual demo URLs
    if (template.demoUrl) {
      window.open(template.demoUrl, '_blank');
    } else {
      // Temporary placeholder until demo URLs are added
      alert(`Live demo for ${template.name} coming soon! Demo URL will be added here.`);
    }
  }

  loadMoreTemplates() {
    // Load more templates if available
    const currentCount = this.displayedTemplates.length;
    const nextBatch = this.allTemplates.slice(currentCount, currentCount + 6);
    
    if (nextBatch.length > 0) {
      // There are more templates to load
      this.displayedTemplates = [...this.displayedTemplates, ...nextBatch];
      
      // Check if there are still more templates after this batch
      if (this.displayedTemplates.length >= this.allTemplates.length) {
        // No more templates, hide the button
        this.showLoadMoreButton = false;
      }
    } else {
      // No more templates to load, hide the button
      this.showLoadMoreButton = false;
    }
  }
}