import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { pick } from 'lodash';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  title = 'Register';

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private _authSerivce: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      'email': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(EMAIL_REGEX)
        ])
      ],
      'username': [
        '',
        Validators.required
      ],
      'password': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6)
        ])
      ],
      'confirmPassword': [
        '',
        Validators.compose([
          Validators.required,
        ])
      ]
    });
  }

  submit() {
    this._authSerivce.register(
      pick(this.registerForm.value, ['email', 'username', 'password'])
    ).subscribe(success => {
      console.log(success);
    });
  }

}
