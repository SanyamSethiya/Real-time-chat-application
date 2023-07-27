
const socket = io('http://localhost:8000');

//get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//audio that will play on receiving message
var audio = new Audio('notification_music.mp3');

//function which will append event info to the container
const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == 'left') {
  audio.play();
  }
}
//ask new user for his/her name and let the server knnow
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

//if a user joins, receive his/her name from the server
socket.on('user-joined', name => {
  append(`${name} joined the chat`, 'right')
})

//if server sends a message, receive it
socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left')
})

// if a user leaves the chat, append the info to the container
socket.on('left', name => {
  append(`${name}: left the chat`, 'right')
})

// if the form get submitted, send server the message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = ''

})

