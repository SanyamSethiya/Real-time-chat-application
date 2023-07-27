//to give access to all requestinghosts
const express = require("express");
const app = express();
const cors = require('cors');
//Node server which will handle socket io connection
app.use(cors());
const io = require('socket.io')(8000)
const users = {};

io.on('connection', socket => {
  // If any user joins, let other users connected to the server know
  socket.on('new-user-joined', name => {
    // console.log("New user", name);
    // res.header("Access-Control-Allow-Origin", "http://localhost8000")
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  // If someone sends message, broadcast it to the others
  socket.on('send', message => {
    socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

// Ifsomeone leaaves the chat, let others know(disconnect is inbuilt in socket io it fires automatically when a user is disconnected)
  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
    });
    

  })
