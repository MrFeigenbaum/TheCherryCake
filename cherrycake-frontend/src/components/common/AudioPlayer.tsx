import { useState, useEffect, useRef } from 'react';

export interface AudioTrack {
  title: string;
  url: string;
}

const FALLBACK_PLAYLIST: AudioTrack[] = [
  {
    title: 'Mellow Fox - Backyard',
    url: '/assets/audio/Mellow Fox - Backyard.m4a',
  },
  {
    title: 'Rio - Fly Love',
    url: '/assets/audio/Rio - Fly Love.m4a',
  },
  {
    title: 'Notre Dame de Paris - Belle',
    url: '/assets/audio/Notre Dame de Paris - Belle.m4a',
  },
  {
    title: 'Garou - Je Nattendais Que Vous',
    url: '/assets/audio/Garou - Je Nattendais Que Vous.mp3',
  },
  {
    title: 'Notre Dame de Paris - Lune',
    url: '/assets/audio/Notre Dame de Paris - Lune.mp3',
  },
];

export function AudioPlayer() {
  const [playlist, setPlaylist] = useState<AudioTrack[]>(FALLBACK_PLAYLIST);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFirstMount = useRef(true);

  const bar0Ref = useRef<HTMLSpanElement | null>(null);
  const bar1Ref = useRef<HTMLSpanElement | null>(null);
  const bar2Ref = useRef<HTMLSpanElement | null>(null);
  const bar3Ref = useRef<HTMLSpanElement | null>(null);

  // Load playlist dynamically from public JSON
  useEffect(() => {
    fetch('/assets/audio/playlist.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted: AudioTrack[] = data
            .map((d: { title?: string; url?: string }) => ({
              title: d.title || 'Cherry Cake Melody',
              url: d.url ? (d.url.startsWith('/') ? d.url : `/${d.url}`) : '',
            }))
            .filter((t) => Boolean(t.url));

          if (formatted.length > 0) {
            setPlaylist(formatted);
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentTrack = playlist[trackIndex] || playlist[0];

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Autoplay on first user click anywhere on page (browser policy compliance)
  useEffect(() => {
    let hasInteracted = false;
    const handleFirstClick = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }
    };

    document.addEventListener('click', handleFirstClick, { once: true });
    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [playlist]);

  // When track index changes, play if already playing
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (audioRef.current && isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [trackIndex, isPlaying]);

  // Equalizer animation synchronized with isPlaying
  useEffect(() => {
    const bars = [bar0Ref.current, bar1Ref.current, bar2Ref.current, bar3Ref.current];

    if (!isPlaying) {
      bars.forEach((b) => {
        if (b) b.style.height = '3px';
      });
      return;
    }

    let animId: number;
    const updateFrame = () => {
      const t = performance.now() / 220;
      const h0 = Math.max(3, Math.min(14, Math.round(6 + 4 * Math.sin(t * 1.5))));
      const h1 = Math.max(3, Math.min(16, Math.round(9 + 6 * Math.cos(t * 1.8))));
      const h2 = Math.max(3, Math.min(15, Math.round(8 + 5 * Math.sin(t * 2.2))));
      const h3 = Math.max(3, Math.min(13, Math.round(5 + 4 * Math.cos(t * 1.2))));

      if (bar0Ref.current) bar0Ref.current.style.height = `${h0}px`;
      if (bar1Ref.current) bar1Ref.current.style.height = `${h1}px`;
      if (bar2Ref.current) bar2Ref.current.style.height = `${h2}px`;
      if (bar3Ref.current) bar3Ref.current.style.height = `${h3}px`;

      animId = requestAnimationFrame(updateFrame);
    };

    animId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <div className="audio-bar" id="audioBar" role="region" aria-label="Artisanal Music Player">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        preload="auto"
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* LEFT: Spinning Vinyl Disc & Track Details */}
      <div className="audio-left">
        <div className={`audio-disc ${isPlaying ? 'spinning' : ''}`} id="audioDisc">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          </svg>
        </div>
        <div className="audio-details">
          <span className="audio-track-name" title={currentTrack?.title}>
            {currentTrack?.title || 'Cherry Cake Melody'}
          </span>
          <span className="audio-status-label">
            <span className={`audio-equalizer ${isPlaying ? 'playing' : ''}`} id="audioEq">
              <span ref={bar0Ref} className="eq-bar bar-1"></span>
              <span ref={bar1Ref} className="eq-bar bar-2"></span>
              <span ref={bar2Ref} className="eq-bar bar-3"></span>
              <span ref={bar3Ref} className="eq-bar bar-4"></span>
            </span>
            <span>{isPlaying ? 'Now Playing' : 'Paused'}</span>
          </span>
        </div>
      </div>

      {/* CENTER: Navigation & Play/Pause */}
      <div className="audio-center-controls">
        <button
          type="button"
          className="audio-nav-btn"
          id="prevTrackBtn"
          onClick={handlePrev}
          title="Previous Track"
          aria-label="Previous Track"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </button>

        <button
          type="button"
          className="play-toggle-btn"
          id="playBtn"
          onClick={togglePlay}
          title={isPlaying ? 'Pause music' : 'Play music'}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="audio-nav-btn"
          id="nextTrackBtn"
          onClick={handleNext}
          title="Next Track"
          aria-label="Next Track"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </button>
      </div>

      {/* RIGHT: Volume Slider */}
      <div className="audio-right">
        <div className="volume-box">
          <svg className="volume-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            className="volume-input"
            id="volumeSlider"
            min="0"
            max="1"
            step="0.02"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
