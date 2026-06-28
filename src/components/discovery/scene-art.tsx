import { useEffect, useState } from "react";

/**
 * Scene art with skeleton shimmer + graceful theme-watermark fallback.
 * Mirrors the implementation in /missions so every discovery surface
 * (hero, rail card, ledger row) renders art the same way.
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

  return (
    <>
      {status === "loading" && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden bg-foreground/[0.04]"
        >
          <div className="absolute inset-0 motion-safe:animate-[shimmer_2.4s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.04)_50%,transparent_70%)] bg-[length:200%_100%]" />
        </div>
      )}

      {status === "error" && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[0.55rem] tracking-[0.5em] uppercase text-foreground/25">
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
