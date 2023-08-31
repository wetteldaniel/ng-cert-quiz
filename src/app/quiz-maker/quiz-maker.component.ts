import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, Subscription } from 'rxjs';
import { QuizService } from '../quiz.service';
import { QuizComponent } from '../quiz/quiz.component';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, QuizComponent, AsyncPipe]
})
export class QuizMakerComponent implements OnInit, OnDestroy {

  categories: Category[] | null = [];
  categoryNames: string[] | null = [];
  subCategoryNames: string[] = [];
  questions$!: Observable<Question[]>;
  sub?: Subscription;
  id: string | null | undefined;
  difficulty: Difficulty | null = null;

  constructor(protected quizService: QuizService) { }

  ngOnInit(): void {
    this.sub = this.quizService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.categoryNames = [...new Set(categories.map(c => c.name))];
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  createQuiz(): void {
    console.log(this.difficulty);
    if (this.id && this.difficulty) {
      this.questions$ = this.quizService.createQuiz(this.id, this.difficulty);
    }
  }

  onChangeCategory(name: string): void {
    this.subCategoryNames = this.categories?.filter(c => c.name === name && c.sub_category !== undefined)
      .map(c => c.sub_category as string) ?? [];
    this.id = this.subCategoryNames.length > 0 ? null : this?.categories?.find(c => c.name === name)?.id.toString();
  }

  onChangeSubCategory(subCategory: string) {
    this.id = this?.categories?.find(c => c.sub_category === subCategory)?.id.toString();
  }

  onChangeDifficulty(difficulty: string) {
    this.difficulty = difficulty as Difficulty;
  }
}
