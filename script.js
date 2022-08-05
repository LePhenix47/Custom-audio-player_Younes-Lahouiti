const musicsData = [
  { title: "Dust", artist: "M.O.O.N.", id: 1 },
  { title: "Justice", artist: "Genesis", id: 2 },
  { title: "Windwaker", artist: "Mord Fustang", id: 3 },
  { title: "Beautiful dead", artist: "Masafumi Takada", id: 4 },
];

//Part 1 Playing or pausing the audio when pressing the play/pause button
const playPauseMusicButton = document.querySelector(".container__play-button");

const playMusicButtonIcon = document.querySelector(".fa-solid.fa-play");
const pauseMusicButtonIcon = document.querySelector(".fa-solid.fa-pause");

const audio = document.querySelector(".audio");

const mainContainer = document.querySelector(".container");

function playOrPauseAudio() {
  console.log("click");
  if (audio.paused) {
    //if the audio is pause AND you pressed the button, you play the music again
    audio.play();
    playMusicButtonIcon.classList.replace("show", "hide");
    pauseMusicButtonIcon.classList.replace("hide", "show");
    mainContainer.style.animationPlayState = "running";
  } else {
    audio.pause();
    playMusicButtonIcon.classList.replace("hide", "show");
    pauseMusicButtonIcon.classList.replace("show", "hide");
    mainContainer.style.animationPlayState = "paused";
  }
}
playPauseMusicButton.addEventListener("click", playOrPauseAudio);

mainContainer.addEventListener("animationstart", function () {
  this.style.animationPlayState = "paused"; //the "this" keyword refers to the elements that has the eventListener
});

//Part 2 Showing the progress
const audioCurrentTimeBar = document.querySelector(
  ".container__audio-progress-bar-current-time"
);
const audioCurrentTimeDisplay = document.querySelector(
  ".container__audio-current-time"
);
const audioTotalTimeDisplay = document.querySelector(
  ".container__audio-total-time"
);

function fillTime() {
  formatTimeValues(audioCurrentTimeDisplay, audioTotalTimeDisplay);
}

function formatTimeValues(currentTimeElement, totalTimeElement) {
  if (isNaN(audio.duration)) {
    totalTimeElement.textContent = "-:--";
  }

  let currentMinutes = Math.trunc(audio.currentTime / 60);
  let currentSeconds = Math.trunc(audio.currentTime % 60);

  let totalMinutes = Math.trunc(audio.duration / 60);
  let totalSeconds = Math.trunc(audio.duration % 60);

  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }

  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  if (totalMinutes < 10) {
    totalMinutes = `0${totalMinutes}`;
  }

  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }

  currentTimeElement.textContent = `${currentMinutes}:${currentSeconds}`;
  totalTimeElement.textContent = `${totalMinutes}:${totalSeconds}`;

  let progressTimePosition = (audio.currentTime * 100) / audio.duration;
  audioCurrentTimeBar.style.transform = `scaleX(${progressTimePosition}%)`;

  if (audio.ended) {
    console.log("Audio ended");
    playMusicButtonIcon.classList.replace("hide", "show");
    pauseMusicButtonIcon.classList.replace("show", "hide");
    mainContainer.style.animationPlayState = "paused";
  }
}

audio.addEventListener("loadeddata", fillTime);
audio.addEventListener("timeupdate", fillTime);

//Part 3 dragging the bar element (Copied and pasted from my previous project lol)

const audioTotalTimeBar = document.querySelector(
  ".container__audio-progress-bar"
);

let positionAndDimensionsOfBar = audioTotalTimeBar.getBoundingClientRect(); //Gives the DOMRect
let widthOfBar = positionAndDimensionsOfBar.width;

function resizeBar() {
  positionAndDimensionsOfBar = audioTotalTimeBar.getBoundingClientRect();
  widthOfBar = positionAndDimensionsOfBar.width;
}
//We need to remind to give new values to the progress bar when resizing the window
window.addEventListener("resize", resizeBar);

