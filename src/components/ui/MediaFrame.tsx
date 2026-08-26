import Image from "next/image";
import SceneArt, { isSceneRef, sceneKeyOf, type SceneDetail } from "@/components/art/SceneArt";
import { supabaseHost } from "@/lib/supabase/config";

const VIDEO_PATTERN = /\.(mp4|webm|mov|m4v)(\?|$)/i;

export function isVideoSrc(src: string | null | undefined) {
  return typeof src === "string" && VIDEO_PATTERN.test(src);
}

/** next/image only optimizes hosts listed in next.config.ts's remotePatterns (our Supabase storage). */
function isOptimizableSrc(src: string) {
  if (!supabaseHost) return false;
  try {
    return new URL(src, "http://placeholder").hostname === supabaseHost;
  } catch {
    return false;
  }
}

/**
 * One media slot for the whole site: an uploaded photo, an uploaded video, an
 * external link, or one of the brand-drawn animated scenes (`scene:*`).
 * Everything the dashboard can store renders through here.
 */
export default function MediaFrame({
  src,
  alt,
  className = "",
  priority = false,
  poster,
  fallbackScene = "shanghai",
  sceneDetail = "lite",
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  poster?: string | null;
  fallbackScene?: string;
  /** "full" for large singular placements (hero, page banners); "lite" (default) for cards/grids/thumbnails. */
  sceneDetail?: SceneDetail;
  /** next/image `sizes` hint — override for small slots (avatars, marquee cards) so they don't request a full-width source. */
  sizes?: string;
}) {
  if (!src || isSceneRef(src)) {
    return (
      <SceneArt
        scene={src ? sceneKeyOf(src) : sceneKeyOf(`scene:${fallbackScene}`)}
        detail={sceneDetail}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  if (isVideoSrc(src)) {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        src={src}
        poster={poster ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={alt}
      />
    );
  }

  if (isOptimizableSrc(src)) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
          {...(priority ? {} : { loading: "lazy" as const })}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
