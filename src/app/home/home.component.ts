import * as $ from 'jquery';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import * as socketIo from 'socket.io-client';
import { environment } from '../../environments/environment';
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
  socket: any = socketIo(environment.socketUrl, { path: '/api/chat' });

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _userService: UserService, private _homeService: HomeService, private formBuilder: FormBuilder) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.textForm = this.formBuilder.group({
      'message': ''
    });

    this.loading = true;
    this._userService.profile()
      .switchMap(() => this._homeService.loadChannels())
      .switchMap(() => this._homeService.loadMessages())
      .subscribe(() => {
        this.initSocket();
        this.loading = false;
        this.channel = this._homeService.channel;
        this.messages = this._homeService.messages;
      }, err => {
        this._userService.logout();
      });
  }

  initSocket() {
    this.socket.on('new message', (message) => {
      // this.messages.push(message);
      this._homeService.addNewMessage(message);
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  send(): void {
    if (this.textForm.value.message == '') return;
    this._homeService.sendMessage(this.textForm.value.message).subscribe(() => {
      this.textForm.reset({ 'message': '' });
    });
  }
}
