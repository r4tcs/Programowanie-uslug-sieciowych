import { ChatService } from './../chat.service';
import { Message } from './message';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit, AfterViewChecked {
  title: 'Chat';
  userSetName = false;
  userid = '';
  inputText: string;
  message = new Message('', '');
  messages: Message[] = [];
  time: string;
  times: string[] = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.getMessages().subscribe(({message, userid}) => {
      const currentTime = moment().format('HH:mm:ss');
      this.time = currentTime;
      const finalMessage = this.time + ' ' + message;
      const m = new Message(finalMessage, userid);
      this.messages.push(m);
    });
    //this.chatService.getImages();
  }

  setUserId() {
    this.userSetName = true;
  }

  sendMessage() {
    this.message.value = this.inputText;
    if (this.message.value != null && this.message.value !== '' && this.userid !== undefined){
      this.chatService.sendMessage(this.message.value, this.userid);
    }
    this.inputText = '';
  }

  handleFileInput(files: FileList) {
    const reader = new FileReader();
    const bytes = new Uint8Array(reader.onload(files.item[0]));
    this.chatService.sendFile(bytes);
  }

  ngAfterViewChecked(): void {
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
  }
}
