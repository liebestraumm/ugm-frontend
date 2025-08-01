import CategoryList from "@components/lists/CategoryList";
import LatestProductList, {
  LatestProduct,
} from "@components/lists/LatestProductList";
import SearchBar from "@components/search/SearchBar";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ChatNotification from "@components/chat/ChatNotification";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AppStackParamList } from "app/navigators/AppNavigator";
import {
  ActiveChat,
  addNewActiveChats,
  getUnreadChatsCount,
} from "app/store/chats";
import { FC, useEffect, useState, useMemo } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LoadingAnimation from "@components/ui/LoadingAnimation";
import ProductGridView from "@components/grid/ProductGridView";
import colors from "@utils/colors";

interface Props {}

const Home: FC<Props> = (props) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
  const { authClient } = useClient();
  const dispatch = useDispatch();
  const totalUnreadMessages = useSelector(getUnreadChatsCount);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );
    if (res?.data?.products) {
      setProducts(res.data.products);
    }
  };

  const fetchLastChats = async () => {
    const res = await runAxiosAsync<{
      chats: ActiveChat[];
    }>(authClient("/conversation/last-chats"));

    if (res) {
      dispatch(addNewActiveChats(res.data.chats));
    }
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      setBusy(true);
      await fetchLatestProduct();
      await fetchLastChats();
      setBusy(false);
    };
    handleApiRequest();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <LoadingAnimation visible={busy} />
      <ChatNotification
        onPress={() => navigate("Chats")}
        indicate={totalUnreadMessages > 0}
      />
      <ScrollView style={styles.container}>
        <SearchBar onSearch={handleSearch} />
        <CategoryList
          onPress={(category) => navigate("ProductList", { category })}
        />
        
        {searchQuery.trim() ? (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchTitle}>
              Search Results for "{searchQuery}"
            </Text>
            {filteredProducts.length > 0 ? (
              <ProductGridView 
                data={filteredProducts} 
                onPress={({ id }) => navigate("SingleProduct", { id })} 
              />
            ) : (
              <Text style={styles.noResultsText}>
                No products found matching "{searchQuery}"
              </Text>
            )}
          </View>
        ) : (
          <LatestProductList
            data={products}
            onPress={({ id }) => navigate("SingleProduct", { id })}
          />
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    flex: 1,
  },
  searchResultsContainer: {
    marginTop: 20,
  },
  searchTitle: {
    fontWeight: "600",
    color: colors.primary,
    fontSize: 20,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  noResultsText: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 16,
    marginTop: 20,
    fontStyle: "italic",
  },
});

export default Home;
