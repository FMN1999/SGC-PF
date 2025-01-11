import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import {NgIf} from "@angular/common";
import { HeaderComponent } from '../header/header.component';
import * as console from "node:console";
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-alta-empresa',
  templateUrl: './crear-empresa.component.html',
  styleUrls: ['./crear-empresa.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    HeaderComponent
  ]
})
export class CrearEmpresaComponent implements OnInit {
  empresaForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoggedIn: boolean = false;

  constructor(private fb: FormBuilder, private empresaService: EmpresaService, private authService:AuthService,
              private dataShare: DataShareService, private router: Router) {
    this.empresaForm = this.fb.group({
      denominacion: ['', Validators.required],
      cuit: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      this.empresaService.crearEmpresa(this.empresaForm.value).subscribe({
        next: (data) => {
          this.successMessage = 'Empresa creada exitosamente.';
          this.errorMessage = null;
          this.empresaForm.reset();
        },
        error: (error) => {
          console.error('Error al crear la empresa:', error);
          this.errorMessage = 'Ocurrió un error al crear la empresa.';
          this.successMessage = null;
        },
      });
    } else {
      this.errorMessage = 'Por favor, complete el formulario correctamente.';
      this.successMessage = null;
    }
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }

    if (!this.dataShare.permiso16) {
      this.router.navigate(['/no-permissions']);
    }
  }
}

