import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bold',
  standalone: true
})
export class BoldPipe implements PipeTransform {

  transform(text: string, filter: string): string {
    if (!filter) { return text; }
    const re = new RegExp(filter, 'gi');
    return text.replace(re, "<strong>$&</strong>");
  }
}
