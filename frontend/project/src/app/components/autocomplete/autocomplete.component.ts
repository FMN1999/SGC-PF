import { Component, ContentChild, ContentChildren, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { OptionComponent } from './option/option.component';
import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  exportAs: 'appAutocomplete'
})
export class AutocompleteComponent {
  @ViewChild('root') rootTemplate!: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective)
  content!: AutocompleteContentDirective;

  @ContentChildren(OptionComponent) options!: QueryList<OptionComponent>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        const clicks$ = options.map((option: any) => option.click$);
        return merge(...clicks$);
      })
    );
  }
}
