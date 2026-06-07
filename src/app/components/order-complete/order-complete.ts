import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-complete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-complete.html',
  styleUrl: './order-complete.css'
})
export class OrderComplete implements OnInit {
  private route = inject(ActivatedRoute); 
  public orderReferenceCode: string = 'RAD-ARCHIVE';

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      if (params['ref']) {
        this.orderReferenceCode = params['ref'];
      }
    });
  }
}