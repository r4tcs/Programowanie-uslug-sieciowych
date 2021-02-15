let express = require('express')
let app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

let http = require('http');

let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('a user with socket id: ' + socket.id +  ' connected');
  socket.on('disconnect', () => {
    console.log('a user with socket id: ' + socket.id + ' disconnected')
  });
  socket.on('new-message', (message, userid) => {
    console.log('Message: ', message, ' - ', userid, ' socket id: ', socket.id);
    io.emit('new-message', message, userid);
  });

  socket.on('image', async image => {
    const buffer = Buffer.from(image);
    await fs.writeFile('/tmp/image', buffer).catch(console.error); // fs.promises
    socket.emit('image', image.toString('base64'));
  });
});

server.listen(port, () => {
    console.log('started on port:' +  port);
});