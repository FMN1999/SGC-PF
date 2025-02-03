import { Directive, TemplateRef } from '@angular/core';

@Directive({
  standalone: false,
  selector: '[appAutocompleteContent]'
})
export class AutocompleteContentDirective {
  constructor( public tpl: TemplateRef<any> ) {}
}
