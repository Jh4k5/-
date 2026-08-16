import SceneArt, { isSceneRef, sceneKeyOf } from "@/components/art/SceneArt";

const VIDEO_PATTERN = /\.(mp4|webm|mov|m4v)(\?|$)/i;

export function isVideoSrc(src: string | null | undefined) {
  return typeof src === "string" && VIDEO_PATTERN.test(src);
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
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  poster?: string | null;
  fallbackScene?: string;
}) {
  if (!src || isSceneRef(src)) {
    return (
      <SceneArt
        scene={src ? sceneKeyOf(src) : sceneKeyOf(`scene:${fallbackScene}`)}
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
