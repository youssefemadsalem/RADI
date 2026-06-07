import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-not-found',
  imports: [CommonModule], // Clean out RouterLink here
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private location = inject(Location);
  private router = inject(Router); 

  goBack(): void {
    this.location.back();
  }

  navigateToShop(): void {
    this.router.navigate(['/shop']);
  }
}