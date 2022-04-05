import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { MustMatchValidator } from '../utils/must-match.validator'
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../styles/form.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {

  formType: 'login' | 'registration' = 'login'
  loginForm: FormGroup
  regForm: FormGroup
  formLoginError: string = ''
  formLoginSuccess: string = ''
  formRegError: string = ''
  formRegSuccess: string = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.]+$'),
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.minLength(8),
      ])
    })

    this.regForm = this.fb.group({
      login: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.]+$'),
        Validators.minLength(6),
        Validators.maxLength(20)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
      userName: new FormControl('', [
        Validators.minLength(2),
        Validators.pattern(`^[a-zA-Z\\p{Cyrillic} ]+$`)
      ])
    }, {
      validator: MustMatchValidator('password', 'confirmPassword')
    })
  }

  swapFormType() {
    this.formType = this.formType === 'login' ? 'registration' : 'login'
  }

  // hasLoginError(controlName: string, errorName: string): boolean {
  //   return this.loginForm.controls[controlName].hasError(errorName)
  // }

  loginError(control: AbstractControl): string | boolean {
    if (control.hasError('required')) {
      return 'Поле обязательно к заполнению'
    } else if (control.hasError('pattern')) {
      return 'Только латинские символы и цифры'
    } else if (control.hasError('minlength')) {
      return 'От 6 символов'
    } else if (control.hasError('maxlength')) {
      return 'До 20 символов'
    }

    return false
  }

  passwordError(control: AbstractControl): string | boolean {
    if (control.hasError('required')) {
      return 'Поле обязательно к заполнению'
    } else if (control.hasError('pattern')) {
      return 'Недопустимый пароль'
    } else if (control.hasError('minlength')) {
      return 'От 8 символов'
    }

    return false
  }

  getLoginError(): string | boolean {
    const control = this.loginForm.controls['login']
    return this.loginError(control)
  }

  getPasswordError(): string | boolean {
    const control = this.loginForm.controls['password']
    return this.passwordError(control)
  }

  getRegLoginError(): string | boolean {
    const control = this.regForm.controls['login']
    return this.loginError(control)
  }

  getRegPasswordError(): string | boolean {
    const control = this.regForm.controls['password']
    return this.passwordError(control)
  }

  getConfirmPasswordError(): string | boolean {
    const control = this.regForm.controls['confirmPassword']

    if (control.hasError('required')) {
      return 'Поле обязательно к заполнению'
    } else if (control.hasError('mustmatch')) {
      return 'Пароли не совпадают'
    }

    return false
  }

  getNameError(): string | boolean {
    const control = this.regForm.controls['userName']

    if (control.hasError('minlength')) {
      return 'Слишком короткое имя'
    } else if (control.hasError('pattern')) {
      return 'Только кириллические или латинские буквы и пробелы'
    }

    return false
  }

  onLoginSubmit() {
    this.authService
      .login(this.loginForm.value.login, this.loginForm.value.password)
      .subscribe((res) => {
        if (res.error) {
          this.formLoginError = 'Не правильный логин и/или пароль'
          this.formLoginSuccess = ''
        } else if (res.token) {
          this.formLoginError = ''
          this.formLoginSuccess = 'Успешный вход'

          this.authService.saveToken(res.token)
          this.authService.setAuthorized(true)
        }
      })
  }

  onRegSubmit() {
    this.authService
      .register(
        this.regForm.value.login,
        this.regForm.value.password,
        this.regForm.value.userName
      )
      .subscribe((res) => {
        if (res.login) {
          this.formRegError = res.login[0]
        }

        if (res.token) {
          this.formRegError = ''
          this.formRegSuccess = 'Вы успешно зарегистрировались'
          setTimeout(() => {
            this.swapFormType()
            this.formRegSuccess = ''
            this.regForm.reset()
          }, 1500)
        }
      })
  }

}
