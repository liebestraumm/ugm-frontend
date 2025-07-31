import { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@screens/Profile";
import Chats from "@screens/Chats";
import Listings from "@screens/Listings";
import SingleProduct from "@screens/SingleProduct";
import { Product } from "app/store/listings";
import ChatWindow from "@screens/ChatWindow";
import EditProduct from "@screens/EditProduct";

export type ProfileNavigatorParamList = {
  Profile: undefined;
  Chats: undefined;
  Listings: undefined;
  SingleProduct: { product?: Product; id?: string };
  EditProduct: { product: Product } | undefined;
  ChatWindow: {
    conversationId: string;
    peerProfile: { id: string; name: string; avatar?: string };
  };
};

const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

interface Props {}

const ProfileNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Listings" component={Listings} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="ChatWindow" component={ChatWindow} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
