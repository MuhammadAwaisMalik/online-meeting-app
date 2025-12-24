/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import StreamProvider from "@/app/components/stream-provider";
import { StreamTheme } from "@stream-io/video-react-sdk";
import MeetingRoom from "@/app/components/meeting-room";

const Meeting = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const callId = params.id;
  const name = searchParams.get("name") || "Guest";

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser({ id: name.toLowerCase().replace(/\s+/g, "-"), name: name });
  }, [name]);

  useEffect(() => {
    if (!user) return;

    const fetchToken = async () => {
      try {
        const response = await fetch("/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();

        if (response.ok) {
          setToken(data.token);
        } else {
          setError(data.error || "No Token returned");
        }
      } catch (err) {
        console.log("Error fetching token:", err);
        setError("Failed to fetch token");
      }
    };

    fetchToken();
  }, [user]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-500 font-bold text-lg mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Connecting...</p>
        </div>
      </div>
    );
  }

  const handleLeave = () => {
    router.push("/");
  };

  return (
    <StreamProvider user={user} token={token}>
      <StreamTheme>
        <MeetingRoom callId={callId} onLeave={handleLeave} userId={user.id} />
      </StreamTheme>
    </StreamProvider>
  );
};

export default Meeting;
