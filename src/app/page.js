"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    const name = username.trim() || "Guest";

    const callId = process.env.NEXT_PUBLIC_CALL_ID || "default-call-id";

    router.push(`/meeting/${callId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br ☐ from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="p-8 bg-gray-800/60 rounded-2x1 border border-gray-700 w-80 shadow-2x1">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Enter your name
        </h2>
        <input
          placeholder="Enter your name"
          className="px-4 py-3 w-full rounded-lg bg-gray-700/80 border border-gray-600 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="mt-5 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}
