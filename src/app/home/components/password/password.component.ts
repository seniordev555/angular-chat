import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../core/services/api.service';
import { pick } from 'lodash';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/;

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  passwordForm: FormGroup

  public barLabel: string = "Password strength:";

  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];

  constructor(private formBuilder: FormBuilder, private _toastr: ToastrService, private _apiService: ApiService) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      'oldpwd': [
        '',
        Validators.compose([
          Validators.required,
        ])
      ],
      'newpwd': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(PASSWORD_REGEX)
        ])
      ],
      'confirmpwd': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(PASSWORD_REGEX)
        ])
      ]
    });
  }

  submit() {
    this._apiService.password(pick(this.passwordForm.value, ['oldpwd', 'newpwd']))
      .subscribe(success => {
        this._toastr.success('Success');
      },
      error => {
        this._toastr.error('Error');
      })
  }
}
