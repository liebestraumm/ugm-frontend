import { SignInRes } from "@hooks/useAuth";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import asyncStorage, { Keys } from "@utils/asyncStorage";
import client, { baseURL } from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { Profile, updateAuthState } from "app/store/auth";
import { updateActiveChat } from "app/store/chats";
import { updateChatViewed, updateConversation } from "app/store/conversation";
import { io } from "socket.io-client";

// Socket server URL - might be different from API URL
const socketURL = baseURL.replace('/api', ''); // Remove /api to get base server URL
const socket = io(socketURL, { path: "/socket-message", autoConnect: false });

type MessageProfile = {
  id: string;
  name: string;
  avatar?: string;
};

export type NewMessageResponse = {
  message: {
    id: string;
    time: string;
    text: string;
    user: MessageProfile;
    viewed: boolean;
  };
  from: MessageProfile;
  conversationId: string;
};

type SeenData = {
  messageId: string;
  conversationId: string;
};

export const handleSocketConnection = (
  profile: Profile,
  dispatch: Dispatch<UnknownAction>
) => {
  console.log("Connecting to socket with token:", profile.accessToken);
  console.log("Socket URL:", socketURL + "/socket-message");
  
  // Clear any existing listeners to prevent duplicates
  socket.off("connect");
  socket.off("disconnect");
  socket.off("chat:message");
  socket.off("chat:seen");
  socket.off("connect_error");
  
  socket.auth = { token: profile.accessToken };
  
  // Add a timeout to detect connection issues
  const connectionTimeout = setTimeout(() => {
    if (!socket.connected) {
      console.log("Socket connection timeout - server might not be running");
    }
  }, 5000);
  
  socket.connect();

  socket.on("connect", () => {
    console.log("Socket connected successfully");
    clearTimeout(connectionTimeout);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("chat:message", (data: NewMessageResponse) => {
    const { conversationId, from, message } = data;
    // this will update on going conversation or messages in between two users
    dispatch(
      updateConversation({
        conversationId,
        chat: message,
        peerProfile: from,
      })
    );

    // this will update active chats and updates chats screen
    dispatch(
      updateActiveChat({
        id: data.conversationId,
        lastMessage: data.message.text,
        peerProfile: data.message.user,
        timestamp: data.message.time,
        unreadChatCounts: 1,
      })
    );
  });

  socket.on("chat:seen", (seenData: SeenData) => {
    dispatch(updateChatViewed(seenData));
  });

  socket.on("connect_error", async (error) => {
    console.log("Socket connection error:", error.message);
    console.log("Socket connection error details:", error);
    
    if (error.message === "jwt expired") {
      const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);
      const res = await runAxiosAsync<SignInRes>(
        client.post(`${baseURL}/auth/refresh-token`, { refreshToken })
      );

      if (res) {
        await asyncStorage.save(Keys.AUTH_TOKEN, res.data.tokens.access);
        await asyncStorage.save(Keys.REFRESH_TOKEN, res.data.tokens.refresh);
        dispatch(
          updateAuthState({
            profile: { ...profile, accessToken: res.data.tokens.access },
            pending: false,
          })
        );
        socket.auth = { token: res.data.tokens.access };
        socket.connect();
      }
    }
  });
};

export default socket;
