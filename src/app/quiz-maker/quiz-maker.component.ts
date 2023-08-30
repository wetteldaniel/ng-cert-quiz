import {Component} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {Observable} from 'rxjs';
import {QuizService} from '../quiz.service';
import { QuizComponent } from '../quiz/quiz.component';
import { NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-quiz-maker',
    templateUrl: './quiz-maker.component.html',
    styleUrls: ['./quiz-maker.component.css'],
    standalone: true,
    imports: [FormsModule, NgFor, QuizComponent, AsyncPipe]
})
export class QuizMakerComponent {

  categories$: Observable<Category[]>;
  questions$!: Observable<Question[]>;

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories()
  }

  createQuiz(cat: string, difficulty: string): void {
    this.questions$ = this.quizService.createQuiz(cat, difficulty as Difficulty);
  }
}
