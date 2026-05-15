"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export type NewArticlesNotice = {
  message: string;
  count: number;
  timestamp: string;
};

export default function useSocket() {
  const [newArticlesNotice, setNewArticlesNotice] = useState<NewArticlesNotice | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001", {
      withCredentials: true,
    });

    socket.on("new_articles", (data: NewArticlesNotice) => {
      setNewArticlesNotice(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    newArticlesNotice,
    clearNewArticlesNotice: () => setNewArticlesNotice(null),
  };
}
