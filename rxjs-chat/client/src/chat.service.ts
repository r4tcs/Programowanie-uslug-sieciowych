import * as io from 'socket.io-client';
import { Observable } from 'rxjs';


export class ChatService {
    private url = 'http://localhost:5000';
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io(this.url);
    }

    public sendMessage(message: string, userid: string) {
        this.socket.emit('new-message', message, userid);
    }

    public getMessages(){
        return new Observable((observer) => {
            this.socket.on('new-message', (message: any, userid: any) => {
                observer.next({message, userid});
            });
        });
    }

    public getImages(){
      this.socket.on('image', image => {
        const img = new Image();
        img.src = `data:image/jpg;base64,${image}`;
    });
    }

    public sendFile(file) {
        this.socket.emit('image', file);
    }
}
