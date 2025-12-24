import React from 'react'
import { useStreamClients } from '../hooks/use-stream-client';
import { StreamVideo } from '@stream-io/video-react-sdk';
import { Chat } from 'stream-chat-react';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamProvider = ({ children, user, token }) => {

  const { chatClient, videoClient } = useStreamClients({ apiKey, user, token });

  if (!chatClient || !videoClient) {

    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br ☐ from-gray-900 via-gray-800 to-gray-900">
        <p className="text-white text-xl font-semibold mt-6"> Connecting...</p>
      </div>
    )
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient}>
        {children}
      </Chat>
    </StreamVideo>
  )

}

export default StreamProvider