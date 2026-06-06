import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../navbar/navbar';
import { Footer } from "../../footer/footer"; // Match your file structure exactly
import { CartDrawer } from '../../cart-drawer/cart-drawer';
import { Cart } from '../../../core/service/cart'; // Ensure this path is correct based on your project structure


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer,CartDrawer], // Ensure CartDrawer is imported if you want it in the layout
  templateUrl: './main-layout.html',
})
export class MainLayout {

  public cartService = inject(Cart);



}