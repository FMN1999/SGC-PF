import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { ObraService } from '../../services/obra/obra.service';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-obra',
  standalone: true,
  templateUrl: './obra.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    DatePipe,
    RouterLink
  ],
  styleUrls: ['./obra.component.scss']
})
export class ObraComponent implements OnInit {
  obraForm: FormGroup;
  areaForm: FormGroup; // Formulario para el alta de área
  obra_id: number = 0;
  editMode = false;  // Nuevo: Modo de edición desactivado por defecto
  areas: any[] = [];  // Array para almacenar las áreas
  notaForm: FormGroup;
  notas: any[] = [];
  documentoForm!: FormGroup;
  documentos: any[] = []; // Lista de documentos para mostrar
  presupuestos: any[] = [];

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

    this.notaForm = this.fb.group({
      descripcion: ['', Validators.required],
      fotos: this.fb.array([]),
    });

    this.areaForm = this.fb.group({
      descripcion: ['', Validators.required],
      dimensiones: ['', Validators.required],
      estado: ['', Validators.required],
      porcentaje: [0, Validators.required]
    });


  }

  ngOnInit(): void {
    this.obra_id = +this.route.snapshot.paramMap.get('id')!;
    this.cargarObra();
    this.cargarAreas();
    this.documentoForm = this.fb.group({
      nombre: [''],
      link: [''],
      descripcion: [''],
      tipo_archivo: [''],
      id_obra:this.obra_id
    });
    this.cargarNotas();  // Cargar las notas de la obra
    this.cargarDocumentos();
    this.obraService.getPresupuestosPorObra(this.obra_id).subscribe(
    (data) => {
      this.presupuestos = data;
    },
    (error) => {
      console.error('Error al obtener presupuestos:', error);
    }
  );
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

  cargarAreas(): void {
    this.obraService.obtenerAreasPorObra(this.obra_id).subscribe((areas: any[]) => {
      this.areas = areas;
    });
  }

  crearArea(): void {
    if (this.areaForm.valid) {
      const areaData = {
        ...this.areaForm.value,
        id_obra: this.obra_id // Relacionar área con la obra actual
      };
      this.obraService.crearArea(areaData).subscribe(
          (response: any) => {
          console.log('Área creada:', response);
          this.areaForm.reset(); // Resetear formulario
        },
          (error: any) => {
          console.error('Error al crear el área:', error);
        }
      );
    }

  }

  eliminarArea(areaId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta área?')) {
      this.obraService.eliminarArea(areaId).subscribe(
        (response) => {
          console.log(response.message);
          this.areas = this.areas.filter(area => area.id !== areaId);  // Actualiza la lista de áreas en la vista
        },
        (error) => {
          console.error('Error al eliminar el área:', error);
        }
      );
    }
  }

  // Método para agregar un control de foto al formulario de notas
  get fotos(): FormArray {
    return this.notaForm.get('fotos') as FormArray;
  }

  agregarFoto(): void {
    this.fotos.push(this.fb.control(''));
  }

  eliminarFoto(index: number): void {
    this.fotos.removeAt(index);
  }

  // Método para guardar la nota y sus fotos
  guardarNota() {
    const id_usuario = Number(sessionStorage.getItem('id_usuario'));
    const descripcion = this.notaForm.get('descripcion')?.value;
    const id_obra = this.obra_id;  // Agrega el id_obra

    this.obraService.agregarNota(id_usuario, descripcion, id_obra).subscribe((nota) => {
        const fotos = this.notaForm.get('fotos')?.value;
        // @ts-ignore
        fotos.forEach((url: string) => {
            this.obraService.agregarFoto(nota.id, url).subscribe();
        });
        this.notaForm.reset();
    });
  }

  cargarNotas(): void {
    this.obraService.obtenerNotasPorObra(this.obra_id).subscribe((notas) => {
        this.notas = notas;
    });
  }

  eliminarNota(notaId: number): void {
    this.obraService.eliminarNota(notaId).subscribe(
      () => {
        console.log(`Nota ${notaId} eliminada correctamente`);
        // Actualiza la lista de notas después de la eliminación
        this.notas = this.notas.filter(nota => nota.id !== notaId);
      },
      (error) => {
        console.error('Error al eliminar la nota:', error);
      }
    );
  }

  guardarDocumento(): void {
    const id_usuario = Number(sessionStorage.getItem('id_usuario')); // id_usuario del sessionStorage
    const documento = { id_usuario, ...this.documentoForm.value };

    this.obraService.agregarDocumento(documento).subscribe(
      (response) => {
        console.log('Documento guardado:', response);
        this.documentoForm.reset();
      },
      (error) => {
        console.error('Error al guardar el documento:', error);
      }
    );
  }

  cargarDocumentos(): void {
    this.obraService.obtenerDocumentosPorObra(this.obra_id).subscribe(
      (documentos) => {
        this.documentos = documentos;
      },
      (error) => {
        console.error('Error al obtener documentos:', error);
      }
    );
  }

  eliminarDocumento(id_documento: number): void {
    this.obraService.eliminarDocumento(id_documento).subscribe(
      () => {
        // Filtrar el documento eliminado de la lista de documentos
        this.documentos = this.documentos.filter(doc => doc.id !== id_documento);
      },
      (error) => {
        console.error('Error al eliminar el documento:', error);
      }
    );
  }

  crearPresupuesto(): void {
    this.router.navigate(['/crear-presupuesto'], {queryParams: {obra_id: this.obra_id}}).then(r =>{});
   }
}
