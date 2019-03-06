import { ErrorComponent } from './errors/error.component';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private dialogue: MatDialog){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) =>{
        let errorMessage = "An Unknown Error Occoured"
        if(error.error.message){
          errorMessage = error.error.message;
        }
        this.dialogue.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(error);
      })
    );

  }
}
