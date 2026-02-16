"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";

interface StableResponsiveContainerProps {
  className?: string;
  children: React.ReactElement;
}

export function StableResponsiveContainer({
  className,
  children,
}: StableResponsiveContainerProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateSize = () => {
      const { width, height } = host.getBoundingClientRect();
      setSize({
        width: Math.max(0, Math.round(width)),
        height: Math.max(0, Math.round(height)),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const isReady = size.width > 0 && size.height > 0;

  return (
    <div ref={hostRef} className={className}>
      {isReady ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
