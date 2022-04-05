import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { from, lastValueFrom, firstValueFrom, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (!this.token) {
    //   return next.handle(req)
    // }
    return from(this.handle(req, next))
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    const token = await firstValueFrom(this.authService.token$)

    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    })

    return lastValueFrom(next.handle(modifiedReq))
  }
}
