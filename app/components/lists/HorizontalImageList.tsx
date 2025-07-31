import { memo, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from "react-native";

interface HorizontalImageListProps {
  images: string[];
  onPress?: (imageUrl: string, index: number) => void;
  onLongPress?: (imageUrl: string, index: number) => void;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  showsHorizontalScrollIndicator?: boolean;
  testID?: string;
}

interface ImageItemProps {
  imageUrl: string;
  index: number;
  onPress?: (imageUrl: string, index: number) => void;
  onLongPress?: (imageUrl: string, index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const ImageItem = memo<ImageItemProps>(
  ({ imageUrl, index, onPress, onLongPress, style }) => {
    const handlePress = useCallback(() => {
      onPress?.(imageUrl, index);
    }, [imageUrl, index, onPress]);

    const handleLongPress = useCallback(() => {
      onLongPress?.(imageUrl, index);
    }, [imageUrl, index, onLongPress]);

    const handleImageError = useCallback(
      (error: NativeSyntheticEvent<ImageErrorEventData>) => {
        console.warn(
          `Failed to load image at index ${index}:`,
          error.nativeEvent.error
        );
      },
      [index]
    );

    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[styles.listItem, style]}
        accessibilityRole="button"
        accessibilityLabel={`Image ${index + 1}`}
        accessibilityHint="Double tap to select this image"
      >
        <Image
          style={styles.image}
          source={{ uri: imageUrl }}
          onError={handleImageError}
          accessibilityLabel={`Image ${index + 1}`}
          resizeMode="cover"
        />
      </Pressable>
    );
  }
);

const HorizontalImageList: React.FC<HorizontalImageListProps> = ({
  images,
  style,
  itemStyle,
  onPress,
  onLongPress,
  showsHorizontalScrollIndicator = false,
  testID,
}) => {
  // Early return if no images
  if (!images?.length) {
    return null;
  }

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <ImageItem
        imageUrl={item}
        index={index}
        onPress={onPress}
        onLongPress={onLongPress}
        style={itemStyle}
      />
    ),
    [onPress, onLongPress, itemStyle]
  );

  const keyExtractor = (item: string, index: number) => `${item}-${index}`;

  const getItemLayout = useCallback(
    (data: ArrayLike<string> | null | undefined, index: number) => ({
      length: 70, // Item width (same as styles.listItem.width)
      offset: 70 * index + 5 * index, // Account for marginLeft: 5
      index,
    }),
    []
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      horizontal
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      contentContainerStyle={style}
      testID={testID}
      accessibilityLabel="Horizontal image list"
      accessibilityHint="Scroll horizontally to view more images"
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
    overflow: "hidden",
  },
  image: {
    flex: 1,
  },
});

export default HorizontalImageList;
