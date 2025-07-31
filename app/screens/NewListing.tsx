import FormInput from "@components/forms/FormInput";
import { FC, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import mime from "mime";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "@utils/colors";
import DatePicker from "@components/ui/DatePicker";
import OptionModal from "@components/modals/OptionModal";
import AppButton from "@components/buttons/AppButton";
import CustomKeyAvoidingView from "@components/ui/CustomKeyAvoidingView";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import HorizontalImageList from "@components/lists/HorizontalImageList";
import { newProductSchema } from "@utils/validator";
import useClient from "app/hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import LoadingAnimation from "@components/ui/LoadingAnimation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFormSubmit from "@hooks/useFormSubmit";
import CategoryOptions from "@components/ui/CategoryOptions";

interface NewListingFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date;
}

interface Props {}

const imageOptions = [{ value: "Remove Image", id: "remove" }];

const NewListing: FC<Props> = (props) => {
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const { authClient } = useClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NewListingFormData>({
    resolver: yupResolver(newProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      purchasingDate: new Date(),
    },
  });

  const handleListProduct = async (data: NewListingFormData) => {
    const formData = new FormData();

    type productInfoKeys = keyof typeof data;

    for (let key in data) {
      const value = data[key as productInfoKeys];

      if (value instanceof Date) formData.append(key, value.toISOString());
      else formData.append(key, value);
    }

    // appending images
    const newImages = images.map((img, index) => ({
      name: "image_" + index,
      type: mime.getType(img),
      uri: img,
    }));

    for (let img of newImages) {
      formData.append("images", img as any);
    }

    const res = await runAxiosAsync<{ message: string }>(
      authClient.post("/product/list", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );

    if (res) {
      showMessage({ message: res.data.message, type: "success" });
      // Reset form and images
      setValue("name", "");
      setValue("description", "");
      setValue("category", "");
      setValue("price", "");
      setValue("purchasingDate", new Date());
      setImages([]);
    }
  };

  const { isSubmitting, submit } = useFormSubmit<NewListingFormData>({
    schema: newProductSchema,
    onSuccess: handleListProduct,
  });

  const handleOnImageSelection = async () => {
    try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.3,
        allowsMultipleSelection: true,
      });

      if (!assets) return;

      const imageUris = assets.map(({ uri }) => uri);
      setImages([...images, ...imageUris]);
    } catch (error) {
      showMessage({ message: (error as any).message, type: "danger" });
    }
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Pressable
            onPress={handleOnImageSelection}
            style={styles.fileSelector}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name="images" size={24} color="black" />
            </View>
            <Text style={styles.btnTitle}>Add Images</Text>
          </Pressable>

          <HorizontalImageList
            images={images}
            onLongPress={(img) => {
              setSelectedImage(img);
              setShowImageOptions(true);
            }}
          />
        </View>

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

        <AppButton
          title={isSubmitting ? "Listing Product..." : "List Product"}
          onPress={handleSubmit(submit)}
          disabled={isSubmitting}
        />

        {/* Image Options */}
        <OptionModal
          visible={showImageOptions}
          onRequestClose={setShowImageOptions}
          options={imageOptions}
          renderItem={(item) => {
            return <Text style={styles.imageOption}>{item.value}</Text>;
          }}
          onPress={(option) => {
            if (option.id === "remove") {
              const newImages = images.filter((img) => img !== selectedImage);
              setImages([...newImages]);
            }
          }}
        />
      </View>
      <LoadingAnimation visible={isSubmitting} />
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  imageContainer: { flexDirection: "row" },
  btnTitle: {
    color: colors.primary,
    marginTop: 5,
  },
  fileSelector: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },
  selectedImage: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5,
  },
  categoryTitle: {
    color: colors.primary,
  },
  imageOption: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.primary,
    padding: 10,
  },
});

export default NewListing;
