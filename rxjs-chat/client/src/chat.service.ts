import * as io from 'socket.io-client';
import { Observable} from 'rxjs';

export class ChatService {
    private url = 'http://localhost:5000';
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public sendMessage(message, userid) {
        this.socket.emit('new-message', message, userid);
    }

    public getMessages(){
        return new Observable((observer) => {
            this.socket.on('new-message', (message, userid) => {
                observer.next({message, userid});
            });
        });
    }
}
