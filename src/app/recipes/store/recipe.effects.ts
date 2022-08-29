import {Actions, Effect, ofType} from "@ngrx/effects";
import * as RecipesActions from './recipe.actions';
import {switchMap} from "rxjs";
import {Recipe} from "../recipe.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>('https://ng-course-recipe-book-2fde4-default-rtdb.firebaseio.com/recipes.json');
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  )

  constructor(private actions$: Actions, private http: HttpClient) {
  }
}
