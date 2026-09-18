"use client";

import cn from "@core/utils/class-names";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiCaretDownBold,
  PiCaretUpBold,
  PiMusicNoteDuotone,
  PiPauseFill,
  PiPlayFill,
  PiSkipBackBold,
  PiSkipForwardBold,
  PiSpeakerHighBold,
  PiSpeakerSlashBold,
} from "react-icons/pi";
import { Tooltip } from "rizzui";

type ListeningAudioPlayerProps = {
  audioSrc?: string;
  title?: string;
  showSkipControls?: boolean;
};

const ListeningAudioPlayer = ({
  audioSrc = "/testAudio.mp3",
  title = "IELTS Listening",
  showSkipControls = false,
}: ListeningAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resumeAfterSeekRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.volume = volume;
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleSeekStart = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    resumeAfterSeekRef.current = isPlaying;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeekEnd = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (resumeAfterSeekRef.current) {
      audio.play();
      setIsPlaying(true);
    }

    resumeAfterSeekRef.current = false;
  };

  const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const progressPercent = useMemo(() => {
    if (!duration) {
      return 0;
    }

    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-full">
      {/* Main Player Container */}
      <div
        className={cn(
          "w-full border-b border-gray-100 bg-white transition-all duration-300 ease-out",
          "shadow-sm"
        )}
      >
        {/* Expanded State */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isExpanded
              ? "max-h-48 opacity-100 md:max-h-24"
              : "max-h-0 opacity-0"
          )}
        >
          {/* Desktop Layout (md and above) */}
          <div className="hidden items-center gap-4 px-4 py-3 md:flex">
            {/* Music Icon with Animation */}
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mainBlue/10 to-mainBlue/5 text-mainBlue",
                "transition-transform duration-300"
              )}
            >
              <div className={cn("relative")}>
                {!isPlaying && <PiMusicNoteDuotone className="size-6" />}
                {isPlaying && (
                  <span className="flex items-center gap-0.5">
                    <span
                      className="h-2 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                      style={{ animationDelay: "100ms" }}
                    ></span>
                    <span
                      className="h-3 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="h-4 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                      style={{ animationDelay: "100ms" }}
                    ></span>
                    <span
                      className="h-3 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                      style={{ animationDelay: "100ms" }}
                    ></span>
                    <span
                      className="h-2 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                      style={{ animationDelay: "200ms" }}
                    ></span>
                  </span>
                )}
              </div>
            </div>

            {/* Track Info & Controls */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {/* Title */}
                <div className="mr-2 min-w-0 shrink-0 truncate sm:max-w-64 lg:max-w-80">
                  <Tooltip size="sm" content={title}>
                    <h4 className="truncate text-sm font-semibold text-gray-800">
                      {title}
                    </h4>
                  </Tooltip>
                  <p className="text-xs text-gray-500">Audio Track</p>
                </div>

                {/* Playback Controls */}
                <div className="flex shrink-0 items-center gap-2">
                  {showSkipControls && (
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-mainBlue active:scale-95"
                    >
                      <PiSkipBackBold className="size-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={togglePlay}
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-full text-white shadow-md transition-all active:scale-95",
                      "bg-mainBlue hover:bg-mainBlue/90"
                    )}
                  >
                    {isPlaying ? (
                      <PiPauseFill className="size-5" />
                    ) : (
                      <PiPlayFill className="size-5" />
                    )}
                  </button>

                  {showSkipControls && (
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-mainBlue active:scale-95"
                    >
                      <PiSkipForwardBold className="size-4" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-gray-500">
                    {formatTime(currentTime)}
                  </span>

                  <div className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-gray-200">
                    {/* Progress Fill */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-mainBlue transition-[width] duration-100 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                    {/* Thumb */}
                    <div
                      className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-mainBlue opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                      style={{ left: `calc(${progressPercent}% - 6px)` }}
                    />
                    {/* Invisible range input */}
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step="0.1"
                      value={currentTime}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      onMouseDown={handleSeekStart}
                      onTouchStart={handleSeekStart}
                      onMouseUp={handleSeekEnd}
                      onTouchEnd={handleSeekEnd}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>

                  <span className="w-10 shrink-0 text-xs font-medium tabular-nums text-gray-500">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Volume Control */}
                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                    className="inline-flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-mainBlue"
                  >
                    {volume === 0 ? (
                      <PiSpeakerSlashBold className="size-4" />
                    ) : (
                      <PiSpeakerHighBold className="size-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mainBlue"
                  />
                </div>
              </div>
            </div>

            {/* Collapse/Expand Button */}
            <button
              type="button"
              onClick={toggleExpand}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-mainBlue"
            >
              <PiCaretUpBold className="size-4" />
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 px-4 py-3 md:hidden">
            {/* Top Row: Music Icon, Title, and Hide Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {/* Music Icon */}
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mainBlue/10 to-mainBlue/5 text-mainBlue"
                  )}
                >
                  <div className="relative">
                    {!isPlaying && <PiMusicNoteDuotone className="size-5" />}
                    {isPlaying && (
                      <span className="flex items-center gap-0.5">
                        <span
                          className="h-2 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                          style={{ animationDelay: "100ms" }}
                        ></span>
                        <span
                          className="h-3 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="h-4 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                          style={{ animationDelay: "100ms" }}
                        ></span>
                        <span
                          className="h-3 w-0.5 animate-[wave_0.5s_ease-in-out_infinite] rounded-full bg-mainBlue"
                          style={{ animationDelay: "100ms" }}
                        ></span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-gray-800">
                    {title}
                  </h4>
                  <p className="text-xs text-gray-500">Audio Track</p>
                </div>
              </div>

              {/* Hide Button */}
              <button
                type="button"
                onClick={toggleExpand}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all active:bg-gray-200"
              >
                <PiCaretUpBold className="size-4" />
              </button>
            </div>

            {/* Progress Bar Row */}
            <div className="flex items-center gap-2">
              <span className="w-9 shrink-0 text-xs font-medium tabular-nums text-gray-500">
                {formatTime(currentTime)}
              </span>

              <div className="group relative h-2 flex-1 cursor-pointer rounded-full bg-gray-200">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-mainBlue transition-[width] duration-100 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  onTouchStart={handleSeekStart}
                  onTouchEnd={handleSeekEnd}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>

              <span className="w-9 shrink-0 text-xs font-medium tabular-nums text-gray-500">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-center gap-4">
              {/* Skip Back */}
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all active:bg-gray-200"
              >
                <PiSkipBackBold className="size-5" />
              </button>

              {/* Play/Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className={cn(
                  "inline-flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95",
                  "bg-mainBlue hover:bg-mainBlue/90"
                )}
              >
                {isPlaying ? (
                  <PiPauseFill className="size-7" />
                ) : (
                  <PiPlayFill className="size-7" />
                )}
              </button>

              {/* Skip Forward */}
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all active:bg-gray-200"
              >
                <PiSkipForwardBold className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsed State */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            !isExpanded ? "max-h-14 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-2.5">
            <div className="flex items-center gap-3">
              {/* Mini Music Icon */}
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-mainBlue/10 to-mainBlue/5 text-mainBlue"
                )}
              >
                <PiMusicNoteDuotone className="size-5" />
              </div>

              {/* Mini Play Button */}
              <button
                type="button"
                onClick={togglePlay}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full text-white transition-all active:scale-95",
                  "bg-mainBlue hover:bg-mainBlue/90"
                )}
              >
                {isPlaying ? (
                  <PiPauseFill className="size-4" />
                ) : (
                  <PiPlayFill className="size-4" />
                )}
              </button>

              {/* Mini Progress */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium tabular-nums text-gray-500">
                  {formatTime(currentTime)}
                </span>
                <span className="text-xs text-gray-400">/</span>
                <span className="text-xs font-medium tabular-nums text-gray-500">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Expand Button */}
            <button
              type="button"
              onClick={toggleExpand}
              className="inline-flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-mainBlue"
            >
              <PiCaretDownBold className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* CSS for wave animation */}
      <style>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default ListeningAudioPlayer;
