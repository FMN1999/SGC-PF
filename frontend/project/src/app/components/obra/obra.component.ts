import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ObraService } from '../../services/obra/obra.service';

@Component({
  selector: 'app-obra',
  standalone: true,
  templateUrl: './obra.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./obra.component.scss']
})
export class ObraComponent implements OnInit {
  obraForm: FormGroup;
  obra_id: number = 0;
  editMode = false;  // Nuevo: Modo de edición desactivado por defecto

  constructor(
    private fb: FormBuilder,
    private obraService: ObraService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.obraForm = this.fb.group({
      direccion: [{ value: '', disabled: true }, Validators.required],
      id_cliente: [{ value: '', disabled: true }, Validators.required],
      telefono_contacto: [{ value: '', disabled: true }, Validators.required],
      fecha_inicio_est: [{ value: '', disabled: true }],
      fecha_fin_est: [{ value: '', disabled: true }],
      fecha_inicio_real: [{ value: '', disabled: true }],
      fecha_fin_real: [{ value: '', disabled: true }],
      monto_total_est: [{ value: '', disabled: true }],
      monto_total_real: [{ value: '', disabled: true }],
      moneda: [{ value: '', disabled: true }],
      pisos: [{ value: '', disabled: true }, Validators.required],
      dimensions: [{ value: '', disabled: true }, Validators.required],
      estado: [{ value: '', disabled: true }, Validators.required],
      ganancias: [{ value: '', disabled: true }],
      perdidas: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.obra_id = +this.route.snapshot.paramMap.get('id')!;
    this.cargarObra();
  }

  cargarObra(): void {
    this.obraService.obtenerObra(this.obra_id).subscribe((obra: any) => {
      this.obraForm.patchValue({
        direccion: obra.direccion,
        id_cliente: obra.id_cliente,
        telefono_contacto: obra.telefono_contacto,
        fecha_inicio_est: obra.fecha_inicio_est,
        fecha_fin_est: obra.fecha_fin_est,
        fecha_inicio_real: obra.fecha_inicio_real,
        fecha_fin_real: obra.fecha_fin_real,
        monto_total_est: obra.monto_total_est,
        monto_total_real: obra.monto_total_real,
        moneda: obra.moneda,
        pisos: obra.pisos,
        dimensions: obra.dimensions,
        estado: obra.estado,
        ganancias: obra.ganancias,
        perdidas: obra.perdidas
      });
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      // Habilitar los campos editables
      this.obraForm.get('direccion')?.enable();
      this.obraForm.get('telefono_contacto')?.enable();
      this.obraForm.get('fecha_inicio_real')?.enable();
      this.obraForm.get('fecha_fin_real')?.enable();
      this.obraForm.get('monto_total_est')?.enable();
      this.obraForm.get('monto_total_real')?.enable();
      this.obraForm.get('moneda')?.enable();
      this.obraForm.get('pisos')?.enable();
      this.obraForm.get('dimensions')?.enable();
      this.obraForm.get('estado')?.enable();
      this.obraForm.get('ganancias')?.enable();
      this.obraForm.get('perdidas')?.enable();
    } else {
      // Deshabilitar los campos al salir del modo de edición
      this.obraForm.disable();
    }
  }

  onSubmit(): void {
    console.log('actualiza')
    if (this.obraForm.valid && this.editMode) {
      this.obraService.actualizarObra(this.obra_id, this.obraForm.value).subscribe(
          (response: any) => {
          console.log('Obra actualizada:', response);
          this.toggleEditMode();  // Salir del modo de edición después de actualizar
        },
          (error: any) => {
          console.error('Error al actualizar la obra:', error);
        }
      );
    }
  }
}
