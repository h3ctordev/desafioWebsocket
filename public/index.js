// const { io } = require('socket.io-client');
const socket = io('http://localhost:8080');

const nameInput = document.getElementById('email-input');
const messageInput = document.getElementById('message');
const messages = document.getElementById('messages');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productImage = document.getElementById('product-image');

function sendProduct() {
  if (!productName.value && !productPrice.value && !productImage.value) {
    return;
  }
  const product = {
    name: productName.value,
    price: productPrice.value,
    image: productImage.value,
  };

  socket.emit('addProduct', product);
  productName.value = '';
  productPrice.value = '';
  productImage.value = '';
}

function sendMessage() {
  if (!nameInput.value) {
    return alert('Debe tener un email');
  }
  if (!messageInput.value) {
    return;
  }

  nameInput.disabled = true;
  const message = {
    nombre: nameInput.value,
    message: messageInput.value,
  };

  socket.emit('incomingMessage', message);
  messageInput.value = '';
  messageInput.focus();
}

socket.on('chat', (message) => {
  const dateTime = new Date().toISOString();
  const [date, time] = dateTime.split('T');
  const [YYYY, MM, DD] = date.split('-');
  const [HH, mm, ss] = time.split(':');

  const _dateTime = `${YYYY}/${MM}/${DD} ${HH}:${mm}:${ss.slice(0, 2)}`;

  const texto = message
    .map(
      (mensaje) =>
        `<div> <strong> ${mensaje.nombre} [${_dateTime}] :</strong> <em>${mensaje.message}</em></div>`
    )
    .join(' ');
  document.getElementById('messages').innerHTML = texto;
});

socket.on('products-inner', (products) => {
  const headers = [
    `
        <tr class="text-light">
          <th>Nombre</th>
          <th>Precio</th>
          <th>Foto URL</th>
        </tr>
  `,
  ];
  const html = [
    ...headers,
    ...products.map(
      (p) => `<tr>
            <td>${p.name}</td>
            <td>$ ${p.price}</td>
            <td>
              <img
                src=\"${p.image}\"
                alt=\"${p.name}\"
                class=\"img-fluid rounded\"
                style=\"width: 45px\"
              />
            </td>
          </tr>`
    ),
  ].join(' ');
  document.getElementById('products-table').innerHTML = html;
});
