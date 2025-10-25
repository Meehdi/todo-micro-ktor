import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar></app-sidebar>
      <app-header></app-header>
      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      margin-left: var(--sidebar-width);
      margin-top: var(--header-height);
      padding: 1.5rem;
      flex: 1;
      min-height: calc(100vh - var(--header-height));
      max-width: 100%;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 1rem;
      }
    }
  `]
})
export class LayoutComponent {}
