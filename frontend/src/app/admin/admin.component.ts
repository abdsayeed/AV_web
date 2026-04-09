import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface Lead {
  id: string;
  businessName: string;
  leadDate: string;
  status: 'New' | 'In Progress' | 'Completed';
  plan: 'Startup' | 'Standard' | 'Enterprise';
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  activeSection: string = 'dashboard';
  mobileMenuOpen = false;
  
  // Mock Analytics metrics
  metrics = {
    leadsActive: 1429,
    leadsChange: 12.4,
    conversions: 11.2,
    conversionsChange: 2.1,
    traffic: 48500,
    trafficChange: -4.2
  };
  
  // Mock Leads
  leads: Lead[] = [
    { id: '1', businessName: 'Nexus Dynamics Inc.', leadDate: '2024-05-12', status: 'In Progress', plan: 'Enterprise' },
    { id: '2', businessName: 'Stellar Logistics', leadDate: '2024-05-11', status: 'Completed', plan: 'Standard' },
    { id: '3', businessName: 'Aetheria Cloud', leadDate: '2024-05-11', status: 'New', plan: 'Startup' },
    { id: '4', businessName: 'Global Vision Partners', leadDate: '2024-05-10', status: 'In Progress', plan: 'Enterprise' }
  ];

  ngOnInit() {
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.mobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  getLeadStatusClass(status: string) {
    switch(status) {
      case 'New': return { 'bg-amber-100': true, 'text-amber-700': true };
      case 'In Progress': return { 'bg-blue-100': true, 'text-blue-700': true };
      case 'Completed': return { 'bg-emerald-100': true, 'text-emerald-700': true };
      default: return { 'bg-slate-100': true, 'text-slate-700': true };
    }
  }

  getLeadStatusDotClass(status: string) {
    switch(status) {
      case 'New': return 'bg-amber-600';
      case 'In Progress': return 'bg-blue-600';
      case 'Completed': return 'bg-emerald-600';
      default: return 'bg-slate-600';
    }
  }

  trackByLeadId(index: number, lead: Lead) {
    return lead.id;
  }
}
