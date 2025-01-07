import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ObraService } from '../../services/obra/obra.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {NgForOf, NgIf} from "@angular/common"; // Para obtener los clientes
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-crear-obra',
  standalone: true,
  templateUrl: './crear-obra.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    HeaderComponent,
    NgIf
  ],
  styleUrls: ['./crear-obra.component.scss']
})
export class CrearObraComponent implements OnInit {
  obraForm: FormGroup;
  clientes: any[] = [];
  mensajeExito: string='';
  mensajeError: string='';

  constructor(private fb: FormBuilder, private obraService: ObraService, private empresaService: EmpresaService) {
    this.obraForm = this.fb.group({
      direccion: ['', Validators.required],
      id_cliente: ['', Validators.required],
      telefono_contacto: ['', Validators.required],
      fecha_inicio_est: [''],
      fecha_fin_est: [''],
      monto_total_est: [''],
      moneda: [''],
      pisos: ['', Validators.required],
      dimensiones: [''],
      tipo_obra:['']
    });
  }

  ngOnInit(): void {
    const id_empresa = sessionStorage.getItem('id_empresa');
    if (id_empresa) {
      this.empresaService.obtenerClientes(parseInt(id_empresa)).subscribe((clientes: any) => {
        console.log(clientes)
        this.clientes = clientes;
      });
    }
  }

onSubmit(): void {
    if (this.obraForm.valid) {
      const obraData = this.obraForm.value;
      obraData.id_empresa = sessionStorage.getItem('id_empresa');
      obraData.estado = 'Nuevo';

      this.obraService.crearObra(obraData).subscribe(
        (response) => {
          this.mensajeExito = 'La obra se ha creado exitosamente.';
          this.mensajeError = '';
          this.obraForm.reset();
        },
        (error) => {
          this.mensajeError = 'Error al crear la obra. Por favor, inténtelo de nuevo.';
          this.mensajeExito = '';
        }
      );
    }
  }
}
