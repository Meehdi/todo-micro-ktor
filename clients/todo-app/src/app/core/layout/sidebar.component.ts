import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, CheckSquare, Archive } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <lucide-icon [img]="CheckSquare" [size]="24" [strokeWidth]="2" class="logo-icon"></lucide-icon>
          <span class="logo-text">TodoApp</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a
          routerLink="/todos"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-item">
          <lucide-icon [img]="LayoutDashboard" [size]="20" [strokeWidth]="2"></lucide-icon>
          <span>Dashboard</span>
        </a>

        <a
          routerLink="/todos"
          routerLinkActive="active"
          class="nav-item">
          <lucide-icon [img]="CheckSquare" [size]="20" [strokeWidth]="2"></lucide-icon>
          <span>All Todos</span>
        </a>

        <div class="nav-divider"></div>

        <a href="#" class="nav-item">
          <lucide-icon [img]="Archive" [size]="20" [strokeWidth]="2"></lucide-icon>
          <span>Archived</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: var(--sidebar-width);
      height: 100vh;
      background-color: var(--color-sidebar-bg);
      color: var(--color-sidebar-text);
      display: flex;
      flex-direction: column;
      z-index: 20;
      box-shadow: var(--shadow-md);
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      color: var(--color-primary);
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-sidebar-text-active);
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      color: var(--color-sidebar-text);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-item:hover {
      background-color: var(--color-sidebar-hover);
      color: var(--color-sidebar-text-active);
    }

    .nav-item.active {
      background-color: var(--color-sidebar-active);
      color: var(--color-sidebar-text-active);
    }

    .nav-divider {
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
      margin: 0.5rem 0;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s;
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  readonly LayoutDashboard = LayoutDashboard;
  readonly CheckSquare = CheckSquare;
  readonly Archive = Archive;
}
