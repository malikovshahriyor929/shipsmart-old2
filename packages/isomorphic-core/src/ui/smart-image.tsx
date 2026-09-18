"use client";

import React from "react";
import Image from "next/image";
import cn from "@core/utils/class-names";
import { PLACEHOLDER_GLOBAL } from "@core/config/constants";
import Shimmer from "@core/ui/skeletons/shimmer";

export interface SmartImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "onLoad"> {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  imgClassName?: string;
  onLoaded?: () => void;
  fallbackSrc?: string;
}

function normalizeSrc(s?: string | null, fb?: string) {
  const v = (s ?? "").trim();
  return v.length ? v : (fb ?? PLACEHOLDER_GLOBAL);
}

function isInternalHost(url: string) {
  try {
    const u = new URL(
      url,
      typeof window !== "undefined" ? window.location.href : "http://localhost"
    );
    const h = u.hostname;
    return (
      h.startsWith("172.") || h.startsWith("10.") || h.startsWith("192.168.")
    );
  } catch {
    return false;
  }
}

export default function SmartImage({
  src,
  alt = "Image",
  className,
  imgClassName,
  onLoaded,
  fallbackSrc = PLACEHOLDER_GLOBAL,
  ...rest
}: SmartImageProps) {
  const [resolvedSrc, setResolvedSrc] = React.useState(() =>
    normalizeSrc(src, fallbackSrc)
  );
  const [loading, setLoading] = React.useState(true);
  const triedFallbackRef = React.useRef(resolvedSrc === fallbackSrc);

  // Reset on src change
  React.useEffect(() => {
    const next = normalizeSrc(src, fallbackSrc);
    setResolvedSrc(next);
    setLoading(true);
    triedFallbackRef.current = next === fallbackSrc;
  }, [src, fallbackSrc]);

  const finish = React.useCallback(() => {
    setLoading(false);
    onLoaded?.();
  }, [onLoaded]);

  const fail = React.useCallback(() => {
    if (!triedFallbackRef.current) {
      triedFallbackRef.current = true;
      setResolvedSrc(fallbackSrc);
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [fallbackSrc]);

  const nativeImg = isInternalHost(resolvedSrc);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-primary/5 dark:bg-gray-200",
        className
      )}
      {...rest}
    >
      {loading && (
        <div className="absolute inset-0">
          <Shimmer className="h-full w-full" rounded="rounded-inherit" />
        </div>
      )}

      {nativeImg ? (
        <img
          key={resolvedSrc}
          src={resolvedSrc}
          alt={alt}
          onLoad={finish}
          onError={fail}
          decoding="async"
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            loading ? "opacity-0" : "opacity-100",
            imgClassName
          )}
        />
      ) : (
        <Image
          key={resolvedSrc}
          src={resolvedSrc}
          alt={alt}
          fill
          sizes="100vw"
          loading="lazy"
          // unoptimized={false}
          onLoad={finish}
          onLoadingComplete={finish}
          onError={fail}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            loading ? "opacity-0" : "opacity-100",
            imgClassName
          )}
        />
      )}
    </div>
  );
}
