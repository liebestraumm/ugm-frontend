import AppHeader from "@components/ui/AppHeader";
import { LatestProduct } from "@components/lists/LatestProductList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@components/buttons/BackButton";
import EmptyView from "@components/ui/EmptyView";
import ProductCard from "@components/cards/ProductCard";
import colors from "@utils/colors";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "app/hooks/useClient";
import { AppStackParamList } from "app/navigators/AppNavigator";
import { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import LoadingAnimation from "@components/ui/LoadingAnimation";

type Props = NativeStackScreenProps<AppStackParamList, "ProductList">;

const col = 2;

const ProductList: FC<Props> = ({ route, navigation }) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();
  const { category } = route.params;
  const [busy, setBusy] = useState(false);

  const isOdd = products.length % col !== 0;

  const fetchProducts = async (category: string) => {
    setBusy(true);
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/by-category/" + category)
    );
    if (res) {
      setProducts(res.data.products);
    }
    setBusy(false);
  };

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

  return (
    <>
      <LoadingAnimation visible={busy} />
      <View style={styles.container}>
        <AppHeader
          backButton={<BackButton />}
          center={<Text style={styles.title}>{category}</Text>}
        />
        
        {!busy && products.length === 0 ? (
          <EmptyView title="There is no product in this category!" />
        ) : (
          <FlatList
            numColumns={col}
            data={products}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flex: isOdd && index === products.length - 1 ? 1 / col : 1,
                }}
              >
                <ProductCard
                  product={item}
                  onPress={({ id }) => navigation.navigate("SingleProduct", { id })}
                />
              </View>
            )}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontWeight: "600",
    color: colors.primary,
    paddingBottom: 5,
    fontSize: 18,
  },
});

export default ProductList;
