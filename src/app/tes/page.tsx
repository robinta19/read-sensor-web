"use client";

import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// inject Pusher ke window agar Echo bisa pakai
if (typeof window !== "undefined") {
  // @ts-ignore
  window.Pusher = Pusher;
}

export default function StatusPage() {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) ?? 8080,
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) ?? 8080,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
    });

    const connector: any = echo.connector;

    // cek koneksi
    connector.pusher.connection.bind("connected", () => {
      console.log("✅ Socket connected to Reverb");
      setConnected(true);
    });
    connector.pusher.connection.bind("disconnected", () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    });
    connector.pusher.connection.bind("error", (err: any) => {
      console.error("⚠️ Socket error:", err);
    });

    // listen ke channel & event
    echo.channel("node-status").listen(".status-updated", (data: any) => {
      console.log("📡 Event diterima:", data);
      setStatus(data.status);
    });

    // debug: log semua event global
    connector.pusher.connection.bind_global((eventName: string, data: any) => {
      console.log("🔥 Global event:", eventName, data);
    });

    return () => {
      echo.disconnect();
    };
  }, []);

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Realtime Status Listener</h1>

      <p>
        Koneksi:{" "}
        {connected ? (
          <span className="text-green-600">Connected ✅</span>
        ) : (
          <span className="text-red-600">Disconnected ❌</span>
        )}
      </p>

      {status ? (
        <div className="p-4 border rounded bg-green-50">
          <p>
            <strong>Status:</strong> {status}
          </p>
        </div>
      ) : (
        <p className="text-gray-600">Belum ada status update...</p>
      )}
    </div>
  );
}
