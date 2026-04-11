import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CartService } from '@nx-ecom-app/data-access';
import { NavbarComponent } from '@nx-ecom-app/design-system';

@Component({
  imports: [RouterModule, AsyncPipe, NavbarComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  cartService = inject(CartService);
}
