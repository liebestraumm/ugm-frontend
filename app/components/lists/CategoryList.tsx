import categories from "@utils/categories";
import colors from "@utils/colors";
import { FC, useCallback, memo } from "react";
import { View, StyleSheet, FlatList, Pressable, Text } from "react-native";

interface Props {
  onPress(category: string): void;
}

interface CategoryItemProps {
  category: { name: string; icon: React.ReactNode };
  onPress: (category: string) => void;
}

const LIST_ITEM_SIZE = 80;

const CategoryItem = memo<CategoryItemProps>(({ category, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(category.name);
  }, [category.name, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.listItem}
      accessibilityRole="button"
      accessibilityLabel={`Category: ${category.name}`}
      accessibilityHint="Double tap to select this category"
    >
      <View 
        style={styles.iconContainer}
        accessibilityLabel={`${category.name} icon`}
      >
        {category.icon}
      </View>
      <Text 
        numberOfLines={2} 
        style={styles.categoryName}
        accessibilityLabel={`Category name: ${category.name}`}
      >
        {category.name}
      </Text>
    </Pressable>
  );
});

const CategoryList: FC<Props> = ({ onPress }) => {
  const renderItem = useCallback(
    ({ item }: { item: { name: string; icon: React.ReactNode } }) => (
      <CategoryItem category={item} onPress={onPress} />
    ),
    [onPress]
  );

  const keyExtractor = useCallback((item: { name: string; icon: React.ReactNode }) => item.name, []);

  const getItemLayout = useCallback(
    (data: ArrayLike<{ name: string; icon: React.ReactNode }> | null | undefined, index: number) => ({
      length: LIST_ITEM_SIZE + 20, // Item width + marginRight
      offset: (LIST_ITEM_SIZE + 20) * index,
      index,
    }),
    []
  );

  // Early return if no categories
  if (!categories?.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        accessibilityLabel="Category list"
        accessibilityHint="Scroll horizontally to view more categories"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  listItem: {
    width: LIST_ITEM_SIZE,
    marginRight: 20,
  },
  iconContainer: {
    width: LIST_ITEM_SIZE,
    height: LIST_ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    paddingTop: 2,
    color: colors.primary,
  },
});

export default CategoryList;
