"use client";

import * as React from "react";
import { io, type Socket } from "socket.io-client";

export interface LiveAlert {
  id: string;
  title: string;
  timestamp: string;
}

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = React.useState<LiveAlert[]>([]);

  React.useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "");

    socket.on("grade:posted", (payload: LiveAlert) => {
      setAlerts((prev) => [payload, ...prev].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return alerts;
}
