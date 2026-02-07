export default function NotFoundPage() {
  const stars = [
    { left: "6%", top: "22%", size: 16 },
    { left: "44%", top: "9%", size: 14 },
    { left: "86%", top: "22%", size: 16 },
    { left: "19%", top: "73%", size: 12 },
    { left: "73%", top: "72%", size: 14 },
    { left: "87.5%", top: "76%", size: 14 },
    { left: "7.5%", top: "87%", size: 14 },
    { left: "56%", top: "89.5%", size: 12 },
  ] as const;

  return (
    <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-white px-6 py-12">
      {stars.map((star, index) => (
        <span
          key={`${star.left}-${star.top}`}
          className="pointer-events-none absolute rounded-full bg-[#dce4ff] animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${index * 120}ms`,
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        <h1 className="text-[clamp(7rem,18vw,11rem)] font-black leading-[0.88] tracking-[-0.04em] text-[#19157d]">
          404
        </h1>
        <p className="-mt-1 text-[clamp(1.8rem,4.2vw,2.7rem)] font-medium tracking-[0.01em] text-[#19157d]">
          Landing on wrong planet
        </p>
      </div>
    </div>
  );
}
