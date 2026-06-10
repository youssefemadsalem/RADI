import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/auth';
import { 
  LucideDynamicIcon, 
  LucideLayoutDashboard, 
  LucideShoppingBag, 
  LucideBoxes, 
  LucideUsers, 
  LucideLogOut, 
  LucideBell,
  LucideSettings
} from '@lucide/angular';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  public authService = inject(AuthService);

  // Structural Navigation Icon Sets
  readonly dashboardIcon = LucideLayoutDashboard;
  readonly ordersIcon = LucideShoppingBag;
  readonly inventoryIcon = LucideBoxes;
  readonly customersIcon = LucideUsers;
  readonly logoutIcon = LucideLogOut;
  readonly bellIcon = LucideBell;
  readonly settingsIcon = LucideSettings;

  // Active admin session data proxy computed fields
  get adminEmail(): string {
    return this.authService.currentUser()?.email || 'admin@radi.studio';
  }

  handleAdminLogout(): void {
    this.authService.logout();
  }
}