import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, tap } from 'rxjs';
import { QuizService } from '../quiz.service';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericSearchComponent } from '../generic-search/generic-search.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuestionComponent } from '../question/question.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, AsyncPipe, GenericSearchComponent, QuestionComponent]
})
export class QuizMakerComponent implements OnInit {

  categories?: Category[];
  categoryNames!: string[];
  subCategoryNames!: string[];
  questions$!: Observable<Question[]>;
  questions?: Question[];
  id?: string;
  difficulty?: Difficulty;
  canSwapQuestions!: boolean;
  userAnswers!: string[];
  destroyRef = inject(DestroyRef);
  quizService = inject(QuizService);
  router = inject(Router);

  ngOnInit(): void {
    this.userAnswers = [];
    this.subCategoryNames = [];
    this.categoryNames = [];
    this.canSwapQuestions = true;
    this.quizService.getAllCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(categories => {
      this.categories = categories;
      this.categoryNames = [...new Set(categories.map(c => c.name))];
    });
  }

  createQuiz(): void {
    if (this.id && this.difficulty) {
      this.userAnswers = [];
      this.canSwapQuestions = true;
      this.questions$ = this.quizService.createQuiz(this.id, this.difficulty).pipe(
        tap(questions => this.questions = questions),
        takeUntilDestroyed(this.destroyRef)
      );
    }
  }

  onChangeCategory(name: string | null): void {
    this.subCategoryNames = this.categories?.filter(c => c.name === name && c.sub_category !== undefined)
      .map(c => c.sub_category as string) ?? [];
    this.id = this.subCategoryNames.length > 0 ? undefined : this?.categories?.find(c => c.name === name)?.id.toString();
  }

  onChangeSubCategory(subCategory: string) {
    this.id = this?.categories?.find(c => c.sub_category === subCategory)?.id.toString();
  }

  onChangeDifficulty(difficulty: string) {
    this.difficulty = difficulty as Difficulty;
  }

  swapQuestion(i: number) {
    if (this.id && this.difficulty) {
      this.userAnswers[i] = '';
      this.canSwapQuestions = false;
      this.quizService.createQuiz(this.id, this.difficulty, "1").pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(data => this.questions?.splice(i, 1, data[0]));
    }
  }

  allQuestionsAnswered(): boolean {
    return this.userAnswers.filter(a => a).length === this.questions?.length;
  }

  submit(): void {
    this.canSwapQuestions = false;
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }
}
