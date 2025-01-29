import { NgForOf, NgIf } from "@angular/common";
import { Component, forwardRef, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';

@Component({
  selector: 'app-input-autocompletar',
  imports: [
    FormsModule,
    AutocompleteModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './input-autocompletar.component.html',
  styleUrl: './autocompletar.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocompletarComponent),
      multi: true
    }
  ]
})
export class InputAutocompletarComponent implements ControlValueAccessor, OnInit {
  @Input() formGroup!: FormGroup;
  control!: FormControl;
  @Input() formControlName!: string;
  @Input() required: boolean = false;
  @Input() opciones: string[] = [];

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor(public controlContainer: ControlContainer) {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: string): void {}

  ngOnInit() {
    this.formGroup = <FormGroup>this.controlContainer.control;
    this.control = <FormControl>this.formGroup.get(this.formControlName);
  }
}

