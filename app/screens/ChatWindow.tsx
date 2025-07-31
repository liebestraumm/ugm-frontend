import AppHeader from "@components/ui/AppHeader";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@components/buttons/BackButton";
import EmptyChatContainer from "@components/ui/EmptyChatContainer";
import EmptyView from "@components/ui/EmptyView";
import PeerProfile from "@components/ui/PeerProfile";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useAuth from "app/hooks/useAuth";
import useClient from "app/hooks/useClient";
import { AppStackParamList } from "app/navigators/AppNavigator";
import socket, { NewMessageResponse } from "app/socket";
import {
  Conversation,
  addConversation,
  selectConversationById,
  updateConversation,
} from "app/store/conversation";
import { FC, useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";

type Props = NativeStackScreenProps<AppStackParamList, "ChatWindow">;

type OutGoingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  to: string;
  conversationId: string;
};

const getTime = (value: IMessage["createdAt"]) => {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const formatConversationToIMessage = (value?: Conversation): IMessage[] => {
  const formattedValues = value?.chats.map((chat) => {
    return {
      _id: chat.id,
      text: chat.text,
      createdAt: new Date(chat.time),
      received: chat.viewed,
      user: {
        _id: chat.user.id,
        name: chat.user.name,
        avatar: chat.user.avatar,
      },
    };
  });

  const messages = formattedValues || [];

  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const ChatWindow: FC<Props> = ({ route }) => {
  const { authState } = useAuth();
  const { conversationId, peerProfile } = route.params;
  const conversation = useSelector(selectConversationById(conversationId));
  const dispatch = useDispatch();
  const { authClient } = useClient();
  const [fetchingChats, setFetchingChats] = useState(false);

  const profile = authState.profile;

  const handleOnMessageSend = (messages: IMessage[]) => {
    console.log("Sending message:", messages);
    if (!profile) return;

    const currentMessage = messages[messages.length - 1];

    const newMessage: OutGoingMessage = {
      message: {
        id: currentMessage._id.toString(),
        text: currentMessage.text,
        time: getTime(currentMessage.createdAt),
        user: { id: profile.id, name: profile.name, avatar: profile.avatar },
      },
      conversationId,
      to: peerProfile.id,
    };

    // this will update our store and also update the UI
    dispatch(
      updateConversation({
        conversationId,
        chat: { ...newMessage.message, viewed: false },
        peerProfile,
      })
    );

    // sending message to our api
    console.log("Emitting chat:new event:", newMessage);
    console.log("Socket connected:", socket.connected);
    
    if (socket.connected) {
      socket.emit("chat:new", newMessage);
    } else {
      console.log("Socket not connected - message will not be sent to server");
      // TODO: Implement fallback mechanism (e.g., store message locally and retry later)
    }
  };

  const fetchOldChats = async () => {
    setFetchingChats(true);
    const res = await runAxiosAsync<{ conversation: Conversation }>(
      authClient("/conversation/chats/" + conversationId)
    );
    setFetchingChats(false);

    if (res?.data?.conversation) {
      dispatch(addConversation([res.data.conversation]));
    }
  };

  const sendSeenRequest = () => {
    runAxiosAsync(
      authClient.patch(`/conversation/seen/${conversationId}/${peerProfile.id}`)
    );
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      await fetchOldChats();
      // we want to update viewed property inside our database
      await sendSeenRequest();
    };

    handleApiRequest();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const updateSeenStatus = (data: NewMessageResponse) => {
        // Only handle messages for this conversation
        if (data.conversationId === conversationId) {
          socket.emit("chat:seen", {
            messageId: data.message.id,
            conversationId,
            peerId: peerProfile.id,
          });
        }
      };

      // Remove any existing listeners first
      socket.off("chat:message", updateSeenStatus);
      
      // Add the listener
      socket.on("chat:message", updateSeenStatus);

      return () => {
        // Clean up the listener when component loses focus
        socket.off("chat:message", updateSeenStatus);
      };
    }, [conversationId, peerProfile.id])
  );

  if (!profile) return null;

  if (fetchingChats) return <EmptyView title="Please wait..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        backButton={<BackButton />}
        center={
          <PeerProfile name={peerProfile.name} avatar={peerProfile.avatar} />
        }
      />

      <GiftedChat
        messages={formatConversationToIMessage(conversation)}
        user={{
          _id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        }}
        onSend={handleOnMessageSend}
        renderChatEmpty={() => <EmptyChatContainer />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatWindow;
