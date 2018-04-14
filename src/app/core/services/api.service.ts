import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { pick } from 'lodash';
import { AuthData } from '../models/auth-data.model';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/switchMap';

@Injectable()
export class ApiService {
  private _sessionAuthData: any;
  private _sessionUser: any;
  private _isAuthorized: boolean = false;

  constructor(private _httpClient: HttpClient) { }

  isAuthorized(): boolean {
    this._isAuthorized = false;
    this._sessionAuthData = JSON.parse(sessionStorage.getItem('angular_chat_auth_data'));
    this._sessionUser = JSON.parse(sessionStorage.getItem('angular_chat_auth_user'));

    if (this._sessionAuthData && this._sessionUser) {
      this._isAuthorized = true;
    }

    return this._isAuthorized;
  }

  getAuthData() {
    this._sessionAuthData = JSON.parse(sessionStorage.getItem('angular_chat_auth_data'));
    return this._sessionAuthData;
  }

  getUserData() {
    this._sessionUser = JSON.parse(sessionStorage.getItem('angular_chat_auth_user'));
    return this._sessionUser;
  }

  get(url, isAuth = true) {
    const authData = this.getAuthData();
    const userData = this.getUserData();
    if (isAuth && authData && moment(authData.expiresIn) < moment()) {
      const body = {
        refreshToken: authData.refreshToken,
        email: userData.email
      };
      const self = this;
      return this._httpClient.post(`${environment.apiUrl}/auth/refresh-token`, body)
        .switchMap(res => {
          self._setAuthData(res);
          return self._httpClient.get(`${environment.apiUrl}${url}`, self._httpOptions(isAuth));
        });
    }
    return this._httpClient.get(`${environment.apiUrl}${url}`, this._httpOptions(isAuth));
  }

  post(url, data, isAuth = true) {
    const authData = this.getAuthData();
    const userData = this.getUserData();
    if (isAuth && authData && moment(authData.expiresIn) < moment()) {
      const body = {
        refreshToken: authData.refreshToken,
        email: userData.email
      };
      const self = this;
      return this._httpClient.post(`${environment.apiUrl}/auth/refresh-token`, body)
        .switchMap(res => {
          self._setAuthData(res);
          return self._httpClient.post(`${environment.apiUrl}${url}`, data, self._httpOptions(isAuth))
        });
    }
    return this._httpClient.post(`${environment.apiUrl}${url}`, data, this._httpOptions(isAuth));
  }

  setAuthData(data: any) {
    this._setUserData(data.user);
    this._setAuthData(data.token);
  }

  reset() {
    sessionStorage.removeItem('angular_chat_auth_data');
    sessionStorage.removeItem('angular_chat_auth_user');
    localStorage.removeItem('angular_chat_auth_data');
    localStorage.removeItem('angular_chat_auth_user');
  }

  private _setUserData(user: any) {
    this._sessionUser = user;
    sessionStorage.setItem('angular_chat_auth_user', JSON.stringify(user));
  }

  private _setAuthData(data: any) {
    this._sessionAuthData = data;
    sessionStorage.setItem('angular_chat_auth_data', JSON.stringify(data));
  }

  private _httpOptions(isAuth) {
    const authData = this.getAuthData();
    let httpOptions;

    if (isAuth && authData && authData.accessToken) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': `${authData.tokenType} ${authData.accessToken}`
        })
      };
      return httpOptions;
    }

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return httpOptions;
  }
}
