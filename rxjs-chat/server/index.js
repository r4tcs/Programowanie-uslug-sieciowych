let express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
let app = express();

let http = require('http');

let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

class User{
    constructor(name, userid) {
      this.name = name;
      this.userid = userid;
    }
}

let users = [];

io.on('connection', (socket) => {
  console.log('a user with socket id: ' + socket.id +  ' connected');
  socket.on('user', (user) => {
    users.push(new User(user.name, socket.id));
    io.emit('user', users);
  });
  socket.on('disconnect', () => {
    console.log('a user with socket id: ' + socket.id + ' disconnected');
    users.forEach(element => {
      if(element.userid == socket.id){
        console.log('usuwam: ', element);
        users.splice(users.indexOf(element), 1);
      }
    });
    io.emit('user', users);
  });
  socket.on('new-message', (message, userName, file, fileName, fileType) => {
    console.log('Message: ', message, ' - ', userName, ' socket id: ', socket.id);
    io.emit('new-message', message, userName, file, fileName, fileType);
  });
  socket.on('privateMessage', (message, messageToUserId, userName, file, fileName, fileType) => {
    io.to(messageToUserId).emit('privateMessage', message, userName, file, fileName, fileType);
    io.to(socket.id).emit('privateMessage', message, userName, file, fileName, fileType);
  });
});

server.listen(port, () => {
    console.log('started on port:' +  port);
});