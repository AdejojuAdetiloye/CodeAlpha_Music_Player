
const songs = [
  {
    title: "Sunset Dreams",
    artist: "Chill Vibes",
    duration: "3:45"
  },
  {
    title: "Electric Nights",
    artist: "Neon Wave",
    duration: "4:12"
  },
  {
    title: "Ocean Breeze",
    artist: "Coastal Sound",
    duration: "3:28"
  },
  {
    title: "Mountain High",
    artist: "Echo Valley",
    duration: "4:55"
  },
  {
    title: "City Lights",
    artist: "Urban Beats",
    duration: "3:33"
  },
  {
    title: "Starlight Serenade",
    artist: "Lunar Harmony",
    duration: "4:20"
  }
];

let currentSongIndex = 0;
let isPlaying = false;
let progress = 0;
let progressInterval;
let volume = 70;

const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const progressBar = document.getElementById('progressBar');
const progressEl = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');
const albumArt = document.getElementById('albumArt');
const volumeUpBtn = document.getElementById('volumeUpBtn');
const volumeDownBtn = document.getElementById('volumeDownBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeLevel = document.getElementById('volumeLevel');
const volumeText = document.getElementById('volumeText');

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseDuration(duration) {
  const [mins, secs] = duration.split(':').map(Number);
  return mins * 60 + secs;
}

function updateVolume() {
  volumeLevel.style.width = `${volume}%`;
  volumeText.textContent = `${volume}%`;
}

function volumeUp() {
  volume = Math.min(100, volume + 10);
  updateVolume();
}

function volumeDown() {
  volume = Math.max(0, volume - 10);
  updateVolume();
}

function loadSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  durationEl.textContent = song.duration;
  progress = 0;
  progressEl.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  updatePlaylistUI();
}

function updatePlaylistUI() {
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    if (index === currentSongIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function togglePlay() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
    albumArt.classList.add('playing');
    startProgress();
  } else {
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    albumArt.classList.remove('playing');
    stopProgress();
  }
}

function startProgress() {
  const duration = parseDuration(songs[currentSongIndex].duration);
  progressInterval = setInterval(() => {
    progress += 0.1;
    const percentage = (progress / duration) * 100;
    progressEl.style.width = `${percentage}%`;
    currentTimeEl.textContent = formatTime(progress);

    if (progress >= duration) {
      nextSong();
    }
  }, 100);
}

function stopProgress() {
  clearInterval(progressInterval);
}

function nextSong() {
  stopProgress();
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    startProgress();
  }
}

function prevSong() {
  stopProgress();
  currentSongIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
  loadSong(currentSongIndex);
  if (isPlaying) {
    startProgress();
  }
}

function renderPlaylist() {
  playlistEl.innerHTML = songs.map((song, index) => `
                <div class="playlist-item" data-index="${index}">
                    <div class="playlist-number">${index + 1}</div>
                    <div class="playlist-info">
                        <div class="playlist-title">${song.title}</div>
                        <div class="playlist-artist">${song.artist}</div>
                    </div>
                    <div class="playlist-duration">${song.duration}</div>
                </div>
            `).join('');

  document.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      const wasPlaying = isPlaying;
      if (isPlaying) {
        stopProgress();
        isPlaying = false;
      }
      loadSong(index);
      if (wasPlaying) {
        togglePlay();
      }
    });
  });
}

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);
volumeUpBtn.addEventListener('click', volumeUp);
volumeDownBtn.addEventListener('click', volumeDown);

volumeSlider.addEventListener('click', (e) => {
  const rect = volumeSlider.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  volume = Math.round(percent * 100);
  updateVolume();
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const duration = parseDuration(songs[currentSongIndex].duration);
  progress = percent * duration;
  progressEl.style.width = `${percent * 100}%`;
  currentTimeEl.textContent = formatTime(progress);
});

renderPlaylist();
loadSong(0);
updateVolume();
