import AppHeader from "@components/ui/AppHeader";
import BackButton from "@components/buttons/BackButton";
import ProductImage from "@components/images/ProductImage";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { FC, useEffect, useState, useCallback, memo } from "react";
import { View, StyleSheet, FlatList, Text, Pressable, Dimensions } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileNavigatorParamList } from "@navigators/ProfileNavigator";
import { Product, getListings, updateListings } from "app/store/listings";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

type ListingResponse = {
  products: Product[];
};

interface ListingItemProps {
  item: Product;
  onPress: (product: Product) => void;
}

const ListingItem = memo<ListingItemProps>(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.listItem}
      accessibilityRole="button"
      accessibilityLabel={`Product: ${item.name}`}
      accessibilityHint="Double tap to view product details"
    >
      <ProductImage uri={item.thumbnail} />
      <Text 
        style={styles.productName} 
        numberOfLines={2}
        accessibilityLabel={`Product name: ${item.name}`}
      >
        {item.name}
      </Text>
    </Pressable>
  );
});

const Listings: FC<Props> = () => {
  const { navigate } =
    useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  const [fetching, setFetching] = useState(false);
  const { authClient } = useClient();
  const dispatch = useDispatch();
  const listings = useSelector(getListings);

  const fetchListings = useCallback(async () => {
    setFetching(true);
    try {
      const res = await runAxiosAsync<ListingResponse>(
        authClient.get("/product/listings")
      );
      if (res) {
        dispatch(updateListings(res.data.products));
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setFetching(false);
    }
  }, [authClient, dispatch]);

  const handleProductPress = useCallback((product: Product) => {
    navigate("SingleProduct", { product });
  }, [navigate]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ListingItem item={item} onPress={handleProductPress} />
    ),
    [handleProductPress]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  // Calculate item height for getItemLayout optimization
  const getItemLayout = useCallback(
    (data: ArrayLike<Product> | null | undefined, index: number) => {
      const { width } = Dimensions.get("screen");
      const imageWidth = width - size.padding * 2;
      const imageHeight = imageWidth / (16 / 9); // 16:9 aspect ratio
      const textHeight = 30; // fontSize: 20 + paddingTop: 10
      const bottomPadding = size.padding; // paddingBottom: 15
      const itemHeight = imageHeight + textHeight + bottomPadding;
      
      return {
        length: itemHeight,
        offset: itemHeight * index,
        index,
      };
    },
    []
  );

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Early return if no listings and not fetching
  if (!listings?.length && !fetching) {
    return (
      <>
        <AppHeader backButton={<BackButton />} />
        <View style={styles.container}>
          <Text style={styles.emptyText}>No listings found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <FlatList
          refreshing={fetching}
          onRefresh={fetchListings}
          data={listings}
          contentContainerStyle={styles.flatList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          accessibilityLabel="Product listings"
          accessibilityHint="Scroll to view more products"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  listItem: {
    paddingBottom: size.padding,
  },
  flatList: {
    paddingBottom: 20,
  },
  productName: {
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
    paddingTop: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 50,
  },
});

export default Listings;
