import SceneArt, { isSceneRef, sceneKeyOf } from "@/components/art/SceneArt";

/**
 * Renders either an uploaded/linked photograph or one of the brand-drawn
 * vector scenes (`scene:*`). Keeps every media slot in the site swappable from
 * the dashboard without touching code.
 */
export default function MediaImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src || isSceneRef(src)) {
    return (
      <SceneArt
        scene={src ? sceneKeyOf(src) : "shanghai"}
        className={`h-full w-full object-cover ${className}`}
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
