import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../services/api.service';

@Injectable()
export class GuestGuard implements CanActivate {

  constructor (private _router: Router, private _apiService: ApiService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this._apiService.isAuthorized()) {
      return true;
    }

    this._router.navigate(['/']);

    return false;
  }
}
