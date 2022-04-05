import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { ILoginResponse } from "../interfaces/login-response";
import { environment } from "../../environments/environment";
import { IRegisterResponse } from "../interfaces/register-response";

const BASE_URL = environment.production
  ? 'https://todo-oblako-group.herokuapp.com'
  : 'http://localhost:3000'

@Injectable({ providedIn: 'root' })
export class AuthService {

  private authorized: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false)

  private token: BehaviorSubject<string> =
    new BehaviorSubject<string>(localStorage.getItem('token') || '')

  authorized$: Observable<boolean> = this.authorized.asObservable()

  token$: Observable<string> = this.token.asObservable()

  constructor(private httpClient: HttpClient) { }

  login(login: string, password: string): Observable<ILoginResponse> {
    return this.httpClient.post<ILoginResponse>(`${BASE_URL}/login`, {
      login, password
    })
  }

  logout() {
    localStorage.removeItem('token')
    this.authorized.next(false)
    this.token.next('')
  }

  checkAuthorized() {
    const token = localStorage.getItem('token')
    if (token) {
      this.authorized.next(true)
      this.token.next(token)
    }
  }

  setAuthorized(value: boolean) {
    this.authorized.next(value)
  }

  saveToken(token: string) {
    localStorage.setItem('token', token)
    this.token.next(token)
  }

  register(login: string, password: string, name: string = 'John Doe'): Observable<IRegisterResponse> {
    const userName = name ? name : 'John Doe'

    return this.httpClient.post<IRegisterResponse>(`${BASE_URL}/register`, {
      user: {
        login,
        password,
        name: userName,
        avatar: '/fake/path/to/avatar'
      }
    })
  }
}
