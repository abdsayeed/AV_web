import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

// Interfaces for type safety
interface MetricCardData {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface Project {
  id: string;
  name: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'completed';
  template?: string;
  submittedDate: Date;
  lastUpdated: Date;
  referenceNumber: string;
}

interface Activity {
  id: string;
  type: 'submission' | 'message' | 'update';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'completed' | 'pending' | 'failed';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.Default // Was default
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Component state
  user: any = null;
  activeSection: 'overview' | 'projects' | 'messages' = 'overview';
  mobileMenuOpen = false;
  
  // Notifications
  hasNotifications = false;
  notificationCount = 0;
  unreadMessages = 0;

  // Data arrays
  metrics: MetricCardData[] = [];
  projects: Project[] = [];
  activities: Activity[] = [];

  ngOnInit() {
    this.apiService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadDashboardData();
      }
    });

    if (this.apiService.isAuthenticated()) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      // Mock loading state
    }
  }

  private loadDashboardData() {
    this.loadMetrics();
    this.loadProjects();
    this.loadActivities();
  }

  private loadMetrics() {
    this.metrics = [];
  }

  private loadProjects() {
    this.projects = [];
  }

  private loadActivities() {
    this.activities = [];
  }

  // Navigation methods
  setActiveSection(section: 'overview' | 'projects' | 'messages') {
    this.activeSection = section;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  startNewProject() {
    this.router.navigate(['/onboarding']);
  }

  viewTemplates() {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const templatesSection = document.getElementById('templates');
        if (templatesSection) {
          templatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    });
  }

  contactSupport() {
    this.router.navigate(['/help']);
  }

  viewProject(projectId: string) {
    console.log('View project:', projectId);
  }

  messageProject(projectId: string) {
    console.log('Message project:', projectId);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'submitted': 'Submitted',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'draft': 'Draft'
    };
    return statusMap[status] || status;
  }

  getActivityIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'submission': 'send',
      'message': 'mail',
      'update': 'update'
    };
    return iconMap[type] || 'info';
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    else if (hours > 0) return `${hours} hours ago`;
    else return 'Just now';
  }

  trackByMetricTitle(index: number, metric: MetricCardData): string { return metric.title; }
  trackByProjectId(index: number, project: Project): string { return project.id; }
  trackByActivityId(index: number, activity: Activity): string { return activity.id; }
}