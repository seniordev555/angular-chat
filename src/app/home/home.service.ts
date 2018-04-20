import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';

import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {

  channel: any;
  messages: any;

  constructor(private _apiService: ApiService) { }

  loadChannels() {
    return this._apiService.get('/channels', true)
      .map((res: any) => {
        this.channel = res.find((c) => c.name === 'general');
      });
  }

  loadMessages() {
    return this._apiService.get(`/messages/${this.channel.id}`, true)
      .map((res: any) => {
        this.messages = res.messages;
      });
  }

}
