const socket = io();
const userId = generateUserId();

socket.on('updateSongs', (songs) => {
  updateSongList(songs);
});

function addSong() {
  const titleInput = document.getElementById('songInput');
  const title = titleInput.value.trim();

  if (title !== '') {
    socket.emit('addSong', title);
    titleInput.value = '';
  }
}

function vote(title) {
  socket.emit('vote', title, userId);
}

function updateSongList(songs) {
  const songList = document.getElementById('songList');
  songList.innerHTML = '';

  songs.forEach((song) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${song.title}</span>
      <span>Votes: ${song.votes}</span>
      <button onclick="vote('${song.title}')">Vote</button>
    `;
    songList.appendChild(li);
  });
}

function generateUserId() {
  return Math.random().toString(36).substring(2, 15);
}
