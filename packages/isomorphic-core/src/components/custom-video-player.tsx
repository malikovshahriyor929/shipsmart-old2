"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  PiPlay,
  PiPause,
  PiSpeakerHigh,
  PiSpeakerSlash,
  PiArrowsOut,
  PiArrowsIn,
  PiCaretDoubleRightBold,
  PiCaretDoubleLeftBold,
  PiSpinner,
} from "react-icons/pi";
import cn from "@core/utils/class-names";

function fmt(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = Math.floor(t % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const IS_IOS =
  typeof navigator !== "undefined" &&
  (/iPhone|iPad|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as Mac with touch
    (/Mac/.test(navigator.platform) &&
      typeof (window as any).ontouchend !== "undefined"));

export default function CustomVideoPlayer({
  src,
  poster,
  autoPlay = false,
  defaultVolume = 0.8,
  className,
  onProgress,
  onEnded,
  onPlayChange,
  onTime,
  onSeek,
  size,
}: {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  defaultVolume?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  onProgress?: (percent: number) => void; // 0..100
  onEnded?: () => void;
  onPlayChange?: (playing: boolean) => void;
  onTime?: (current: number, duration: number) => void;
  onSeek?: (
    kind: "start" | "end" | "jump",
    info?: { from?: number; to?: number }
  ) => void;
}) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const lastPctRef = useRef<number>(-1);

  // video state
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [buffered, setBuffered] = useState(0); // 0..1
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(clamp(defaultVolume, 0, 1));
  const [rate, setRate] = useState(1);
  const [fs, setFs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);

  // UI state
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);

  // timers
  const hideTimerRef = useRef<number | null>(null);

  // HUD (skip overlay) — text inside, icons outside, transforms on icons only
  const [hud, setHud] = useState<null | {
    dir: "left" | "right";
    amount: number;
    key: number;
    visible: boolean;
  }>(null);
  const hudHideRef = useRef<number | null>(null);
  const hudAccumRef = useRef<{
    dir: "left" | "right" | null;
    amount: number;
    ts: number;
  }>({
    dir: null,
    amount: 0,
    ts: 0,
  });

  // ===== helpers =====
  function setCurrentTime(newTime: number) {
    const v = videoRef.current;
    if (!v) return;
    const from = v.currentTime ?? 0;
    v.currentTime = clamp(newTime, 0, v.duration || 0);
    onSeek?.("jump", { from, to: v.currentTime });
  }

  function skipAndHUD(delta: number) {
    const dir: "left" | "right" = delta >= 0 ? "right" : "left";
    const abs = Math.abs(delta);
    const now = Date.now();
    const fast =
      now - hudAccumRef.current.ts < 500 && hudAccumRef.current.dir === dir;
    const amount = fast ? hudAccumRef.current.amount + abs : abs;

    hudAccumRef.current = { dir, amount, ts: now };

    setHud({ dir, amount, key: now, visible: false });
    requestAnimationFrame(() =>
      setHud((h) => (h ? { ...h, visible: true } : h))
    );

    if (hudHideRef.current) window.clearTimeout(hudHideRef.current);
    hudHideRef.current = window.setTimeout(() => setHud(null), 2000);

    const v = videoRef.current;
    const base = v?.currentTime || 0;
    setCurrentTime(base + delta);
    showControls();
  }

  function onSeekPercent(p: number) {
    const v = videoRef.current;
    if (!v || !duration) return;
    setCurrentTime(clamp(p, 0, 1) * duration);
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
    onSeek?.("start");
    handleProgressPointer(e);
    showControls();
  }
  function moveScrub(e: React.PointerEvent<HTMLDivElement>) {
    if (!scrubbing) return;
    handleProgressPointer(e);
  }
  function endScrub(e: React.PointerEvent<HTMLDivElement>) {
    setScrubbing(false);
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    onSeek?.("end");
    showControls();
  }

  // iOS audio unlock on first tap
  const unlockedRef = useRef(false);
  function ensureIOSAudioUnlocked() {
    if (!IS_IOS || unlockedRef.current === true) return;
    const v = videoRef.current;
    if (!v) return;
    // Make sure it's unmuted and attempt a play() inside user gesture
    try {
      v.muted = false;
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    } catch {}
    unlockedRef.current = true;
  }

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    ensureIOSAudioUnlocked();
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  function toggleFullscreen() {
    const el = containerRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    // Prefer standards API
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((v as any).webkitEnterFullscreen) {
        // iOS Safari video fullscreen
        (v as any).webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((v as any).webkitExitFullscreen) {
        (v as any).webkitExitFullscreen();
      }
    }
  }

  function stepSpeed(delta: number) {
    setRate((r) => {
      const table = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      const idx = table.findIndex((x) => Math.abs(x - r) < 0.001);
      const next = clamp(idx + Math.sign(delta), 0, table.length - 1);
      return table[next];
    });
  }

  function clearHideTimer() {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }
  function scheduleHide() {
    clearHideTimer();
    if (playing && !scrubbing) {
      hideTimerRef.current = window.setTimeout(
        () => setControlsVisible(false),
        2000
      );
    }
  }
  function showControls() {
    setControlsVisible(true);
    scheduleHide();
  }

  // ===== mount listeners =====
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Be defensive: ensure inline on iOS
    if (IS_IOS) {
      v.setAttribute("playsinline", "true");
      (v as any).setAttribute("webkit-playsinline", "true");
      v.setAttribute("x-webkit-airplay", "allow");
    }

    const onLoaded = () => {
      if (Number.isFinite(v.duration)) {
        setDuration(v.duration);
      }
      setLoading(false);
      if (autoPlay) v.play().catch(() => {});
    };
    const onDurationChange = () => {
      if (Number.isFinite(v.duration)) {
        setDuration(v.duration);
      }
    };
    const onTimeUpdate = () => {
      const cur = v.currentTime || 0;
      setTime(cur);
      onTime?.(cur, v.duration || 0);

      if (v.duration && isFinite(v.duration) && v.duration > 0) {
        const pct = Math.max(
          0,
          Math.min(100, Math.floor((cur / v.duration) * 100))
        );
        if (pct !== lastPctRef.current) {
          lastPctRef.current = pct;
          onProgress?.(pct);
        }
      }
    };
    const onPlay = () => {
      // make sure audio isn't muted accidentally on iOS
      if (IS_IOS && v.muted && vol > 0) v.muted = false;
      setPlaying(true);
      setWaiting(false);
      onPlayChange?.(true);
      scheduleHide();
    };
    const onPause = () => {
      setPlaying(false);
      onPlayChange?.(false);
      clearHideTimer();
      setControlsVisible(true);
    };
    const onProg = () => {
      try {
        if (!v.duration || v.buffered.length === 0) return setBuffered(0);
        const end = v.buffered.end(v.buffered.length - 1);
        setBuffered(clamp(end / v.duration, 0, 1));
      } catch {
        setBuffered(0);
      }
    };
    const onEndedCb = () => {
      if (duration > 0) {
        lastPctRef.current = 100;
        onProgress?.(100);
      }
      onEnded?.();
      clearHideTimer();
      setControlsVisible(true);
    };
    const onWaiting = () => setWaiting(true);
    const onCanPlay = () => {
      setLoading(false);
      setWaiting(false);
    };
    const onLoadStart = () => setLoading(true);
    const onSeeking = () => setWaiting(true);
    const onSeeked = () => setWaiting(false);
    const onFsChange = () => setFs(Boolean(document.fullscreenElement));

    // Check availability immediately in case we missed the event
    if (v.readyState >= 1) {
      onLoaded();
    }

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("durationchange", onDurationChange);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("progress", onProg);
    v.addEventListener("ended", onEndedCb);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("loadstart", onLoadStart);
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("seeked", onSeeked);
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("durationchange", onDurationChange);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("progress", onProg);
      v.removeEventListener("ended", onEndedCb);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadstart", onLoadStart);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("seeked", onSeeked);
      document.removeEventListener("fullscreenchange", onFsChange);
      clearHideTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, onProgress, onEnded, onPlayChange, onTime, duration, vol]);

  // reveal controls on interaction + unlock iOS audio
  useEffect(() => {
    const onMove = () => showControls();
    const onTouch = () => {
      ensureIOSAudioUnlocked();
      showControls();
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("keydown", onMove);
    return () => {
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onMove);
    };
  }, [playing, scrubbing]);

  // keyboard shortcuts (non-iOS mostly)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase?.();
      if (tag === "input" || tag === "textarea") return;
      const v = videoRef.current;
      if (!v) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "arrowright":
          skipAndHUD(+5);
          break;
        case "arrowleft":
          skipAndHUD(-5);
          break;
        case "arrowup":
          setVol((x) => clamp(x + 0.05, 0, 1));
          break;
        case "arrowdown":
          setVol((x) => clamp(x - 0.05, 0, 1));
          break;
        case "m":
          setMuted((m) => !m);
          break;
        case "f":
          toggleFullscreen();
          break;
        case ".":
          stepSpeed(+0.25);
          break;
        case ",":
          stepSpeed(-0.25);
          break;
        case "0":
          setCurrentTime(0);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // reflect volume & mute
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (IS_IOS) {
      // Do not touch v.volume on iOS; only manage muted flag
      v.muted = muted || vol === 0;
    } else {
      v.muted = muted;
      v.volume = vol;
    }
  }, [muted, vol]);

  // reflect speed
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
  }, [rate]);

  // double-tap zones (±10s)
  const lastLeftTapRef = useRef<number>(0);
  const lastRightTapRef = useRef<number>(0);
  function handleZoneTouch(dir: "left" | "right") {
    ensureIOSAudioUnlocked();
    const now = Date.now();
    const last =
      dir === "left" ? lastLeftTapRef.current : lastRightTapRef.current;
    if (now - last < 350) {
      skipAndHUD(dir === "left" ? -10 : +10);
      if (dir === "left") lastLeftTapRef.current = 0;
      else lastRightTapRef.current = 0;
    } else {
      if (dir === "left") lastLeftTapRef.current = now;
      else lastRightTapRef.current = now;
    }
  }

  const progress = duration ? time / duration : 0;

  const pill =
    "rounded-full bg-black/20 backdrop-blur-sm ring-1 ring-white/10 text-white flex items-center justify-center gap-1 px-1.5 py-0.5 lg:py-1";
  const iconBtn = "size-8 md:size-9 lg:size-10 hover:bg-black/30 p-0.5";

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative overflow-hidden shadow-sm rounded-lg md:rounded-xl bg-black/20",
        className
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        className="h-full w-full bg-black/20 object-contain object-center"
        onClick={togglePlay}
        onTouchStart={ensureIOSAudioUnlocked}
      />

      {/* Double-tap zones (±10s) */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3">
        <div
          className="pointer-events-auto"
          onDoubleClick={() => skipAndHUD(-10)}
          onTouchStart={() => handleZoneTouch("left")}
        />
        <div />
        <div
          className="pointer-events-auto"
          onDoubleClick={() => skipAndHUD(+10)}
          onTouchStart={() => handleZoneTouch("right")}
        />
      </div>

      {/* Big center Play when paused or Loading */}
      {(!playing || waiting) && (
        <button
          type="button"
          aria-label={
            waiting
              ? (t("commons.loading") ?? "Loading")
              : (t("commons.play") ?? "Play")
          }
          onClick={waiting ? undefined : togglePlay}
          className={cn(
            "absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm",
            size === "sm" && "!size-12",
            waiting && "cursor-wait"
          )}
        >
          {waiting ? (
            <PiSpinner
              className={cn("h-8 w-8 animate-spin", size === "sm" && "!size-8")}
            />
          ) : (
            <PiPlay className={cn("h-8 w-8", size === "sm" && "!size-8")} />
          )}
        </button>
      )}

      {/* HUD for seek (+N / -N): text inner, icon outer; transform on icons; slight text pulse */}
      {hud && (
        <div
          key={hud.key}
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 select-none transition-opacity duration-200",
            hud.dir === "left" ? "left-6" : "right-6",
            hud.visible ? "opacity-100" : "opacity-30"
          )}
        >
          <div className="flex items-center gap-1.5 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm">
            {hud.dir === "left" ? (
              <>
                <PiCaretDoubleLeftBold
                  className={cn(
                    "size-5 lg:size-6 transition-transform duration-300 will-change-transform",
                    hud.visible ? "translate-x-0" : "translate-x-2"
                  )}
                />
                <span
                  className={cn(
                    "text-sm lg:text-lg font-semibold transition-transform duration-200 will-change-transform",
                    hud.visible ? "scale-105" : "scale-100"
                  )}
                >
                  -{hud.amount}
                </span>
              </>
            ) : (
              <>
                <span
                  className={cn(
                    "text-sm lg:text-lg font-semibold transition-transform duration-200 will-change-transform",
                    hud.visible ? "scale-105" : "scale-100"
                  )}
                >
                  +{hud.amount}
                </span>
                <PiCaretDoubleRightBold
                  className={cn(
                    "size-5 lg:size-6 transition-transform duration-300 will-change-transform",
                    hud.visible ? "translate-x-0" : "-translate-x-2"
                  )}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 select-none transition-all duration-400 ease-in-out",
          controlsVisible || !playing || scrubbing ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

        <div className="relative z-10 px-2 pb-2 lg:px-3 lg:pb-3">
          {/* Seek bar */}
          <div
            ref={progressRef}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((duration ? time / duration : 0) * 100)}
            onPointerDown={startScrub}
            onPointerMove={moveScrub}
            onPointerUp={endScrub}
            onClick={handleProgressPointer}
            className="pointer-events-auto mx-0 mt-2 h-2 cursor-pointer rounded-full bg-white/20 ring-1 ring-white/10 relative"
          >
            <div
              className="absolute h-full left-0 top-0 rounded-full bg-white/35 transition-all duration-300 pointer-events-none"
              style={{ width: `${buffered * 100}%` }}
            />
            <div
              className="absolute h-full left-0 top-0 rounded-full bg-green pointer-events-none"
              style={{
                width: `${Math.min(100, (duration ? time / duration : 0) * 100)}%`,
              }}
            >
              <div className="absolute -right-1 top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow" />
            </div>
          </div>

          {/* Control Row */}
          <div className="pointer-events-auto mt-2 md:mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={
                  playing
                    ? (t("commons.pause") ?? "Pause")
                    : (t("commons.play") ?? "Play")
                }
                onClick={togglePlay}
                className={cn(iconBtn, pill, "hidden md:flex")}
              >
                {playing ? (
                  <PiPause className="size-5 lg:size-7" />
                ) : (
                  <PiPlay className="size-5 lg:size-7" />
                )}
              </button>

              {/* Volume (on iOS this is a visual control; use hardware buttons) */}
              <div className={cn(pill)}>
                <button
                  type="button"
                  aria-label={
                    muted
                      ? (t("commons.unmute") ?? "Unmute")
                      : (t("commons.mute") ?? "Mute")
                  }
                  onClick={() => setMuted((m) => !m)}
                  className="rounded-full p-0.5 md:p-1 hover:bg-white/10"
                >
                  {muted || vol === 0 ? (
                    <PiSpeakerSlash className="size-5 lg:size-6" />
                  ) : (
                    <PiSpeakerHigh className="size-5 lg:size-6" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={muted ? 0 : vol}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVol(v);
                    if (v === 0) setMuted(true);
                    else if (muted) setMuted(false);
                  }}
                  className="h-0.5 lg:h-1 w-20 cursor-pointer accent-white sm:w-24"
                />
              </div>

              <div
                className={cn(
                  pill,
                  "text-xs px-2 sm:text-sm tabular-nums shrink-0 whitespace-nowrap"
                )}
              >
                {fmt(time)} / {fmt(duration)}
              </div>
            </div>

            <div className={cn(pill, "relative flex items-center gap-1")}>
              <div className="relative">
                <button
                  type="button"
                  aria-label={t("commons.playback-speed") ?? "Playback speed"}
                  onClick={() => setShowSpeed((s) => !s)}
                  className="rounded-full p-0.5 md:p-1 size-6 lg:size-8 flex items-center justify-center text:xs lg:text-sm hover:bg-white/10"
                  title={t("commons.speed") ?? "Speed"}
                >
                  {rate}×
                </button>
                {showSpeed && (
                  <div className="absolute bottom-8 lg:bottom-10 max-h-32 md:max-h-48 overflow-y-scroll right-0 z-10 w-28 bg-black/90 rounded-xl p-1 text-sm space-y-0.5 backdrop-blur-md ring-1 ring-white/10">
                    {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => {
                          setRate(r);
                          setShowSpeed(false);
                        }}
                        className={cn(
                          "block w-full rounded-lg px-3 py-1 text-left text-white text-xs hover:bg-white/10",
                          Math.abs(r - rate) < 0.001 && "bg-white/10"
                        )}
                      >
                        {r}×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-label={t("commons.fullscreen") ?? "Fullscreen"}
                onClick={toggleFullscreen}
                className="rounded-full p-0.5 md:p-1 hover:bg-white/10"
                title={t("commons.fullscreen") ?? "Fullscreen"}
              >
                {fs ? (
                  <PiArrowsIn className="size-5 lg:size-6" />
                ) : (
                  <PiArrowsOut className="size-5 lg:size-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* subtle hover curtain */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-all duration-300 ease-in-out",
          hovering || !playing || controlsVisible || scrubbing
            ? "opacity-100"
            : "opacity-0"
        )}
      />
    </div>
  );
}
