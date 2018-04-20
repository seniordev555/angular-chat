import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { UserService } from '../core/services/user.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: any;
  loading: boolean;
  channel: any;
  messages: any;
  textForm: FormGroup;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _userService: UserService, private _homeService: HomeService, private formBuilder: FormBuilder) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.textForm = this.formBuilder.group({
      'message': [
        '',
        Validators.compose([
          Validators.required,
        ])
      ]
    });

    this.loading = true;
    this._userService.profile()
      .switchMap(() => this._homeService.loadChannels())
      .switchMap(() => this._homeService.loadMessages())
      .subscribe(() => {
        this.loading = false;
        this.channel = this._homeService.channel;
        this.messages = this._homeService.messages;
      }, err => {
        this._userService.logout();
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  send(): void {
    alert(this.textForm.value.message);
  }
}
