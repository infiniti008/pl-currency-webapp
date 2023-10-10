import React, { useState, useEffect, useRef } from 'react';

const startSong = Math.floor(Math.random() * 5)

function AudioPlayer({ isAutoRun, hidden }) {
  const [songs] = useState([
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/x50wM1iD65BGpw3ZQGa6oEzknmiMcQ0qOnVDKCmE.mp3',
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/iJrrlSj34HydFVL1foNhVxgBnfliqmsFSpgDhYUK.mp3',
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/br1ytABAy0WQfVydSbhY4glXVHwGV169ZWeg8ntO.mp3',
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/DO2ZnHGfPcdw4Eq2thqNd1wU0ZAGIds1KP0NJOWK.mp3',
    'https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/951zlIsy7Ec0LfGiDAsFEkEqZ3pXl0tHOUmb7rMx.mp3'
  ]);
  const [currentSongIndex, setCurrentSongIndex] = useState(startSong);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlayer = useRef(null);

  useEffect(() => {
    audioPlayer.current.volume = 0.2;
    if (audioPlayer.current && isAutoRun) {
      audioPlayer.current.play();
      setIsPlaying(true);
    }
  }, [currentSongIndex]);

  const handleSongEnd = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
  }

  const handleOnClick = () => {
    if (audioPlayer.current.paused) {
      audioPlayer.current.play();
      setIsPlaying(true);
    } else {
      audioPlayer.current.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div style={{ display: hidden ? 'none' : 'block' }}>
      <button onClick={handleOnClick}>
        <span>
          {isPlaying ?  "Pause" : "Play"}
        </span>
      </button>
      <audio
        ref={audioPlayer}
        onEnded={handleSongEnd}
        src={songs[currentSongIndex]}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioPlayer;