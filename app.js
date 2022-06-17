const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const port = 8080;
const chat = [];
const users = [];
const products = [
  {
    name: 'Cámara',
    price: 199000,
    image:
      'https://cdn3.iconfinder.com/data/icons/spring-2-1/30/Camera-512.png',
  },
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.set('views', './public/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index.ejs', { products, title: 'Productos' });
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

io.on('connection', (channel) => {
  emitChat();
  sendUsers();
  emitProduct();
  channel.on('incomingMessage', (message) => {
    chat.push(message);
    if (!users.includes(message.nombre)) users.push(message.nombre);
    emitChat();
  });
  channel.on('addProduct', (product) => {
    console.log(product);
    products.push(product);
    emitProduct();
  });
});

const emitChat = () => io.sockets.emit('chat', chat);
const emitProduct = () => io.sockets.emit('products-inner', products);
const sendUsers = () => io.sockets.emit('usersList', users);

server.listen(port, () => {
  console.log(`Escuchando el puerto http://localhost:${port}`);
});
