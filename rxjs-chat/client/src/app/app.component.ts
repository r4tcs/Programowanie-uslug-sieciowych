import { User } from './user';
import { ChatService } from './../chat.service';
import { Message } from './message';
import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { saveAs } from '../../node_modules/file-saver';

import * as moment from 'moment';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewChecked {
  title: 'Chat';
  userSetName = false;
  userName = '';
  inputText: string;
  privateChat = false;
  secondUserName = '';
  message = new Message('', '', null, '', '');
  users: User[] = [];
  messages: Message[] = [];
  privateMessages: Message[] = [];
  time: string;
  times: string[] = [];
  file: File;
  messageToUserId: '';
  @ViewChild('file') myInputVariable: ElementRef;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.getUsers().subscribe((users: User[]) => {
      this.users.length = 0;
      this.users = users;
    });
    this.chatService.getMessages().subscribe(({message, userName, file, fileName, fileType}) => {
      const currentTime = moment().format('HH:mm:ss');
      this.time = currentTime;
      let finalMessage = '';
      if (message != null && message !== '') {
        finalMessage = this.time + ' ' + message;
      }
      else {
        finalMessage = this.time;
      }
      const m = new Message(finalMessage, userName, file, fileName, fileType);
      this.messages.push(m);
    });
    this.chatService.getPrivateMessages().subscribe(({message, userName, file, fileName, fileType}) => {
      const currentTime = moment().format('HH:mm:ss');
      this.time = currentTime;
      let finalMessage = '';
      if (message != null && message !== '') {
        finalMessage = this.time + ' ' + message;
      }
      else {
        finalMessage = this.time;
      }
      const m = new Message(finalMessage, userName, file, fileName, fileType);
      this.privateMessages.push(m);
    });
  }

  setUserId() {
    this.userSetName = true;
    const u = new User(this.userName, '');
    this.chatService.sendUser(u);
  }

  sendMessage() {
    this.message.value = this.inputText;
    if ((this.message.value !== '' || this.file != null) && this.userName !== '') {
      this.chatService.sendMessage(this.message.value, this.userName, this.file);
    }
    this.inputText = '';
    this.file = null;
    this.myInputVariable.nativeElement.value = '';
  }

  sendPrivateMessage() {
    this.message.value = this.inputText;
    if ((this.message.value !== '' || this.file != null) && this.userName !== '') {
      this.chatService.sendPrivateMessage(this.message.value, this.messageToUserId, this.userName, this.file);
    }
    this.inputText = '';
    this.file = null;
    this.myInputVariable.nativeElement.value = '';
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  ngAfterViewChecked(): void {
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
  }

  saveFile(file, fileName, fileType): void {
      const blob = new Blob([file], {type: fileType});
      saveAs(blob, fileName);
  }

  openPrivateChat(messageToUserName, messageToUserid){
    this.privateMessages.length = 0;
    this.secondUserName = messageToUserName;
    this.privateChat = true;
    this.messageToUserId = messageToUserid;
  }

  switchChat(){
    this.privateChat = false;
    this.privateMessages.length = 0;
  }
}
