'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PiPlay,
  PiPause,
  PiSpeakerHigh,
  PiSpeakerSlash,
  PiArrowsOut,
  PiArrowsIn,
  PiGear,
  PiPictureInPicture,
  PiXBold,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';

type Source = { label: string; url: string; type?: string };

function fmt(t: number) {
  if (!isFinite(t) || t < 0) return '0:00';
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const mm = h ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function CustomVideoPlayer({
  src,
  sources,
  poster,
  autoPlay = false,
  defaultVolume = 0.8,
  className,
  size,
}: {
  src?: string;
  sources?: Source[]; // optional multi-quality
  poster?: string;
  autoPlay?: boolean;
  defaultVolume?: number; // 0..1
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // pick initial source
  const initialIndex = useMemo(() => {
    if (sources?.length) return 0;
    return -1;
  }, [sources]);

  const [sourceIndex, setSourceIndex] = useState(initialIndex);
  const activeSrc = useMemo(
    () => (sources?.length ? sources[sourceIndex]?.url : src || ''),
    [src, sources, sourceIndex]
  );

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [buffered, setBuffered] = useState(0); // 0..1
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(clamp(defaultVolume, 0, 1));
  const [rate, setRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [fs, setFs] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  // metadata / time / buffer
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(v.duration || 0);
      setReady(true);
      if (autoPlay) {
        v.play().catch(() => {});
      }
    };
    const onTime = () => setTime(v.currentTime || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onProg = () => {
      try {
        if (!v.duration || v.buffered.length === 0) return setBuffered(0);
        const end = v.buffered.end(v.buffered.length - 1);
        setBuffered(clamp(end / v.duration, 0, 1));
      } catch {
        setBuffered(0);
      }
    };
    const onFsChange = () => setFs(Boolean(document.fullscreenElement));

    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('progress', onProg);
    document.addEventListener('fullscreenchange', onFsChange);

    return () => {
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('progress', onProg);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [autoPlay, activeSrc]);

  // apply volume & mute
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.volume = vol;
  }, [muted, vol]);

  // apply speed
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
  }, [rate]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase?.();
      if (tag === 'input' || tag === 'textarea') return;

      const v = videoRef.current;
      if (!v) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowright':
          v.currentTime = clamp(v.currentTime + 5, 0, v.duration || 0);
          break;
        case 'arrowleft':
          v.currentTime = clamp(v.currentTime - 5, 0, v.duration || 0);
          break;
        case 'arrowup':
          setVol((x) => clamp(x + 0.05, 0, 1));
          break;
        case 'arrowdown':
          setVol((x) => clamp(x - 0.05, 0, 1));
          break;
        case 'm':
          setMuted((m) => !m);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'p':
          togglePiP();
          break;
        case '.':
          stepSpeed(+0.25);
          break;
        case ',':
          stepSpeed(-0.25);
          break;
        case '0':
          v.currentTime = 0;
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }

  function onSeekPercent(p: number) {
    const v = videoRef.current;
    if (!v || !duration) return;
    v.currentTime = clamp(p, 0, 1) * duration;
  }

  function handleProgressPointer(e: React.PointerEvent<HTMLDivElement>) {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    onSeekPercent(ratio);
  }

  function startScrub(e: React.PointerEvent<HTMLDivElement>) {
    setScrubbing(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    handleProgressPointer(e);
  }
  function moveScrub(e: React.PointerEvent<HTMLDivElement>) {
    if (!scrubbing) return;
    handleProgressPointer(e);
  }
  function endScrub(e: React.PointerEvent<HTMLDivElement>) {
    setScrubbing(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  async function togglePiP() {
    const v = videoRef.current as any;
    // @ts-ignore
    if (document.pictureInPictureElement) {
      // @ts-ignore
      await document.exitPictureInPicture();
    } else if ('requestPictureInPicture' in v) {
      try {
        await v.requestPictureInPicture();
      } catch {}
    }
  }

  function changeQuality(nextIndex: number) {
    if (!sources?.length) return;
    const v = videoRef.current;
    if (!v) return;
    const wasPlaying = !v.paused;
    const cur = v.currentTime;

    setSourceIndex(nextIndex);
    setReady(false);

    // swap source by updating key on <video> for hard reload
    setTimeout(() => {
      const v2 = videoRef.current;
      if (!v2) return;
      v2.currentTime = cur;
      if (wasPlaying) v2.play().catch(() => {});
    }, 0);
  }

  function stepSpeed(delta: number) {
    setRate((r) => {
      const table = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      const idx = table.findIndex((x) => Math.abs(x - r) < 0.001);
      const next = clamp(idx + Math.sign(delta), 0, table.length - 1);
      return table[next];
    });
  }

  const progress = duration ? time / duration : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg bg-black',
        className,
        'group'
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        key={activeSrc} // force reload on quality change
        ref={videoRef}
        src={activeSrc}
        poster={poster}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        
      />

      {/* Big center Play/Pause */}
      {!playing && (
        <button
          aria-label="Play"
          onClick={togglePlay}
          className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <PiPlay className="h-8 w-8" />
        </button>
      )}

      {/* Controls bar */}
      <div
        className={cn(
          'pointer-events-auto absolute inset-x-0 bottom-0 select-none',
          'bg-gradient-to-t from-black/60 via-black/30 to-transparent'
        )}
      >
        {/* Seek bar */}
        <div
          ref={progressRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          onPointerDown={startScrub}
          onPointerMove={moveScrub}
          onPointerUp={endScrub}
          onClick={handleProgressPointer}
          className={cn(
            'mx-3 mt-2 h-2 cursor-pointer rounded-full',
            'bg-white/10'
          )}
        >
          {/* buffered */}
          <div
            className="h-2 rounded-full bg-white/25"
            style={{ width: `${buffered * 100}%` }}
          />
          {/* played */}
          <div
            className="relative -mt-2 h-2 rounded-full bg-green"
            style={{ width: `${progress * 100}%` }}
          >
            <div className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow" />
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex items-center justify-between px-3 py-2 text-white">
          {/* left cluster */}
          <div className="flex items-center gap-2">
            <button
              aria-label={playing ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="rounded p-2 hover:bg-white/10"
            >
              {playing ? (
                <PiPause className="h-6 w-6" />
              ) : (
                <PiPlay className="h-6 w-6" />
              )}
            </button>

            {/* time */}
            <div className="mx-1 text-xs tabular-nums">
              {fmt(time)} / {fmt(duration)}
            </div>

            {/* volume */}
            <div className="flex items-center">
              <button
                aria-label={muted ? 'Unmute' : 'Mute'}
                onClick={() => setMuted((m) => !m)}
                className="rounded p-2 hover:bg-white/10"
              >
                {muted || vol === 0 ? (
                  <PiSpeakerSlash className="h-6 w-6" />
                ) : (
                  <PiSpeakerHigh className="h-6 w-6" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : vol}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVol(v);
                  if (v === 0) setMuted(true);
                  else if (muted) setMuted(false);
                }}
                className="h-1 w-24 cursor-pointer accent-white"
              />
            </div>
          </div>

          {/* right cluster */}
          <div className="flex items-center gap-1">
            {/* speed */}
            <div className="relative">
              <button
                aria-label="Playback speed"
                onClick={() => {
                  setShowSpeed((s) => !s);
                  setShowQuality(false);
                  setShowSettings(false);
                }}
                className="rounded px-2 py-1 text-xs hover:bg-white/10"
                title="Speed"
              >
                {rate}×
              </button>
              {showSpeed && (
                <div className="absolute bottom-9 right-0 z-10 w-32 rounded bg-black/90 p-1 text-sm backdrop-blur">
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRate(r);
                        setShowSpeed(false);
                      }}
                      className={cn(
                        'block w-full rounded px-3 py-1 text-left hover:bg-white/10',
                        Math.abs(r - rate) < 0.001 && 'bg-white/10'
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* quality */}
            {!!sources?.length && (
              <div className="relative">
                <button
                  aria-label="Quality"
                  onClick={() => {
                    setShowQuality((s) => !s);
                    setShowSpeed(false);
                    setShowSettings(false);
                  }}
                  className="rounded px-2 py-1 text-xs hover:bg-white/10"
                  title="Quality"
                >
                  {sources[sourceIndex]?.label || 'Auto'}
                </button>
                {showQuality && (
                  <div className="absolute bottom-9 right-0 z-10 w-40 rounded bg-black/90 p-1 text-sm backdrop-blur">
                    {sources.map((s, i) => (
                      <button
                        key={s.label}
                        onClick={() => {
                          changeQuality(i);
                          setShowQuality(false);
                        }}
                        className={cn(
                          'block w-full rounded px-3 py-1 text-left hover:bg-white/10',
                          i === sourceIndex && 'bg-white/10'
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* settings button (placeholder for future) */}
            <div className="relative">
              <button
                aria-label="Settings"
                onClick={() => {
                  setShowSettings((s) => !s);
                  setShowSpeed(false);
                  setShowQuality(false);
                }}
                className="rounded p-2 hover:bg-white/10"
              >
                <PiGear className="h-5 w-5" />
              </button>
              {showSettings && (
                <div className="absolute bottom-10 right-0 z-10 w-44 rounded bg-black/90 p-2 text-sm backdrop-blur">
                  <div className="px-2 py-1 text-white/70">Settings</div>
                  <div className="px-2 py-1 text-xs text-white/50">
                    (Quality)
                  </div>
                </div>
              )}
            </div>

            {/* fullscreen */}
            <button
              aria-label="Fullscreen"
              onClick={toggleFullscreen}
              className="rounded p-2 hover:bg-white/10"
              title="Fullscreen"
            >
              {fs ? (
                <PiArrowsIn className="h-5 w-5" />
              ) : (
                <PiArrowsOut className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* subtle hover curtain so controls feel responsive */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity',
          hovering || !playing ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
}
