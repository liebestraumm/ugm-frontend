import { FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@screens/Home";
import Chats from "@screens/Chats";
import ProductList from "@screens/ProductList";
import { Product } from "app/store/listings";
import SingleProduct from "@screens/SingleProduct";
import ChatWindow from "@screens/ChatWindow";

export type AppStackParamList = {
  Home: undefined;
  Chats: undefined;
  ProductList: { category: string };
  SingleProduct: { product?: Product; id?: string };
  ChatWindow: {
    conversationId: string;
    peerProfile: { id: string; name: string; avatar?: string };
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="ChatWindow" component={ChatWindow} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
