import {Actions, Effect, ofType} from "@ngrx/effects";
import {map, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import {HttpClient} from "@angular/common/http";
import {catchError, of} from "rxjs";
import {Injectable} from "@angular/core";


export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
        + environment.firebaseAPIKey, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return of(new AuthActions.Login({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate
          }));
        }),
        catchError(error => {
          // ...
          return of();
        })
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {
  }
}












