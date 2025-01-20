import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaService } from '../../services/empresa/empresa.service';
import { AuthService } from '../../services/auth/auth.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import {Router} from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-crear-almacen',
  templateUrl: './crear-almacen.component.html',
  styleUrls: ['./crear-almacen.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    HeaderComponent
  ]
})
export class CrearAlmacenComponent implements OnInit{
  almacenForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  // @ts-ignore
  idEmpresa: number;
  isLoggedIn: boolean = false;

  constructor(private fb: FormBuilder, private almacenService: EmpresaService, private authService:AuthService,
              private dataShare: DataShareService, private router: Router, private titleService: Title) {
    this.almacenForm = this.fb.group({
      descripcion: ['', Validators.required],
      direccion: ['', Validators.required],
      contacto: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Crear Almacen'); // Ajusta el nombre dinámicamente
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (!this.isLoggedIn) {
      this.router.navigate(['/no-permissions']);
    }
    // @ts-ignore
    const id_user = +sessionStorage.getItem('id_usuario');
    this.authService.cargarPermisos(id_user);

    // @ts-ignore
    this.idEmpresa = +sessionStorage.getItem('id_empresa');

    if (!this.dataShare.permiso15) {
      this.router.navigate(['/no-permissions']);
    }
  }

  onSubmit(): void {
    if (this.almacenForm.valid) {
      const formData = { ...this.almacenForm.value, id_empresa: this.idEmpresa };
      this.almacenService.crearAlmacen(formData).subscribe({
        next: () => {
          this.successMessage = 'Almacén creado exitosamente.';
          this.errorMessage = null;
          this.almacenForm.reset();
        },
        error: (error: any) => {
          console.error('Error al crear el almacén:', error);
          this.errorMessage = 'Ocurrió un error al crear el almacén.';
          this.successMessage = null;
        },
      });
    } else {
      this.errorMessage = 'Por favor, complete el formulario correctamente.';
      this.successMessage = null;
    }
  }


}

