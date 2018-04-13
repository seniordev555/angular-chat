import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable()
export class UserService {

  constructor(private _apiService: ApiService, private _router: Router) { }

  logout() {
    this._apiService.reset();
    this._router.navigate(['/login']);
  }

}
