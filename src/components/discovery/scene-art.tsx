import { useEffect, useState } from "react";
import { themeTint } from "@/lib/discovery/theme-tint";

/**
 * Scene art with skeleton shimmer + graceful theme-watermark fallback.
 * Shimmer is tinted with the case's theme accent so loading carries the
 * mission's atmosphere instead of generic grey.
 */
export function SceneArt({
  src,
  theme,
  brighten = false,
}: {
  src: string | null;
  theme?: string;
  brighten?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );

  useEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src]);

  const tint = themeTint(theme);

  return (
    <>
      {status === "loading" && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${tint.glow}, ${tint.base} 70%)`,
          }}
        >
          <div
            className="absolute inset-0 motion-safe:animate-[shimmer_2.4s_ease-in-out_infinite] bg-[length:200%_100%]"
            style={{
              backgroundImage: `linear-gradient(110deg, transparent 30%, ${tint.shimmer} 50%, transparent 70%)`,
            }}
          />
        </div>
      )}

      {status === "error" && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${tint.glow}, transparent 70%)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display text-[0.55rem] tracking-[0.5em] uppercase"
              style={{ color: tint.label }}
            >
              {theme ?? "Case File"}
            </span>
          </div>
        </div>
      )}

      {src && status !== "error" && (
        <img
          src={src}
          alt=""
          decoding="async"
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0) setStatus("loaded");
          }}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          style={
            brighten
              ? {
                  filter: "brightness(1.6) contrast(1.12) saturate(1.1)",
                  objectPosition: "center 30%",
                }
              : undefined
          }
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}
