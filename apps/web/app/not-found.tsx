"use client";

import Link from "next/link";
import * as React from "react";

const STARFIELD = Array.from({ length: 30 }, (_, index) => ({
  left: (index * 31) % 100,
  top: (index * 19 + 7) % 100,
  size: (index % 4) + 2,
  delayMs: index * 90,
}));

export default function NotFoundPage() {
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-dvh w-screen items-center justify-center overflow-hidden bg-[#0a1028]"
      onPointerMove={handlePointerMove}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 700px at 20% 20%, rgba(64,170,255,0.22), transparent 60%), radial-gradient(900px 600px at 85% 80%, rgba(255,122,122,0.24), transparent 62%), linear-gradient(170deg, #0a1028 0%, #0e1b44 55%, #120c2e 100%)",
        }}
      />

      {STARFIELD.map((star) => (
        <span
          key={`${star.left}-${star.top}-${star.size}`}
          className="pointer-events-none absolute rounded-full bg-white/75 animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delayMs}ms`,
          }}
        />
      ))}

      <div
        className="pointer-events-none absolute h-[28rem] w-[28rem] rounded-full border border-cyan-200/30"
        style={{
          transform: `translate(${pointer.x * -14}px, ${pointer.y * -14}px)`,
          transition: "transform 160ms ease-out",
        }}
      />
      <div
        className="pointer-events-none absolute h-40 w-40 rounded-full bg-cyan-300/30 blur-2xl"
        style={{
          left: "18%",
          top: "20%",
          transform: `translate(${pointer.x * -24}px, ${pointer.y * -24}px)`,
          transition: "transform 180ms ease-out",
        }}
      />
      <div
        className="pointer-events-none absolute h-52 w-52 rounded-full bg-rose-300/25 blur-2xl"
        style={{
          right: "16%",
          bottom: "16%",
          transform: `translate(${pointer.x * -20}px, ${pointer.y * -20}px)`,
          transition: "transform 180ms ease-out",
        }}
      />
      <div
        className="pointer-events-none absolute h-28 w-28 rounded-full border-4 border-cyan-200/80 bg-cyan-100/20"
        style={{
          left: "24%",
          top: "62%",
          transform: `translate(${pointer.x * 20}px, ${pointer.y * 20}px)`,
          transition: "transform 120ms ease-out",
        }}
      />
      <div
        className="pointer-events-none absolute h-16 w-16 rounded-full border-2 border-amber-200/80 bg-amber-100/30"
        style={{
          right: "28%",
          top: "26%",
          transform: `translate(${pointer.x * 26}px, ${pointer.y * 26}px)`,
          transition: "transform 120ms ease-out",
        }}
      />

      <div className="relative z-10 mx-6 w-full max-w-2xl rounded-3xl border border-white/25 bg-white/10 p-8 text-center shadow-[0_30px_120px_-48px_rgba(1,10,35,0.95)] backdrop-blur-md sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">Lost In Orbit</p>
        <h1 className="mt-3 text-[clamp(5.5rem,17vw,11rem)] font-black leading-[0.82] tracking-[-0.05em] text-white">
          404
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-balance text-[clamp(1.1rem,2.9vw,1.7rem)] font-medium text-blue-100/95">
          This page drifted out of range. Move your cursor to steer the starfield and find your way home.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-w-40 items-center justify-center rounded-xl border border-cyan-200/45 bg-cyan-300/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-300/35"
          >
            Return To Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-w-40 items-center justify-center rounded-xl border border-white/45 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
