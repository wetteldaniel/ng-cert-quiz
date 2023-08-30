import {Component, Input} from '@angular/core';
import {Results} from '../data.models';
import { RouterLink } from '@angular/router';
import { QuestionComponent } from '../question/question.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.css'],
    standalone: true,
    imports: [NgFor, QuestionComponent, RouterLink]
})
export class AnswersComponent {

  @Input()
  data!: Results;

}
