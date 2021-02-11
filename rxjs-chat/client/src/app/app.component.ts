import { Message } from './message';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../chat.service';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe')

  private myScrollContainer: ElementRef;

  isDisabled: boolean;
  userid: string;
  inputText: string;
  message = new Message('', '');
  messages: Message[] = [];
  time: string;
  times: string[] = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.isDisabled = false;
    this.chatService.getMessages().subscribe(({message, userid}) => {
      const currentTime = moment().format('HH:mm:ss');
      this.time = currentTime;
      const finalMessage = this.time + ' ' + message;
      const m = new Message(finalMessage, userid);
      this.messages.push(m);
    });
  }

  setUserId() {
    this.isDisabled = true;
  }

  sendMessage() {
    this.message.value = this.inputText;
    if (this.message.value != null && this.message.value !== '' && this.userid !== undefined){
      this.chatService.sendMessage(this.message.value, this.userid);
    }
    this.inputText = '';
  }

  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  ngAfterViewChecked(): void {
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
  }
}
