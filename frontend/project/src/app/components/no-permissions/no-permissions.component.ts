import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-no-permissions',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './no-permissions.component.html',
  styleUrls: ['./no-permissions.component.scss'],
})
export class NoPermissionsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirigir automáticamente después de 5 segundos
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 5000);
  }
}

