import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export function useStreamClients({ apiKey, user, token }) {
  const [chatClient, setChatClient] = useState(null);
  const [videoClient, setVideoClient] = useState(null);

  useEffect(() => {
    if (!apiKey || !user || !token) return;

    let isMounted = true;

    const initClients = async () => {
      try {
        const tokenProvider = () => Promise.resolve(token);

        const myVideoClient = new StreamVideoClient({
          apiKey,
          user,
          tokenProvider,
        });

        const myChatClient = StreamChat.getInstance(apiKey);

        await myChatClient.connectUser(user, token);

        if (isMounted) {
          setVideoClient(myVideoClient);
          setChatClient(myChatClient);
        }
      } catch (error) {
        console.error("Error initializing Stream clients:", error);
      }
    };

    initClients();
    return () => {
      isMounted = false;
      if (videoClient) {
        videoClient.disconnectUser().catch(console.error);
      }
      if (chatClient) {
        chatClient.disconnectUser().catch(console.error);
      }
    };
  }, [apiKey, user, token]);

  return { chatClient, videoClient };
}
