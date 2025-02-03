import { Pipe, PipeTransform } from '@angular/core';

import { transliterate } from 'transliteration'; // Para eliminar los acentos

@Pipe({
  standalone: false,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  // Realiza el filtrado de opciones sin tener en cuenta los acentos
  transform(items: any[], searchTerm: string): any {
    if (searchTerm === null) {
      searchTerm = '';
    }
    searchTerm = transliterate(searchTerm).toLowerCase().trim()
    if (!items || !searchTerm) {
      return items;
    }
    return items.filter(
      item =>
        transliterate(item)
          .toLowerCase()
          .trim()
          .includes(searchTerm) === true
    );
  }
}
