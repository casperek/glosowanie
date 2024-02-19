const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let songs = [];
let votedUsers = new Set(); // Zbiór przechowujący identyfikatory użytkowników, którzy już oddali głos

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('updateSongs', songs);

  socket.on('addSong', (title) => {
    const existingSong = songs.find((song) => song.title === title);

    if (!existingSong) {
      songs.push({ title, votes: 0 });
      io.emit('updateSongs', songs);
    }
  });

  socket.on('vote', (title, userId) => {
    if (!votedUsers.has(userId)) {
      const selectedSong = songs.find((song) => song.title === title);

      if (selectedSong) {
        selectedSong.votes += 1;
        votedUsers.add(userId); // Dodaj identyfikator użytkownika do zbioru zagłosowanych
        io.emit('updateSongs', songs);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;
const ip = '192.168.3.25'; // Możesz użyć swojego publicznego IP
server.listen(port, ip, () => {
  console.log(`Server is running on ${ip}:${port}`);
});
