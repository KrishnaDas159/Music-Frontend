// MusinContext.tsx


import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  price?: string;
  url?: string;
}

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlaylist: (songs: Song[]) => void;
  seek: (time: number) => void; 
}

const MusicContext = createContext<MusicContextType>({} as MusicContextType);

export const useMusicPlayer = () => useContext(MusicContext);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSongState] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    if (currentSong?.url) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = currentSong.url;
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.ontimeupdate = () => {
        setProgress(audioRef.current!.currentTime);
        setDuration(audioRef.current!.duration || 0);
      };

      audioRef.current.onended = () => {
        playNext();
      };
    }
  }, [currentSong]);

  const setCurrentSong = (song: Song) => {
    const index = playlist.findIndex((s) => s.id === song.id);
    setCurrentIndex(index);
    setCurrentSongState(song);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSongState(playlist[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSongState(playlist[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        setCurrentSong,
        togglePlayPause,
        playNext,
        playPrevious,
        setPlaylist,
        seek, 
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};






// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface Song {
//   id: string;
//   title: string;
//   artist: string;
//   cover: string;
//   price?: string;
//   audio?: string; // Audio file URL
// }

// interface MusicContextType {
//   currentSong: Song | null;
//   setCurrentSong: (song: Song | null) => void;
//   isPlaying: boolean;
//   togglePlayPause: () => void;
//   playNext: () => void;
//   playPrevious: () => void;
//   progress: number;
//   duration: number; 
//   setPlaylist: (songs: Song[]) => void; 
// }

// const MusicContext = createContext<MusicContextType | undefined>(undefined);

// export const useMusicPlayer = () => {
//   const context = useContext(MusicContext);
//   if (context === undefined) {
//     throw new Error('useMusicPlayer must be used within a MusicProvider');
//   }
//   return context;
// };

// interface MusicProviderProps {
//   children: ReactNode;
// }

// export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
//   const [currentSong, setCurrentSongState] = useState<Song | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const setCurrentSong = (song: Song) => {
//     setCurrentSongState(song);
//     setIsPlaying(true);
//     setProgress(0);
//   };

//   const togglePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const playNext = () => {
//     // TODO: Implement playlist logic
//     console.log('Playing next song');
//   };

//   const playPrevious = () => {
//     // TODO: Implement playlist logic
//     console.log('Playing previous song');
//   };

//   return (
//     <MusicContext.Provider
//       value={{
//         currentSong,
//     setCurrentSong,
//     isPlaying,
//     togglePlayPause,
//     playNext,
//     playPrevious,
//     progress,
//     duration,        
//     setPlaylist,   
//       }}
//     >
//       {children}
//     </MusicContext.Provider>
//   );
// };