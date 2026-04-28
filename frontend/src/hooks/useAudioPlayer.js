import { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../stores/playerStore';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { isLiveStream, currentMessage, isPlaying, setIsPlaying } = usePlayerStore();

  // Determine audio source
  const audioSrc = currentMessage?.audioUrl || 'https://radio.ifastekpanel.com:1765/stream';

  // Update source when message changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error(e));
      }
    }
  }, [audioSrc]);

  // Play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setError(null);
  };

  // Mute/unmute
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Volume change
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume[0]);
    if (newVolume[0] === 0 && !isMuted) setIsMuted(true);
    if (newVolume[0] > 0 && isMuted) setIsMuted(false);
  };

  // Seek function
  const seek = (seconds) => {
    if (audioRef.current && isFinite(seconds)) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setError(null);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setError('Failed to play audio. Please try again.');
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnded = () => {
      setCurrentTime(0);
      setIsPlaying(false);
    };

    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(console.error);
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  return {
    audioRef,
    isPlaying,
    isMuted,
    volume,
    isLoading,
    error,
    togglePlayPause,
    toggleMute,
    handleVolumeChange,
    audioSrc,
    currentTime,
    duration,
    seek,
  };
};