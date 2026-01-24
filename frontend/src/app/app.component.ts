import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {}

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
      name: 'Pay-As-You-Go',
      icon: 'calendar_month',
      price: '£99',
      priceLabel: '/month',
      description: 'Low monthly subscription with full support, maintenance, and ultra-fast hosting included. Perfect for startups.',
      color: 'primary',
      badge: 'Most Accessible',
      features: ['5-page website', 'Mobile responsive', 'Basic SEO', 'Monthly updates', 'Email support'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjbP5WHr5GN8HwXnnPm_6y6Q5P2ZrF3R54b6XSYmGLlP4i_BLEajfSjmUfNH0-0j--gplRqJNz71kqJr2iBQkJeSEjtb3YTMi34DWTfDV5emh3SY0Ea6QRkCEaPqBCYrKDI-8iZSqfiDPXzpqaffPgFPa2v0Rf8D85Wz3R_c-pHEym3PSch-XBZ00WyKt4IaEZ0hw1tODfN8EZVpcc5lb49y6EnrhL3NylzNUwacNaCunOgFo49yVQ5L2wG4i1-2FvqR2fZwUHtek'
    },
    {
      name: 'Own It Outright',
      icon: 'payments',
      price: '£1,200',
      priceLabel: 'One-time',
      description: 'One-time payment for complete ownership of your custom site. No recurring contracts, just high-end design.',
      color: 'blue',
      badge: 'Full Control',
      features: ['10-page website', 'Custom design', 'Advanced SEO', 'Full ownership', 'Priority support'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzyD-l1502LRC-sfVKdfLlsOK7ON2gelcz0O75disd6NO6RJj67WTZZrsh5AkgdrX2FGjVeEgagiOAkA7lZoDbuTFyeCtiEBm4FwVTqRXFAGR0weFzsUkg0-dirUkWZwOqzKmr0Y5ugz9ha21YmcbccTx795lwBosFPKe0N3vTizX69GxDTKUgw3FvqJrqBujIK68T3RIXlDUIXelbF4xBDf3vm5YhJL_pHORuHrvBOgwCTZgl8C3buKbAwF4HCqwlyYeug4AsFxQ'
    },
    {
      name: 'Premium Managed',
      icon: 'verified_user',
      price: '£999',
      priceLabel: 'Build + £149/mo',
      description: 'High-performance build with dedicated management, priority updates, and growth-focused SEO strategy.',
      color: 'green',
      badge: 'Enterprise Grade',
      features: ['Unlimited pages', 'E-commerce ready', 'Premium SEO', '24/7 support', 'Monthly reports'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9vM4wxIs7Ig9a-uxSMgH3r_RO1Lxw0lV1Teix-0yAsRqpLSKGCLaP2_InA2cA0f4WmdB_JGuynvO7Qrm900dMJTE-57FpMEEooZ4tsO5YqYxcX5suN1pouZVjmTSrEC4PoBBFA-LkLIJLC4FkEz1VkE4zn53EfDeMhd0bDFgD5Knrgprk73SMUek0fwzkxhDdeCo0bBiGqCXh6UCggdKklWoJyl7bMdK7lHu_ctFAJxK0r7EeCPnQwhranFYIP8mUlWNg8csWtDQ'
    }
  ];

  industries = [
    { name: 'Barbershops', icon: '💈' },
    { name: 'Cafes & Dining', icon: '☕' },
    { name: 'Home Services', icon: '🔧' },
    { name: 'Landscapers', icon: '🌳' },
    { name: 'Boutique Retail', icon: '🛍️' },
    { name: 'Professional', icon: '💼' }
  ];

  templates = [
    {
      name: 'The Modern Groomer',
      industry: 'Barbershops',
      url: 'moderngroomer.com',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN_T8RjyUiYAVEDPHxVDcQTlA_l8NmtWi4fB7jPc6lovF1WF6WKryMUEkyo-scX79nFThIATt7jojBdmPzsJ3Ni977jX45KqUJbkH4PwsU4-NnN1wmBKNvTTB4zugpuUKlNC5wl9__DxCIfHMrKaBrC1jhSSYALG1APTXjrGO3CyeYB32KRY90gfV7DMR1p5JeXUPRGleEoZ5iMuf2w-yvVH6b7VP6MFU5MUGt5GxrNAP_LCySBrEjoOGdnkqXIbJOW3_7zlSqDAo',
      features: ['Integrated Online Booking System', 'Dynamic Service Menu & Pricing', 'Live Instagram Feed Integration'],
      badge: 'Popular'
    },
    {
      name: 'Artisan Roast',
      industry: 'Cafes & Eateries',
      url: 'artisanroast.coffee',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9miYKakWMRhV7pkOlbCCHqaXCl8R6jAcxcnqoWcWLRevLmTAIyeGTLRuzNkhCMMgFO8T5Ek_eEqAL_9PySId_0_0gHiOkSdazG7bfGgKcwOiMkMChfkXLUY4ABUMlxRpZXkGdftBfbSbbzmZaJabygf06ZaZqb3QiMIZJAdBDk3jmPaaPfALD1ne4APqNm1PAbtKbVUTKwb2nYm6o3dJ7Ve9m1EwZQ3uVDtcYnuuohoUDo_u-bEg5nQbk_ZZ1-MFEOX4VBVZcBh0',
      features: ['QR Code Digital Menu Access', 'Real-time Table Reservations', 'Customer Loyalty Program Page'],
      badge: ''
    },
    {
      name: 'Master Pipe',
      industry: 'Plumbers & HVAC',
      url: 'masterplumbing.io',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNFkEs9OhPwm7J9_tqSewPde-RObtieVzMPQL1k_pYR5k5XCfkpATOIHeIN7y_iUodpw8P1k17KKuY8OlcgOlW16e89FyjoPfqPqq0IR2JSyD_8wg4YV1hpKYzeEVtp_Sf-4Nb4_o-J0_47IyvjwhfMps-YtG7B8HUBx4-umlyuMB0SGep0rG4ZniSpLB4hydDzpeFQi8PhBxVPoHsn-h4RMg5JNDjj8jT1ADC_vDsKXqNBwlX2IPoUEDhSBnofIn8WpBzu38VgKo',
      features: ['24/7 Emergency Request Button', 'Trust Badges & Reviews Section', 'Service Area Map Integration'],
      badge: 'High Conversion'
    }
  ];

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
      role: 'Front-End Developer',
      bio: 'Front-end engineer focused on building clean, responsive, and user-friendly interfaces. Working with HTML, CSS, JavaScript, and modern frameworks.',
      image: 'assets/Md_Nasif.png',
      email: 'Mdnasif17@gmail.com',
      linkedin: 'www.linkedin.com/in/mdnasif17'
    },
    {
      name: 'AR Fahad',
      role: 'DevOps Engineer',
      bio: 'DevOps enthusiast who likes breaking things, fixing them, and automating the boring stuff. Working with Linux, Git, Docker, and CI/CD.',
      image: 'assets/ar_fahad.png',
      email: 'mdarfahad@mail.com',
      linkedin: 'https://www.linkedin.com/in/arfahad99/'
    }
  ];

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
                    style="padding: 12px; border: none; background: #4285f4; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s;"
                    onmouseover="this.style.background='#3367d6'" onmouseout="this.style.background='#4285f4'">
              📧 Gmail
            </button>
            <button onclick="window.open('https://compose.mail.yahoo.com/?to=${email}', '_blank'); document.getElementById('email-modal').remove();" 
                    style="padding: 12px; border: none; background: #6001d2; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s;"
                    onmouseover="this.style.background='#5000b8'" onmouseout="this.style.background='#6001d2'">
              📧 Yahoo Mail
            </button>
            <button onclick="window.open('https://outlook.live.com/mail/0/deeplink/compose?to=${email}', '_blank'); document.getElementById('email-modal').remove();" 
                    style="padding: 12px; border: none; background: #0078d4; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s;"
                    onmouseover="this.style.background='#106ebe'" onmouseout="this.style.background='#0078d4'">
              📧 Outlook
            </button>
            <button onclick="window.location.href='mailto:${email}'; document.getElementById('email-modal').remove();" 
                    style="padding: 12px; border: none; background: #666; color: white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.2s;"
                    onmouseover="this.style.background='#555'" onmouseout="this.style.background='#666'">
              📱 Default Email App
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

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = document.querySelectorAll('.scroll-section');
    let current = '';

    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id') || '';
      }
    });

    this.activeSection = current;
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

  onSubmit() {
    if (!this.formData.businessName || !this.formData.email) {
      alert('Please fill in all required fields!');
      return;
    }

    console.log('Form submitted:', this.formData);
    alert(`Thank you ${this.formData.businessName}! We will contact you at ${this.formData.email} within 24 hours.`);
    
    // Reset form
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
  }

  viewTemplate(template: any) {
    this.selectedTemplate = template;
    this.showTemplateModal = true;
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
    this.selectedTemplate = null;
  }

  selectPlan(plan: any) {
    alert(`You selected: ${plan.name}\n\nPrice: ${plan.price} ${plan.priceLabel}\n\nWe'll redirect you to the contact form to get started!`);
    this.scrollToSection('contact');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
