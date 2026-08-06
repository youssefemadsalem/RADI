import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Instagram } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
readonly Instagram = Instagram;
}
