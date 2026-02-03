import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { from, Observable, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.authService.getIdToken()).pipe(
            switchMap(token => {
                const authReq = this.addToken(req, token);
                return next.handle(authReq).pipe(
                    catchError(error => {
                        if (error instanceof HttpErrorResponse && error.status === 401) {
                            return this.handle401Error(req, next);
                        }
                        return throwError(() => error);
                    })
                );
            })
        );
    }

    private addToken(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
        if (!token) return req;
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Forzamos el refresco del token
        return from(this.authService.getIdToken(true)).pipe(
            switchMap(newToken => {
                if (newToken) {
                    return next.handle(this.addToken(req, newToken));
                }
                // Si no hay nuevo token, logout o lanzar error
                this.authService.logout();
                return throwError(() => new Error('Session expired'));
            }),
            catchError(err => {
                this.authService.logout();
                return throwError(() => err);
            })
        );
    }
}
