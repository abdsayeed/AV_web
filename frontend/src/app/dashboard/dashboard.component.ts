import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';

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
  imports: [CommonModule],
  template: `
    <!-- Dashboard Layout -->
    <div class="dashboard">
      
      <!-- Sidebar Navigation -->
      <aside class="dashboard__sidebar">
        <div class="sidebar__header">
          <div class="sidebar__logo" (click)="goToHome()">
            <img src="assets/logo.png" alt="Aries Ventures" class="logo__image">
            <span class="logo__text">Aries Ventures</span>
          </div>
        </div>
        
        <nav class="sidebar__nav">
          <ul class="nav__list">
            <li class="nav__item">
              <button (click)="setActiveSection('overview')" 
                      [class.nav__link--active]="activeSection === 'overview'"
                      class="nav__link">
                <span class="material-symbols-outlined nav__icon">dashboard</span>
                <span class="nav__text">Overview</span>
              </button>
            </li>
            <li class="nav__item">
              <button (click)="setActiveSection('projects')" 
                      [class.nav__link--active]="activeSection === 'projects'"
                      class="nav__link">
                <span class="material-symbols-outlined nav__icon">folder</span>
                <span class="nav__text">Projects</span>
              </button>
            </li>
            <li class="nav__item">
              <button (click)="viewTemplates()" class="nav__link">
                <span class="material-symbols-outlined nav__icon">palette</span>
                <span class="nav__text">Templates</span>
              </button>
            </li>
            <li class="nav__item">
              <button (click)="setActiveSection('messages')" 
                      [class.nav__link--active]="activeSection === 'messages'"
                      class="nav__link">
                <span class="material-symbols-outlined nav__icon">mail</span>
                <span class="nav__text">Messages</span>
              </button>
            </li>
            <li class="nav__item">
              <button (click)="goToProfile()" class="nav__link">
                <span class="material-symbols-outlined nav__icon">settings</span>
                <span class="nav__text">Settings</span>
              </button>
            </li>
            <li class="nav__item">
              <button (click)="contactSupport()" class="nav__link">
                <span class="material-symbols-outlined nav__icon">help</span>
                <span class="nav__text">Help</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div class="sidebar__footer">
          <button (click)="goToHome()" class="nav__link nav__link--secondary">
            <span class="material-symbols-outlined nav__icon">home</span>
            <span class="nav__text">Back to Website</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="dashboard__main">
        
        <!-- Top Header -->
        <header class="dashboard__header">
          <div class="header__left">
            <button class="mobile-menu-toggle" (click)="toggleMobileMenu()">
              <span class="material-symbols-outlined">menu</span>
            </button>
            <div class="header__search">
              <span class="material-symbols-outlined search__icon">search</span>
              <input type="text" placeholder="Search projects, messages..." class="search__input">
            </div>
          </div>
          
          <div class="header__right">
            <div class="header__user">
              <div class="user__info">
                <span class="user__name">{{ user?.name || 'User' }}</span>
                <span class="user__email">{{ user?.email || 'user@example.com' }}</span>
              </div>
              <div class="user__avatar">
                <span class="material-symbols-outlined">person</span>
              </div>
              <button (click)="logout()" class="user__logout">
                <span class="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Dashboard Content -->
        <div class="dashboard__content">
          
          <!-- Overview Section -->
          <section *ngIf="activeSection === 'overview'" class="content-section">
            
            <!-- Welcome Message -->
            <div class="welcome-section">
              <h1 class="welcome__title">
                Welcome back, {{ user?.name || 'User' }}! 👋
              </h1>
              <p class="welcome__subtitle">
                Here's what's happening with your projects today.
              </p>
            </div>

            <!-- Key Metrics -->
            <div class="metrics-grid">
              <div *ngFor="let metric of metrics; trackBy: trackByMetricTitle" 
                   class="metric-card" 
                   [ngClass]="'metric-card--' + metric.color">
                <div class="metric-card__icon">
                  <span class="material-symbols-outlined">{{ metric.icon }}</span>
                </div>
                <div class="metric-card__content">
                  <h3 class="metric-card__title">{{ metric.title }}</h3>
                  <p class="metric-card__value">{{ metric.value }}</p>
                  <div class="metric-card__change" *ngIf="metric.change">
                    <span [ngClass]="'trend--' + metric.change.trend">
                      <span class="material-symbols-outlined trend__icon">
                        {{ metric.change.trend === 'up' ? 'trending_up' : 'trending_down' }}
                      </span>
                      {{ metric.change.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Grid -->
            <div class="content-grid">
              
              <!-- Your Projects -->
              <div class="content-card">
                <div class="card__header">
                  <h2 class="card__title">Your Projects</h2>
                  <button (click)="startNewProject()" class="btn btn--primary btn--sm">
                    <span class="material-symbols-outlined">add</span>
                    New Project
                  </button>
                </div>
                
                <div class="projects-list">
                  <div *ngIf="projects.length === 0" class="empty-state">
                    <span class="material-symbols-outlined empty-state__icon">folder_open</span>
                    <h3 class="empty-state__title">No projects yet</h3>
                    <p class="empty-state__description">Start your first project to see it here</p>
                    <button (click)="startNewProject()" class="btn btn--primary">
                      Start Your First Project
                    </button>
                  </div>
                  
                  <div *ngFor="let project of projects; trackBy: trackByProjectId" 
                       class="project-card">
                    <div class="project-card__header">
                      <h3 class="project-card__title">{{ project.name }}</h3>
                      <span class="status-badge" [ngClass]="'status--' + project.status">
                        {{ getStatusText(project.status) }}
                      </span>
                    </div>
                    
                    <div class="project-card__meta">
                      <span class="meta-item">
                        <span class="material-symbols-outlined meta-icon">schedule</span>
                        Submitted {{ project.submittedDate | date:'MMM d' }}
                      </span>
                      <span class="meta-item">
                        <span class="material-symbols-outlined meta-icon">tag</span>
                        {{ project.referenceNumber }}
                      </span>
                    </div>
                    
                    <div class="project-card__footer">
                      <button (click)="viewProject(project.id)" class="btn btn--primary btn--sm">
                        View Details
                      </button>
                      <button (click)="messageProject(project.id)" class="btn btn--ghost btn--sm">
                        <span class="material-symbols-outlined">message</span>
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Activity & Quick Actions -->
              <div class="sidebar-content">
                
                <!-- Quick Actions -->
                <div class="content-card">
                  <h3 class="card__title">Quick Actions</h3>
                  <div class="quick-actions">
                    <button (click)="startNewProject()" class="quick-action">
                      <span class="material-symbols-outlined">rocket_launch</span>
                      <span>New Project</span>
                    </button>
                    <button (click)="viewTemplates()" class="quick-action">
                      <span class="material-symbols-outlined">palette</span>
                      <span>Browse Templates</span>
                    </button>
                    <button (click)="contactSupport()" class="quick-action">
                      <span class="material-symbols-outlined">support_agent</span>
                      <span>Contact Support</span>
                    </button>
                    <button (click)="goToProfile()" class="quick-action">
                      <span class="material-symbols-outlined">settings</span>
                      <span>Account Settings</span>
                    </button>
                  </div>
                </div>

                <!-- Recent Activity -->
                <div class="content-card">
                  <h3 class="card__title">Recent Activity</h3>
                  <div class="activity-feed">
                    <div *ngIf="activities.length === 0" class="empty-state empty-state--sm">
                      <span class="material-symbols-outlined empty-state__icon">history</span>
                      <p class="empty-state__description">No recent activity</p>
                    </div>
                    
                    <div *ngFor="let activity of activities; trackBy: trackByActivityId" 
                         class="activity-item">
                      <div class="activity__icon">
                        <span class="material-symbols-outlined">
                          {{ getActivityIcon(activity.type) }}
                        </span>
                      </div>
                      <div class="activity__content">
                        <p class="activity__title">{{ activity.title }}</p>
                        <p class="activity__description">{{ activity.description }}</p>
                        <span class="activity__time">{{ getRelativeTime(activity.timestamp) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </section>

          <!-- Projects Section -->
          <section *ngIf="activeSection === 'projects'" class="content-section">
            <div class="section-header">
              <h1 class="section-title">Projects</h1>
              <button (click)="startNewProject()" class="btn btn--primary">
                <span class="material-symbols-outlined">add</span>
                New Project
              </button>
            </div>
            
            <div class="projects-grid">
              <div *ngFor="let project of projects; trackBy: trackByProjectId" 
                   class="project-card project-card--detailed">
                <!-- Project card content similar to above but more detailed -->
              </div>
            </div>
          </section>

          <!-- Messages Section -->
          <section *ngIf="activeSection === 'messages'" class="content-section">
            <div class="section-header">
              <h1 class="section-title">Messages</h1>
            </div>
            
            <div class="messages-container">
              <div class="empty-state">
                <span class="material-symbols-outlined empty-state__icon">mail</span>
                <h3 class="empty-state__title">No messages yet</h3>
                <p class="empty-state__description">Messages from our team will appear here</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <!-- Mobile Sidebar Overlay -->
      <div *ngIf="mobileMenuOpen" class="mobile-overlay" (click)="toggleMobileMenu()"></div>
      <aside *ngIf="mobileMenuOpen" class="dashboard__sidebar dashboard__sidebar--mobile">
        <!-- Same sidebar content as desktop -->
      </aside>

    </div>
  `,
  styles: [`
    /* ===== DESIGN TOKENS - MATCHING HOME PAGE THEME ===== */
    :host {
      /* Primary Colors - Matching home page gradient theme */
      --primary-dark: #0f172a;      /* slate-900 */
      --primary: #1e3a8a;           /* blue-900 */
      --primary-light: #3b82f6;     /* blue-500 */
      --primary-accent: #60a5fa;    /* blue-400 */
      
      /* Background Gradients - Matching home page */
      --bg-gradient: linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a);
      --nav-gradient: linear-gradient(to right, #0f172a, #1e3a8a, #0f172a);
      
      /* Glass morphism effects */
      --glass-bg: rgba(255, 255, 255, 0.1);
      --glass-border: rgba(255, 255, 255, 0.2);
      --glass-hover: rgba(255, 255, 255, 0.2);
      
      /* Text Colors */
      --text-primary: #ffffff;
      --text-secondary: #cbd5e1;     /* slate-300 */
      --text-muted: #94a3b8;         /* slate-400 */
      --text-accent: #60a5fa;        /* blue-400 */
      
      /* Status Colors */
      --success: #10b981;            /* emerald-500 */
      --warning: #f59e0b;            /* amber-500 */
      --error: #ef4444;              /* red-500 */
      --info: #3b82f6;               /* blue-500 */
      
      /* Spacing (8px grid) */
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.5rem;
      --space-6: 2rem;
      --space-8: 3rem;
      --space-10: 4rem;
      
      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
      --shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.5);
      
      /* Border Radius */
      --radius-sm: 0.25rem;
      --radius-md: 0.5rem;
      --radius-lg: 0.75rem;
      --radius-xl: 1rem;
      --radius-2xl: 1.5rem;
      --radius-full: 9999px;
      
      /* Typography */
      --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* ===== DASHBOARD LAYOUT ===== */
    .dashboard {
      display: flex;
      min-height: 100vh;
      background: var(--bg-gradient);
      font-family: var(--font-family);
    }

    /* ===== SIDEBAR ===== */
    .dashboard__sidebar {
      width: 16rem;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-right: 1px solid var(--glass-border);
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      z-index: 40;
      display: flex;
      flex-direction: column;
    }

    .sidebar__header {
      padding: var(--space-5);
      border-bottom: 1px solid var(--glass-border);
    }

    .sidebar__logo {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .sidebar__logo:hover {
      opacity: 0.8;
    }

    .logo__image {
      width: 2.5rem;
      height: 2.5rem;
      object-fit: contain;
    }

    .logo__text {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sidebar__nav {
      flex: 1;
      padding: var(--space-4) 0;
    }

    .nav__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav__item {
      margin-bottom: var(--space-1);
    }

    .nav__link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-5);
      color: var(--text-secondary);
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      position: relative;
      border-radius: var(--radius-md);
      margin: 0 var(--space-2);
    }

    .nav__link:hover {
      background: var(--glass-hover);
      color: var(--text-primary);
      transform: translateX(4px);
    }

    .nav__link--active {
      background: var(--primary-light);
      color: var(--text-primary);
      font-weight: 600;
      box-shadow: var(--shadow-md);
    }

    .nav__link--active::before {
      content: '';
      position: absolute;
      left: -var(--space-2);
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--primary-accent);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }

    .nav__icon {
      font-size: 1.25rem;
      color: inherit;
    }

    .nav__text {
      flex: 1;
    }

    .nav__badge {
      background: var(--error);
      color: var(--text-primary);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-full);
      min-width: 1.25rem;
      text-align: center;
    }

    .nav__link--secondary {
      color: var(--text-muted);
      font-size: 0.8125rem;
    }

    .sidebar__footer {
      padding: var(--space-4) 0;
      border-top: 1px solid var(--glass-border);
    }

    /* ===== MAIN CONTENT ===== */
    .dashboard__main {
      margin-left: 16rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .dashboard__header {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--glass-border);
      padding: var(--space-4) var(--space-6);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .header__left {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      padding: var(--space-2);
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }

    .mobile-menu-toggle:hover {
      background: var(--glass-hover);
      color: var(--text-primary);
    }

    .header__search {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search__icon {
      position: absolute;
      left: var(--space-3);
      color: var(--text-muted);
      font-size: 1.25rem;
      pointer-events: none;
    }

    .search__input {
      padding: var(--space-2) var(--space-3) var(--space-2) 2.5rem;
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      background: var(--glass-bg);
      backdrop-filter: blur(8px);
      font-size: 0.875rem;
      width: 20rem;
      transition: all 0.2s;
      color: var(--text-primary);
    }

    .search__input::placeholder {
      color: var(--text-muted);
    }

    .search__input:focus {
      outline: none;
      border-color: var(--primary-accent);
      box-shadow: var(--shadow-focus);
      background: var(--glass-hover);
    }

    .header__right {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .header__notification {
      position: relative;
      background: none;
      border: none;
      padding: var(--space-2);
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }

    .header__notification:hover {
      background: var(--glass-hover);
      color: var(--text-primary);
    }

    .notification__badge {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--error);
      color: var(--text-primary);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-full);
      min-width: 1.25rem;
      text-align: center;
      transform: translate(25%, -25%);
    }

    .header__user {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .user__info {
      text-align: right;
    }

    .user__name {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .user__email {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .user__avatar {
      width: 2.5rem;
      height: 2.5rem;
      background: var(--primary-light);
      color: var(--text-primary);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .user__logout {
      background: none;
      border: none;
      padding: var(--space-2);
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }

    .user__logout:hover {
      background: var(--glass-hover);
      color: var(--error);
    }

    /* ===== CONTENT AREA ===== */
    .dashboard__content {
      flex: 1;
      padding: var(--space-6);
    }

    .content-section {
      animation: fadeIn 0.3s ease-out;
    }

    .welcome-section {
      margin-bottom: var(--space-8);
    }

    .welcome__title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .welcome__subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-6);
    }

    .section-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    /* ===== METRICS GRID ===== */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-5);
      margin-bottom: var(--space-8);
    }

    .metric-card {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-radius: var(--radius-2xl);
      padding: var(--space-5);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--glass-border);
      display: flex;
      gap: var(--space-4);
      transition: all 0.2s;
      animation: fadeIn 0.3s ease-out;
    }

    .metric-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
      background: var(--glass-hover);
    }

    .metric-card__icon {
      width: 3rem;
      height: 3rem;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .metric-card--blue .metric-card__icon {
      background: rgba(59, 130, 246, 0.2);
      color: var(--primary-accent);
    }

    .metric-card--green .metric-card__icon {
      background: rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    .metric-card--purple .metric-card__icon {
      background: rgba(139, 92, 246, 0.2);
      color: #a78bfa;
    }

    .metric-card--orange .metric-card__icon {
      background: rgba(245, 158, 11, 0.2);
      color: var(--warning);
    }

    .metric-card__content {
      flex: 1;
    }

    .metric-card__title {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
      margin: 0 0 var(--space-2) 0;
    }

    .metric-card__value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .metric-card__change {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .trend--up {
      color: var(--success);
    }

    .trend--down {
      color: var(--error);
    }

    .trend--neutral {
      color: var(--text-muted);
    }

    .trend__icon {
      font-size: 1rem;
    }

    /* ===== CONTENT GRID ===== */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-6);
    }

    .sidebar-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .content-card {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border-radius: var(--radius-2xl);
      padding: var(--space-6);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--glass-border);
    }

    .card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-5);
    }

    .card__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    /* ===== PROJECT CARDS ===== */
    .projects-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .project-card {
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      transition: all 0.2s;
      animation: fadeIn 0.3s ease-out;
      background: rgba(255, 255, 255, 0.05);
    }

    .project-card:hover {
      border-color: var(--primary-accent);
      box-shadow: var(--shadow-md);
      background: var(--glass-hover);
    }

    .project-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }

    .project-card__title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .project-card__meta {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .meta-icon {
      font-size: 1rem;
    }

    .project-card__footer {
      display: flex;
      gap: var(--space-2);
    }

    /* ===== STATUS BADGES ===== */
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .status--submitted {
      background: rgba(59, 130, 246, 0.2);
      color: var(--primary-accent);
    }

    .status--in_progress {
      background: rgba(245, 158, 11, 0.2);
      color: var(--warning);
    }

    .status--completed {
      background: rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    .status--draft {
      background: rgba(148, 163, 184, 0.2);
      color: var(--text-muted);
    }

    /* ===== BUTTONS ===== */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-xl);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      text-decoration: none;
      justify-content: center;
    }

    .btn--sm {
      padding: var(--space-1) var(--space-3);
      font-size: 0.8125rem;
    }

    .btn--primary {
      background: var(--primary-light);
      color: var(--text-primary);
    }

    .btn--primary:hover {
      background: var(--primary-accent);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn--ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--glass-border);
    }

    .btn--ghost:hover {
      background: var(--glass-hover);
      border-color: var(--primary-accent);
      color: var(--text-primary);
    }

    /* ===== QUICK ACTIONS ===== */
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .quick-action {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      background: none;
      border: none;
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .quick-action:hover {
      background: var(--glass-hover);
      color: var(--text-primary);
      transform: translateX(4px);
    }

    /* ===== ACTIVITY FEED ===== */
    .activity-feed {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .activity-item {
      display: flex;
      gap: var(--space-3);
    }

    .activity__icon {
      width: 2rem;
      height: 2rem;
      background: rgba(59, 130, 246, 0.2);
      color: var(--primary-accent);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .activity__content {
      flex: 1;
    }

    .activity__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--space-1) 0;
    }

    .activity__description {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin: 0 0 var(--space-1) 0;
    }

    .activity__time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* ===== EMPTY STATES ===== */
    .empty-state {
      text-align: center;
      padding: var(--space-8);
    }

    .empty-state--sm {
      padding: var(--space-6);
    }

    .empty-state__icon {
      font-size: 3rem;
      color: var(--text-muted);
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }

    .empty-state__title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 var(--space-2) 0;
    }

    .empty-state__description {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0 0 var(--space-4) 0;
    }

    /* ===== ANIMATIONS ===== */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ===== MOBILE RESPONSIVE ===== */
    .mobile-overlay {
      display: none;
    }

    .dashboard__sidebar--mobile {
      display: none;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .search__input {
        width: 16rem;
      }
    }

    @media (max-width: 768px) {
      .dashboard__sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s;
      }

      .dashboard__sidebar--mobile {
        display: flex;
        transform: translateX(0);
      }

      .dashboard__main {
        margin-left: 0;
      }

      .mobile-menu-toggle {
        display: block;
      }

      .mobile-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 30;
      }

      .dashboard__content {
        padding: var(--space-4);
      }

      .metrics-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }

      .search__input {
        width: 12rem;
      }

      .user__info {
        display: none;
      }

      .welcome__title {
        font-size: 1.5rem;
      }

      .section-title {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 640px) {
      .header__search {
        display: none;
      }

      .project-card__footer {
        flex-direction: column;
      }

      .card__header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }
    }

    /* ===== FOCUS STATES ===== */
    *:focus-visible {
      outline: 2px solid var(--primary-accent);
      outline-offset: 2px;
    }

    /* ===== ACCESSIBILITY ===== */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Component state
  user: any = null;
  activeSection: 'overview' | 'projects' | 'messages' = 'overview';
  mobileMenuOpen = false;
  
  // Notifications - removed dummy data
  hasNotifications = false;
  notificationCount = 0;
  unreadMessages = 0;

  // Data arrays - removed dummy data, will be populated from API
  metrics: MetricCardData[] = [];
  projects: Project[] = [];
  activities: Activity[] = [];

  ngOnInit() {
    // Subscribe to current user
    this.apiService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadDashboardData();
      }
    });

    // Load user data if not already loaded
    if (this.apiService.isAuthenticated()) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    // Load user data from API
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Loading user data...');
      // TODO: Implement real API call
      // this.apiService.getCurrentUser().subscribe(user => this.user = user);
    }
  }

  private loadDashboardData() {
    // Load dashboard metrics, projects, and activities from API
    this.loadMetrics();
    this.loadProjects();
    this.loadActivities();
  }

  private loadMetrics() {
    // TODO: Replace with real API call
    // For now, show empty state
    this.metrics = [];
  }

  private loadProjects() {
    // TODO: Replace with real API call
    // For now, show empty state
    this.projects = [];
  }

  private loadActivities() {
    // TODO: Replace with real API call
    // For now, show empty state
    this.activities = [];
  }

  // Navigation methods
  setActiveSection(section: 'overview' | 'projects' | 'messages') {
    this.activeSection = section;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Action methods
  startNewProject() {
    this.router.navigate(['/contact']);
  }

  viewTemplates() {
    // Navigate to home page and scroll to templates section
    this.router.navigate(['/']).then(() => {
      // Wait for navigation and DOM to be ready, then scroll to templates
      setTimeout(() => {
        const templatesSection = document.getElementById('templates');
        if (templatesSection) {
          templatesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // If templates section not found, try again after a longer delay
          setTimeout(() => {
            const templatesSection = document.getElementById('templates');
            if (templatesSection) {
              templatesSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 500);
        }
      }, 200);
    });
  }

  contactSupport() {
    this.router.navigate(['/help']);
  }

  viewProject(projectId: string) {
    // Navigate to project details (to be implemented)
    console.log('View project:', projectId);
  }

  messageProject(projectId: string) {
    // Open messaging for project (to be implemented)
    console.log('Message project:', projectId);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToDashboard() {
    // Already on dashboard, refresh or do nothing
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  // Handle notification click (placeholder for future implementation)
  handleNotificationClick() {
    // TODO: Implement notification handling when notifications are added
    console.log('Notifications clicked - no notifications available');
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      }
    });
  }

  // Utility methods
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

    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else {
      return 'Just now';
    }
  }

  // TrackBy functions for performance
  trackByMetricTitle(index: number, metric: MetricCardData): string {
    return metric.title;
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  trackByActivityId(index: number, activity: Activity): string {
    return activity.id;
  }
}