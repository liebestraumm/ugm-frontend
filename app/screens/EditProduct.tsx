import AppHeader from "@components/ui/AppHeader";
import HorizontalImageList from "@components/lists/HorizontalImageList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@components/buttons/BackButton";
import colors from "@utils/colors";
import size from "@utils/size";
import { ProfileNavigatorParamList } from "app/navigators/ProfileNavigator";
import { FC, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import FormInput from "@components/forms/FormInput";
import DatePicker from "@components/ui/DatePicker";
import OptionModal from "@components/modals/OptionModal";
import useClient from "app/hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { selectImages } from "@utils/helper";
import CategoryOptions from "@components/ui/CategoryOptions";
import AppButton from "@components/buttons/AppButton";
import { newProductSchema } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import mime from "mime";
import LoadingAnimation from "@components/ui/LoadingAnimation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFormSubmit from "@hooks/useFormSubmit";

type Props = NativeStackScreenProps<ProfileNavigatorParamList, "EditProduct">;

interface EditProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date;
}

const imageOptions = [
  { value: "Use as Thumbnail", id: "thumb" },
  { value: "Remove Image", id: "remove" },
];

const EditProduct: FC<Props> = ({ route }) => {
  const productInfoToUpdate = {
    ...route?.params?.product,
    price: route?.params?.product?.price.toString(),
    purchasingDate: new Date(route?.params?.product?.date || ""),
  };

  const [selectedImage, setSelectedImage] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [images, setImages] = useState<string[]>(productInfoToUpdate.image || []);
  const [thumbnail, setThumbnail] = useState<string>(productInfoToUpdate.thumbnail || "");
  const { authClient } = useClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditProductFormData>({
    resolver: yupResolver(newProductSchema),
    defaultValues: {
      name: productInfoToUpdate.name || "",
      description: productInfoToUpdate.description || "",
      category: productInfoToUpdate.category || "",
      price: productInfoToUpdate.price || "",
      purchasingDate: productInfoToUpdate.purchasingDate,
    },
  });

  const handleUpdateProduct = async (data: EditProductFormData) => {
    const formData = new FormData();

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    type productInfoKeys = keyof typeof data;

    for (let key in data) {
      const value = data[key as productInfoKeys];
      if (value instanceof Date) formData.append(key, value.toISOString());
      else formData.append(key, value);
    }

    images?.forEach((img, index) => {
      if (!img.startsWith("https://res.cloudinary.com")) {
        formData.append("images", {
          uri: img,
          name: "image_" + index,
          type: mime.getType(img) || "image/jpg",
        } as any);
      }
    });

    const res = await runAxiosAsync<{ message: string }>(
      authClient.patch("/product/" + productInfoToUpdate.id, formData)
    );

    if (res) {
      showMessage({ message: res.data.message, type: "success" });
    }
  };

  const { isSubmitting, submit } = useFormSubmit<EditProductFormData>({
    schema: newProductSchema,
    onSuccess: handleUpdateProduct,
  });

  const onLongPress = (image: string) => {
    setSelectedImage(image);
    setShowImageOptions(true);
  };

  const removeSelectedImage = async () => {
    const notLocalImage = selectedImage.startsWith(
      "https://res.cloudinary.com"
    );

    const newImages = images?.filter((img) => img !== selectedImage);
    setImages(newImages);

    if (notLocalImage) {
      const splittedItems = selectedImage.split("/");
      const imageId = splittedItems[splittedItems.length - 1].split(".")[0];
      await runAxiosAsync(
        authClient.delete(`/product/image/${productInfoToUpdate.id}/${imageId}`)
      );
    }
  };

  const handleOnImageSelect = async () => {
    const newImages = await selectImages();
    const oldImages = images || [];
    const updatedImages = oldImages.concat(newImages);
    setImages([...updatedImages]);
  };

  const makeSelectedImageAsThumbnail = () => {
    if (selectedImage.startsWith("https://res.cloudinary.com")) {
      setThumbnail(selectedImage);
    }
  };

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Images</Text>
          <HorizontalImageList
            images={images || []}
            onLongPress={onLongPress}
          />
          <Pressable onPress={handleOnImageSelect} style={styles.imageSelector}>
            <FontAwesome5 name="images" size={30} color={colors.primary} />
          </Pressable>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                placeholder="Product name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                placeholder="Price"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                error={errors.price?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="purchasingDate"
            render={({ field: { value, onChange } }) => (
              <DatePicker
                title="Purchasing Date: "
                value={value}
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <CategoryOptions
                onSelect={onChange}
                title={value || "Category"}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                placeholder="Description"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                error={errors.description?.message}
              />
            )}
          />

          {isDirty && (
            <AppButton
              title={isSubmitting ? "Updating Product..." : "Update Product"}
              onPress={handleSubmit(submit)}
              disabled={isSubmitting}
            />
          )}
        </ScrollView>
      </View>

      <OptionModal
        options={imageOptions}
        visible={showImageOptions}
        onRequestClose={setShowImageOptions}
        renderItem={(option) => {
          return <Text style={styles.option}>{option.value}</Text>;
        }}
        onPress={({ id }) => {
          if (id === "thumb") makeSelectedImageAsThumbnail();
          if (id === "remove") removeSelectedImage();
        }}
      />
      <LoadingAnimation visible={isSubmitting} />
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
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  imageSelector: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  option: {
    paddingVertical: 10,
    color: colors.primary,
  },
});

export default EditProduct;
