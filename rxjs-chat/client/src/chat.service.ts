import { User } from './app/user';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class ChatService {
    private url = 'http://localhost:5000';
    private socket: SocketIOClient.Socket;


    constructor() {
        this.socket = io(this.url);
    }

    public sendMessage(message: string, userName: string, file: File) {
        if (file){
          this.socket.emit('new-message', message, userName, file, file.name, file.type);
        }
        else {
          this.socket.emit('new-message', message, userName, file, '', '');
        }
    }

    public getMessages(){
        return new Observable((observer) => {
            this.socket.on('new-message', (message: any, userName: any, file: File, fileName: any, fileType: any) => {
                observer.next({message, userName, file, fileName, fileType});
            });
        });
    }

    public sendUser(user: User) {
      this.socket.emit('user', user);
    }

    public getUsers(){
      return new Observable((observer) => {
        this.socket.on('user', (users: User[]) => {
            observer.next(users);
        });
      });
    }

    public getPrivateMessages(){
      return new Observable((observer) => {
          this.socket.on('privateMessage', (message: any, userName: any, file: any, fileName: any, fileType: any) => {
              observer.next({message, userName, file, fileName, fileType});
          });
      });
  }

    public sendPrivateMessage(message: string, messageToUserId: string, userName: string, file: File) {
      if (file) {
        this.socket.emit('privateMessage', message, messageToUserId, userName, file, file.name, file.type);
      }
      else {
        this.socket.emit('privateMessage', message, messageToUserId, userName, file, '', '');
      }
    }
}
