import AppHeader from "@components/ui/AppHeader";
import RecentChat, { Separator } from "@components/chat/RecentChat";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import BackButton from "@components/buttons/BackButton";
import EmptyView from "@components/ui/EmptyView";
import size from "@utils/size";
import { ProfileNavigatorParamList } from "app/navigators/ProfileNavigator";
import {
  ActiveChat,
  getActiveChats,
  removeUnreadChatCount,
} from "app/store/chats";
import { FC } from "react";
import { StyleSheet, FlatList, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

const Chats: FC<Props> = (props) => {
  const { navigate } =
    useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  const chats = useSelector(getActiveChats);
  const dispatch = useDispatch();

  const onChatPress = (chat: ActiveChat) => {
    // remove the unread chat counts
    dispatch(removeUnreadChatCount(chat.id));

    // navigate our users to chat screen
    navigate("ChatWindow", {
      conversationId: chat.id,
      peerProfile: chat.peerProfile,
    });
  };

  if (!chats.length)
    return (
      <>
        <AppHeader backButton={<BackButton />} />
        <EmptyView title="There is no chats." />
      </>
    );

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <FlatList
        data={chats}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Pressable onPress={() => onChatPress(item)}>
            <RecentChat
              name={item.peerProfile.name}
              avatar={item.peerProfile.avatar}
              timestamp={item.timestamp}
              lastMessage={item.lastMessage}
              unreadMessageCount={item.unreadChatCounts}
            />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
});

export default Chats;
