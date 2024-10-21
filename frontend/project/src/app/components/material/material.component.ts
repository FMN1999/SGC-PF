import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ProveedorService } from '../../services/proveedor/proveedor.service';
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    DatePipe
  ],
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  material: any;
  editMode: boolean = false;  // Variable para alternar entre modo edición y vista
  materialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private proveedorService: ProveedorService,
    private router: Router
  ) {
    // Definir el formulario reactivo
    this.materialForm = this.fb.group({
      descripcion: ['', Validators.required],
      marca: ['', Validators.required],
      precio: [''],
      moneda: ['', Validators.required],
      fecha_caducidad: [''],
      unidad_medida: ['']
    });
  }

  ngOnInit(): void {
    const materialId = this.route.snapshot.params['id'];
    this.proveedorService.getMaterialById(materialId).subscribe({
      next: (data) => {
        this.material = data;
        // Rellenar el formulario con los datos del material
        this.materialForm.patchValue(data);
      },
      error: (err) => console.error(err)
    });
  }

  // Método para alternar entre modo de vista y edición
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  // Método para enviar los cambios al backend
  onSubmit(): void {
    if (this.materialForm.valid) {
      const updatedMaterial = this.materialForm.value;
      const materialId = this.material.id;
      this.proveedorService.updateMaterial(materialId, updatedMaterial).subscribe({
        next: () => {
          this.material = { ...this.material, ...updatedMaterial };  // Actualizar los datos en la vista
          this.toggleEditMode();  // Volver al modo de visualización
        },
        error: (err) => console.error('Error al actualizar el material', err)
      });
    }
  }

  // Método para volver al perfil del proveedor
  navigateBack(): void {
    const proveedorId = this.material.id_proveedor;  // Asumiendo que el material tiene una referencia al proveedor
    this.router.navigate([`/proveedor/${proveedorId}`]).then(r => {});
  }
}


