var express = require('express');
var socket = require('socket.io');
require('dotenv').config();

var app = express();
var server = app.listen(process.env.PORT, process.env.HOST, function () {
  console.log('Server is up in ' + process.env.HOST + ':' + process.env.PORT);
});

// Reserved Events
let ON_CONNECTION = 'connection';
let ON_DISCONNECT = 'disconnect';

// Main Events
let EVENT_IS_USER_ONLINE = 'check_online';
let EVENT_SINGLE_CHAT_MESSAGE = 'single_chat_message';

// Sub Events
let SUB_EVENT_RECEIVE_MESSAGE = 'receive_message';
let SUB_EVENT_IS_USER_CONNECTED = 'is_user_connected';

// Status
let STATUS_MESSAGE_NOT_SENT = 10001;
let STATUS_MESSAGE_SENT = 10002;

const userMap = new Map();

// socket setup
var io = socket(server);
io.on('connection', function (socket) {
  onEachUserConnection(socket);
});

function onEachUserConnection(socket) {
  console.log('--------------------');
  console.log('Connected => Socket ID: ' + socket.id + ', User ' + JSON.stringify(socket.handshake.query));
  var from_user_id = socket.handshake.query.from;
  let userMapVal = {
    socket_id: socket.id
  };
  addUserToMap(from_user_id, userMapVal);
  printOnlineUsers();
  onMessage(socket);
  onDisconnect(socket);
}

function onMessage(socket) {
  socket.on(EVENT_SINGLE_CHAT_MESSAGE, function (chat_message) {
    singleChantHandler(socket, chat_message);
  })
}

function singleChantHandler(socket, chat_message) {
  print("onMessage: " + JSON.stringify(chat_message));
}

function addUserToMap(key_user_id, socket_id) {
  userMap.set(key_user_id, socket_id);
}

function printOnlineUsers() {
  console.log('Online Users: ' + userMap.size);
}

function onDisconnect(socket) {
  socket.on(ON_DISCONNECT, function () {
    console.log('Disconnected => Socket ID: ' + socket.id + ', User ' + JSON.stringify(socket.handshake.query));
    socket.removeAllListeners(ON_DISCONNECT);
  });
}