//So e.clientX is the coordinate of the X axis form the left extremity of the page to the mouse of the client
//And the PaDoB.left is the coordinate of the X axis from the left extremity of the page to the bar element
//X then is the coordinate between wherever the mouse was clicked and the progress bar, it gives the position of the progress bar on the X coordinate
function navigationDragger(e) {
  const x = e.clientX - positionAndDimensionsOfBar.left;
  const barWidthPercentage = x / widthOfBar;

  audio.currentTime = audio.duration * barWidthPercentage;
}

audioTotalTimeBar.addEventListener("click", navigationDragger);

//Part 4 Changing the song when clicking on the shuffle, previous and next button

const nextSongButton = document.querySelector(".container__next-button");
const previousSongButton = document.querySelector(
  ".container__previous-button"
);

const artistOfSong = document.querySelector(".container__music-artist");
const nameOfSong = document.querySelector(".container__music-title");
const spanIndex = document.querySelector(".container__music-current-music");
const thumbnailImage = document.querySelector(".container__thumbnail-image");

let currentMusicIndex = 1;
let changeSongButtonsArray = [nextSongButton, previousSongButton];

for (changeSongButton of changeSongButtonsArray) {
  changeSongButton.addEventListener("click", changeMusic);
}

function changeMusic(e) {
  console.log(e.currentTarget);
  console.log(e.target);
  let buttonClass = e.currentTarget.classList.value;

  let whichButtonDidUserClick = buttonClass.includes("container__next-button")
    ? "next button"
    : "previous button";
  console.log(whichButtonDidUserClick);

  if (whichButtonDidUserClick === "next button") {
    currentMusicIndex++;
  } else {
    currentMusicIndex--;
  }

  if (currentMusicIndex < 1) {
    currentMusicIndex = musicsData.length;
  } else if (currentMusicIndex > musicsData.length) {
    currentMusicIndex = 1;
  }

  changeAudioAndThumbnail(musicsData[currentMusicIndex - 1]);
}

function changeAudioAndThumbnail({ title, artist }) {
  artistOfSong.textContent = artist;
  nameOfSong.textContent = title;

  thumbnailImage.setAttribute("src", `./ressources/thumbs/${title}.png`);
  thumbnailImage.setAttribute(
    "alt",
    `Thumbnail for the song: ${title} made by ${artist}`
  );
  audio.setAttribute("src", `./ressources/music/${title}.mp3`);
  audio.setAttribute(
    "alt",
    `Thumbnail for the song: ${title} made by ${artist}`
  );

  spanIndex.textContent = currentMusicIndex;

  playMusicButtonIcon.classList.replace("hide", "show");
  pauseMusicButtonIcon.classList.replace("show", "hide");
}

//Part 5 (I forgor I had to code the shuffle button)

const shuffleButton = document.querySelector(".container__shuffle-button");
const shuffleIcon = document.querySelector(".container__shuffle-button > *");

let newArrayOfSongs = [];

shuffleButton.addEventListener("click", (e) => {
  let isShuffleButtonActive = shuffleIcon.classList.contains("active")
    ? true
    : false;
  console.log(isShuffleButtonActive);
  if (isShuffleButtonActive) {
    newArrayOfSongs = musicsData;
  } else {
    newArrayOfSongs = musicsData.filter((song) => {
      return song.id !== currentMusicIndex;
    });
    console.table(newArrayOfSongs);
    playShuffledSong();
    return;
  }
});

function playShuffledSong() {
  let newMusic =
    newArrayOfSongs[Math.trunc(Math.random() * newArrayOfSongs.length)];
  const { title, artist, id } = newMusic;
  currentMusicIndex = id;
  console.log(title, artist, id);
  let newMusicObject = {
    title: title,
    artist: artist,
  };
  changeAudioAndThumbnail(newMusicObject);
}
