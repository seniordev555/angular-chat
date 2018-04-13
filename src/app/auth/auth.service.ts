import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private _apiService: ApiService) { }

  login(data) {
    return this._apiService.post('/auth/login', data, false)
      .map((res: any) => {
        this._apiService.setAuthData(res);
        return true;
      });
  }

  register(data) {
    return this._apiService.post('/auth/register', data, false);
  }
}
