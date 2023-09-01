import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { BoldPipe } from "../bold.pipe";

@Component({
    selector: 'app-generic-search',
    standalone: true,
    templateUrl: './generic-search.component.html',
    styleUrls: ['./generic-search.component.css'],
    imports: [CommonModule, BoldPipe]
})
export class GenericSearchComponent implements OnInit {

  @Input() placeholder!: string;
  @Input() items!: string[];
  filteredItems$!: Observable<string[]>;
  private searchTerms = new Subject<string | null>();
  @Output() valueChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.filteredItems$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string | null) => {
        if (term !== null) {
          this.valueChange.emit(term);
        }
        return of(term !== null ? this.items.filter(item => item.toLowerCase().includes(term.toLowerCase())) : [])
      }),
    );
  }

  search(term: string | null) {
    this.searchTerms.next(term);
  }
}
