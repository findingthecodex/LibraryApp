import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  const token = this.authService.getToken();
  console.log('1. Token från getToken():', token);
  console.log('2. localStorage.getItem("token"):', localStorage.getItem('token'));

  if (token) {
    const newRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('3. Authorization header satt till:', `Bearer ${token.substring(0, 20)}...`);
    return next.handle(newRequest);
  } else {
    console.log('4. INGEN TOKEN! Skickar request utan auth');
    return next.handle(request);
  }
}
}
