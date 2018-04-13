import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'Login';

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _authSerivce: AuthService,
    private _router: Router
   ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(EMAIL_REGEX)
        ])
      ],
      'password': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6)
        ])
      ]
    });
  }

  submit() {
    this._authSerivce.login(this.loginForm.value)
      .subscribe(success => {
        this._router.navigate(['/']);
      });
  }
}
