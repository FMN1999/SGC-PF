import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ObraService } from '../../services/obra/obra.service';
import { EmpresaService } from '../../services/empresa/empresa.service';
import {NgForOf} from "@angular/common"; // Para obtener los clientes

@Component({
  selector: 'app-crear-obra',
  templateUrl: './crear-obra.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./crear-obra.component.scss']
})
export class CrearObraComponent implements OnInit {
  obraForm: FormGroup;
  clientes: any[] = [];

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
      dimensiones: ['', Validators.required]
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
      obraData.id_empresa = sessionStorage.getItem('id_empresa');  // Agregar id_empresa desde sessionStorage
      obraData.estado = 'Nuevo';  // Estado por defecto

      this.obraService.crearObra(obraData).subscribe(response => {
        console.log('Obra creada:', response);
        // Mostrar mensaje de éxito o redirigir
      }, error => {
        console.error('Error al crear la obra:', error);
      });
    }
  }
}
