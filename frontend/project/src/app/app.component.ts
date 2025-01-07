import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Importa CommonModule

@Component({
    selector: 'app-root',
    imports: [RouterModule, CommonModule], // Asegúrate de importar CommonModule
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}
